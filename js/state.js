/**
 * Správa uživatelského stavu v localStorage:
 * - XP (přírůstek xpDelta při opakování), exponenciální levely, hvězdy, pokusy
 * - Režim progrese (sequential vs. open) a pravidla odemykání kapitol
 * - Odznaky kapitol (všechny podkapitoly na >= 2 hvězdy)
 * - Neměnné sessionId, původní initialStudentId, neomezovaná historie přejmenování (nameHistory)
 * - Anti-cheat auditní log s časovou osou pokusů a dobou řešení
 */
import { APP_CONFIG, CHAPTER_BADGES, getLevelInfo } from './config.js';
import { calculateStars } from './validator.js';

function generateSessionId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomBlock = (length) => {
    let out = '';
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(length);
      crypto.getRandomValues(bytes);
      for (let i = 0; i < length; i++) {
        out += alphabet[bytes[i] % alphabet.length];
      }
      return out;
    }
    for (let i = 0; i < length; i++) {
      out += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return out;
  };
  return `UML-${randomBlock(4)}-${randomBlock(4)}`;
}

function createInitialState() {
  const now = new Date().toISOString();
  return {
    version: APP_CONFIG.version,
    sessionId: generateSessionId(),
    createdAt: now,
    updatedAt: now,
    studentId: '',
    initialStudentId: '',
    nameHistory: [], // Pole objektů { ts, from, to } – nikdy se neořezává
    onboardingSeen: false,
    progressionMode: 'sequential', // 'sequential' | 'open'
    everUsedOpenMode: false,
    xp: 0,
    subchapters: {}, // { [id]: { bestXp, stars, attempts, completed, firstCompletedAt, lastAttemptAt, savedCanvas } }
    badges: [],
    auditLog: [
      {
        ts: now,
        type: 'SESSION_INIT',
        details: 'Zahájení nového profilu učedníka'
      }
    ]
  };
}

let state = loadState();

export function loadState() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);

    // Zpětná kompatibilita (migrace pole bestScore -> bestXp)
    const migratedSubchapters = {};
    for (const [id, entry] of Object.entries(parsed.subchapters || {})) {
      migratedSubchapters[id] = {
        ...entry,
        bestXp: entry.bestXp ?? entry.bestScore ?? 0
      };
    }

    const base = createInitialState();
    const currentStudentId = String(parsed.studentId || '').trim();
    const needsSessionIdMigration = !parsed.sessionId || typeof parsed.sessionId !== 'string';
    const needsInitialStudentMigration = parsed.initialStudentId === undefined;
    const needsNameHistoryMigration = !Array.isArray(parsed.nameHistory);

    const loaded = {
      ...base,
      ...parsed,
      sessionId: needsSessionIdMigration ? base.sessionId : parsed.sessionId,
      studentId: currentStudentId,
      initialStudentId: needsInitialStudentMigration
        ? currentStudentId
        : String(parsed.initialStudentId || '').trim(),
      nameHistory: needsNameHistoryMigration ? [] : parsed.nameHistory,
      subchapters: migratedSubchapters
    };

    // U starších profilů jednorázově dogeneruje a uloží sessionId (a doplněná pole)
    if (needsSessionIdMigration || needsInitialStudentMigration || needsNameHistoryMigration) {
      try {
        localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(loaded));
      } catch (persistErr) {
        console.warn('Nepodařilo se uložit migrovaný stav do localStorage:', persistErr);
      }
    }

    return loaded;
  } catch (err) {
    console.warn('Nepodařilo se načíst stav z localStorage, zakládám čistý profil:', err);
    return createInitialState();
  }
}

export function saveState() {
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(state));
  } catch (err) {
    console.error('Chyba při ukládání stavu do localStorage:', err);
  }
}

export function getState() {
  return state;
}

export function completeOnboarding(studentName = '') {
  state.onboardingSeen = true;
  const trimmed = String(studentName || '').trim();
  if (trimmed) {
    if (!state.initialStudentId) {
      state.initialStudentId = trimmed;
    }
    state.studentId = trimmed;
  }
  appendSystemAuditEvent('ONBOARDING_DONE', trimmed ? `Učedník: ${trimmed}` : 'Bez zadaného jména');
  saveState();
}

export function setStudentId(studentId) {
  const next = String(studentId || '').trim();
  const prev = String(state.studentId || '').trim();

  if (!Array.isArray(state.nameHistory)) {
    state.nameHistory = [];
  }

  // Pokud je přejmenování zakázáno a původní jméno už bylo jednou nastaveno, změnu ignoruj
  if (APP_CONFIG.allowStudentRename === false && state.initialStudentId) {
    return { changed: false, locked: true, studentId: state.studentId };
  }

  if (next === prev) {
    if (!state.initialStudentId && next) {
      state.initialStudentId = next;
      saveState();
    }
    return { changed: false, locked: false, studentId: state.studentId };
  }

  const hadInitialName = Boolean(state.initialStudentId);
  if (!hadInitialName && next) {
    state.initialStudentId = next;
  }

  state.studentId = next;

  if (hadInitialName) {
    state.nameHistory.push({
      ts: new Date().toISOString(),
      from: prev,
      to: next
    });
    appendSystemAuditEvent(
      'SET_STUDENT_ID',
      `Změna jména: ${prev || '(prázdné)'} → ${next || '(prázdné)'}`
    );
  } else {
    appendSystemAuditEvent('SET_STUDENT_ID', next || '(prázdné)');
  }

  saveState();
  return { changed: true, locked: false, studentId: state.studentId };
}

export function appendSystemAuditEvent(type, details = '') {
  state.auditLog.push({
    ts: new Date().toISOString(),
    type,
    progressionMode: state.progressionMode,
    totalXp: state.xp,
    level: getLevelInfo(state.xp).level,
    details
  });
  trimAuditLog();
}

function trimAuditLog() {
  if (state.auditLog.length > 300) {
    state.auditLog = state.auditLog.slice(-300);
  }
}

/**
 * Přepne režim progrese a zapíše událost do auditního logu.
 * Vrací logovací záznam vhodný i pro telemetrii.
 */
export function setProgressionMode(mode) {
  if (mode !== 'sequential' && mode !== 'open') return null;
  if (state.progressionMode === mode) return null;

  state.progressionMode = mode;
  if (mode === 'open') {
    state.everUsedOpenMode = true;
  }

  const eventEntry = {
    ts: new Date().toISOString(),
    type: 'MODE_SWITCH',
    progressionMode: mode,
    totalXp: state.xp,
    level: getLevelInfo(state.xp).level,
    details: mode === 'open' ? 'Přepnuto na Volný průchod (open)' : 'Přepnuto na Řízenou cestu (sequential)'
  };
  state.auditLog.push(eventEntry);
  trimAuditLog();
  saveState();
  return eventEntry;
}

export function getSubchapterProgress(subchapterId) {
  const entry = state.subchapters[subchapterId];
  if (!entry) {
    return {
      bestXp: 0,
      stars: 0,
      attempts: 0,
      completed: false,
      firstCompletedAt: null,
      lastAttemptAt: null,
      savedCanvas: null
    };
  }
  return {
    ...entry,
    bestXp: entry.bestXp ?? entry.bestScore ?? 0
  };
}

export function saveCanvasDraft(subchapterId, canvasData) {
  const existing = getSubchapterProgress(subchapterId);
  state.subchapters[subchapterId] = {
    ...existing,
    savedCanvas: canvasData
  };
  saveState();
}

export function getCanvasDraft(subchapterId) {
  return state.subchapters[subchapterId]?.savedCanvas || null;
}

/**
 * Zaznamená průběžnou kontrolu diagramu s chybami:
 * - Neukládá splnění ani XP a neodemkne další krok
 * - Navýší počítadlo pokusů (attempts) a zapíše událost VALIDATION_CHECK pro telemetrii a auditní log
 */
export function recordValidationCheck(subchapter, validationResult, canvasData, durationSec = 0) {
  if (!validationResult || validationResult.passed === false || validationResult.isEmptyCanvas) {
    return null;
  }

  const now = new Date().toISOString();
  const prev = getSubchapterProgress(subchapter.id);
  const attempts = prev.attempts + 1;

  state.subchapters[subchapter.id] = {
    ...prev,
    attempts,
    lastAttemptAt: now,
    savedCanvas: canvasData
  };

  const levelInfo = getLevelInfo(state.xp);
  const auditEntry = {
    ts: now,
    type: 'VALIDATION_CHECK',
    subchapterId: subchapter.id,
    errors: validationResult.errors,
    xp: validationResult.xp,
    xpDelta: 0,
    totalXp: state.xp,
    level: levelInfo.level,
    progressionMode: state.progressionMode,
    attempts,
    durationSec: Math.max(0, Math.round(durationSec))
  };

  state.auditLog.push(auditEntry);
  trimAuditLog();
  saveState();

  return {
    attempts,
    auditEntry
  };
}

/**
 * Čistý (bez mutace stavu) náhled dopadu případného potvrzení výsledku.
 * Používá se při kontrole diagramu s chybami, než student výsledek skutečně potvrdí a uloží.
 */
export function previewSubchapterCompletion(
  subchapter,
  validationResult,
  allChapters,
  { incrementAttempt = true } = {}
) {
  const prev = getSubchapterProgress(subchapter.id);
  const previousBestXp = prev.bestXp || 0;
  const currentXp = validationResult.passed ? validationResult.xp : 0;
  const xpDelta = validationResult.passed ? Math.max(0, currentXp - previousBestXp) : 0;
  const newBestXp = validationResult.passed ? Math.max(previousBestXp, currentXp) : previousBestXp;
  const newStars = validationResult.passed ? calculateStars(newBestXp) : prev.stars;
  const attempts = incrementAttempt ? prev.attempts + 1 : Math.max(1, prev.attempts);

  const prevLevelInfo = getLevelInfo(state.xp);
  const newLevelInfo = getLevelInfo(state.xp + xpDelta);
  const leveledUp = newLevelInfo.level > prevLevelInfo.level;

  const prevBadges = new Set(state.badges);
  const newlyUnlockedBadges = [];

  if (validationResult.passed) {
    for (const badge of CHAPTER_BADGES) {
      if (prevBadges.has(badge.id)) continue;
      const chapter = allChapters.find((ch) => ch.id === badge.chapterId);
      if (!chapter || !chapter.subchapters?.length) continue;

      const wouldMaster = chapter.subchapters.every((sub) => {
        if (sub.id === subchapter.id) {
          return newStars >= APP_CONFIG.chapterMasteryMinStars;
        }
        const prog = getSubchapterProgress(sub.id);
        return prog.completed && prog.stars >= APP_CONFIG.chapterMasteryMinStars;
      });

      if (wouldMaster) {
        newlyUnlockedBadges.push(badge.id);
      }
    }
  }

  return {
    xpDelta,
    newBestXp,
    newStars,
    attempts,
    leveledUp,
    prevLevelInfo,
    newLevelInfo,
    newlyUnlockedBadges
  };
}

/**
 * Zaznamená splnění / opakování podkapitoly:
 * - Neukládá prázdný / neprošlý pokus (validationResult.passed === false)
 * - xpDelta = Math.max(0, currentXp - previousBestXp)
 * - Celkové XP se navýší o xpDelta
 * - Hvězdy se aktualizují podle newBestXp
 * - Vytvoří detailní anti-cheat záznam (včetně doby řešení v sekundách)
 * - Zkontroluje odemčení nových kapitolních odznaků a postupu na vyšší úroveň
 */
export function recordSubchapterCompletion(
  subchapter,
  validationResult,
  canvasData,
  allChapters,
  durationSec = 0,
  { incrementAttempt = true } = {}
) {
  if (!validationResult || validationResult.passed === false || validationResult.isEmptyCanvas) {
    return null;
  }

  const now = new Date().toISOString();
  const prev = getSubchapterProgress(subchapter.id);

  const previousBestXp = prev.bestXp || 0;
  const currentXp = validationResult.xp;
  const xpDelta = Math.max(0, currentXp - previousBestXp);
  const newBestXp = Math.max(previousBestXp, currentXp);
  const newStars = calculateStars(newBestXp);
  const attempts = incrementAttempt ? prev.attempts + 1 : Math.max(1, prev.attempts);

  const prevLevelInfo = getLevelInfo(state.xp);
  const prevBadges = new Set(state.badges);

  // Aktualizace stavu podkapitoly a celkového XP
  state.subchapters[subchapter.id] = {
    ...prev,
    bestXp: newBestXp,
    stars: newStars,
    attempts,
    completed: true,
    firstCompletedAt: prev.firstCompletedAt || now,
    lastAttemptAt: now,
    savedCanvas: canvasData
  };

  state.xp += xpDelta;

  // Vyhodnocení odznaků kapitol (všechny podkapitoly v kapitole na >= 2 hvězdy)
  recalculateChapterBadges(allChapters);

  const newLevelInfo = getLevelInfo(state.xp);
  const leveledUp = newLevelInfo.level > prevLevelInfo.level;
  const newlyUnlockedBadges = state.badges.filter((id) => !prevBadges.has(id));

  // Strukturovaný anti-cheat záznam
  const auditEntry = {
    ts: now,
    type: 'SUBCHAPTER_COMPLETE',
    subchapterId: subchapter.id,
    errors: validationResult.errors,
    xp: currentXp,
    xpDelta,
    totalXp: state.xp,
    level: newLevelInfo.level,
    progressionMode: state.progressionMode,
    attempts,
    durationSec: Math.max(0, Math.round(durationSec))
  };

  state.auditLog.push(auditEntry);
  trimAuditLog();
  saveState();

  return {
    xpDelta,
    newBestXp,
    newStars,
    attempts,
    leveledUp,
    prevLevelInfo,
    newLevelInfo,
    newlyUnlockedBadges,
    auditEntry
  };
}

/**
 * Zkontroluje, zda je kapitola splněna (všechny její podkapitoly mají >= 2 hvězdy / >= 80 XP).
 */
export function isChapterMastered(chapter) {
  if (!chapter || !Array.isArray(chapter.subchapters) || chapter.subchapters.length === 0) {
    return false;
  }
  return chapter.subchapters.every((sub) => {
    const prog = getSubchapterProgress(sub.id);
    return prog.completed && prog.stars >= APP_CONFIG.chapterMasteryMinStars;
  });
}

/**
 * Přepočítá odznaky kapitol podle aktuálních hvězd v podkapitolách.
 */
export function recalculateChapterBadges(allChapters) {
  const unlocked = new Set(state.badges);

  for (const badge of CHAPTER_BADGES) {
    const chapter = allChapters.find((ch) => ch.id === badge.chapterId);
    if (chapter && isChapterMastered(chapter)) {
      unlocked.add(badge.id);
    }
  }

  state.badges = Array.from(unlocked);
}

/**
 * Pravidla odemykání podkapitol:
 * - Režim 'open': vše odemčeno.
 * - Režim 'sequential':
 *   1) Teoretická kapitola: 1. podkapitola je vždy odemčena, další se odemykají po splnění předchozí (i -> i+1).
 *   2) Praktické kapitoly: 1. podkapitola každé z 3 praktických kapitol se odemkne teprve po splnění
 *      VŠECH 7 podkapitol teoretické kapitoly; kroky 2–4 se pak v rámci své kapitoly odemykají sekvenčně.
 */
export function isSubchapterUnlocked(subchapter, allChapters, { assumeCompletedId = null } = {}) {
  if (state.progressionMode === 'open') return true;

  const isDone = (subId) => subId === assumeCompletedId || getSubchapterProgress(subId).completed;

  const chapter = allChapters.find((ch) => ch.id === subchapter.chapterId);
  if (!chapter) return false;

  const idxInChapter = chapter.subchapters.findIndex((s) => s.id === subchapter.id);

  // Teoretická kapitola
  if (chapter.type === 'theory') {
    if (idxInChapter <= 0) return true;
    const prevSub = chapter.subchapters[idxInChapter - 1];
    return isDone(prevSub.id);
  }

  // Praktické kapitoly: nejprve ověř dokončení všech 7 podkapitol teorie
  const theoryChapter = allChapters.find((ch) => ch.type === 'theory');
  const allTheoryCompleted = theoryChapter
    ? theoryChapter.subchapters.every((s) => isDone(s.id))
    : true;

  if (!allTheoryCompleted) return false;

  // 1. podkapitola praktické kapitoly je po splnění teorie odemčena
  if (idxInChapter <= 0) return true;

  // Kroky 2–4 postupují sekvenčně uvnitř dané praktické kapitoly
  const prevSub = chapter.subchapters[idxInChapter - 1];
  return isDone(prevSub.id);
}

/**
 * Obnoví stav z ověřeného Base64 certifikátu a přepočítá XP i odznaky pro zajištění konzistence.
 * Původní identitní pole (sessionId, createdAt, initialStudentId, nameHistory) přebírá beze změny.
 */
export function importStateFromObject(importedData, allChapters) {
  const base = createInitialState();
  const mergedSubchapters = {};
  let recomputedXp = 0;

  for (const ch of allChapters) {
    for (const sub of ch.subchapters) {
      const rawSub = importedData.subchapters?.[sub.id];
      if (!rawSub) continue;
      const bestXp = Math.max(0, Math.min(100, Number(rawSub.bestXp ?? rawSub.bestScore ?? 0)));
      const completed = Boolean(rawSub.completed || bestXp > 0);
      mergedSubchapters[sub.id] = {
        bestXp,
        stars: completed ? calculateStars(bestXp) : 0,
        attempts: Math.max(0, Number(rawSub.attempts) || 0),
        completed,
        firstCompletedAt: rawSub.firstCompletedAt || null,
        lastAttemptAt: rawSub.lastAttemptAt || null,
        savedCanvas: rawSub.savedCanvas || null
      };
      if (completed) {
        recomputedXp += bestXp;
      }
    }
  }

  const importedStudentId = String(importedData.studentId || '').trim();
  const importedInitialStudentId = importedData.initialStudentId !== undefined
    ? String(importedData.initialStudentId || '').trim()
    : importedStudentId;
  const importedNameHistory = Array.isArray(importedData.nameHistory)
    ? importedData.nameHistory.map((item) => ({
        ts: item.ts || '',
        from: String(item.from ?? ''),
        to: String(item.to ?? '')
      }))
    : [];

  state = {
    ...base,
    sessionId: importedData.sessionId ? String(importedData.sessionId) : base.sessionId,
    studentId: importedStudentId,
    initialStudentId: importedInitialStudentId,
    nameHistory: importedNameHistory,
    onboardingSeen: true,
    createdAt: importedData.createdAt || base.createdAt,
    progressionMode: importedData.progressionMode === 'open' ? 'open' : 'sequential',
    everUsedOpenMode: Boolean(importedData.everUsedOpenMode),
    xp: recomputedXp,
    subchapters: mergedSubchapters,
    badges: [],
    auditLog: Array.isArray(importedData.auditLog) ? [...importedData.auditLog] : []
  };

  recalculateChapterBadges(allChapters);
  appendSystemAuditEvent('STATE_RESTORED', 'Postup úspěšně obnoven ze zálohy (Base64 certifikát)');
  saveState();
  return state;
}

export function resetAllState() {
  state = createInitialState();
  saveState();
  return state;
}
