/**
 * Hlavní řídicí modul aplikace UML 2.5 Mini-kurz.
 * Propojuje data kapitol, exponenciální gamifikaci, větvenou progresi, příběh Mistra,
 * vizuální ukazatel postupu v kapitole, UML 2.5 editor, deterministický validátor a telemetrii.
 */
import { CHAPTER_BADGES, MASTER_STORY, getLevelInfo } from './config.js';
import {
  getState,
  completeOnboarding,
  setStudentId,
  setProgressionMode,
  getSubchapterProgress,
  saveCanvasDraft,
  getCanvasDraft,
  previewSubchapterCompletion,
  recordSubchapterCompletion,
  isChapterMastered,
  isSubchapterUnlocked,
  importStateFromObject,
  resetAllState
} from './state.js';
import { UmlCanvasEditor, renderStaticUmlDiagram } from './editor.js';
import { validateDiagram } from './validator.js';
import {
  generateBase64Certificate,
  verifyBase64Certificate,
  sendTelemetryEvent,
  flushTelemetryQueue,
  getPendingTelemetryCount
} from './telemetry.js';
import { THEORY_CHAPTER } from './data/theory.js';
import { PRACTICE_CHAPTERS } from './data/practice.js';

const ALL_CHAPTERS = [THEORY_CHAPTER, ...PRACTICE_CHAPTERS];
const ORDERED_SUBCHAPTERS = ALL_CHAPTERS.flatMap((ch) => ch.subchapters);

let activeSubchapter = ORDERED_SUBCHAPTERS[0];
let activeSubchapterStartedAt = Date.now();
let pendingValidation = null;
let editor = null;

const dom = {
  level: document.getElementById('ui-level'),
  rank: document.getElementById('ui-rank'),
  xpFill: document.getElementById('ui-xp-fill'),
  xpText: document.getElementById('ui-xp-text'),
  badgeCount: document.getElementById('ui-badge-count'),
  completedCount: document.getElementById('ui-completed-count'),
  modeToggleBtn: document.getElementById('btn-mode-toggle'),
  navTree: document.getElementById('nav-tree'),

  breadcrumb: document.getElementById('ui-breadcrumb'),
  subTitle: document.getElementById('ui-subchapter-title'),
  subStars: document.getElementById('ui-subchapter-stars'),
  subScore: document.getElementById('ui-subchapter-score'),
  chapterProgress: document.getElementById('ui-chapter-progress'),
  masterQuote: document.getElementById('ui-master-quote'),

  theorySection: document.getElementById('theory-section'),
  theoryHtml: document.getElementById('ui-theory-html'),
  staticCaption: document.getElementById('ui-static-caption'),
  staticDiagram: document.getElementById('ui-static-diagram'),

  assignmentTitle: document.getElementById('ui-assignment-title'),
  inheritedBadge: document.getElementById('ui-inherited-badge'),
  assignmentDesc: document.getElementById('ui-assignment-desc'),
  assignmentReqs: document.getElementById('ui-assignment-reqs'),
  hintsBox: document.getElementById('ui-hints-box'),
  toggleHintsBtn: document.getElementById('btn-toggle-hints'),

  umlCanvas: document.getElementById('uml-canvas'),
  umlPalette: document.getElementById('uml-palette'),
  umlRelationControls: document.getElementById('uml-relation-controls'),
  resetCanvasBtn: document.getElementById('btn-reset-canvas'),
  clearCanvasBtn: document.getElementById('btn-clear-canvas'),
  validateBtn: document.getElementById('btn-validate'),

  modalOnboarding: document.getElementById('modal-onboarding'),
  onboardingText: document.getElementById('onboarding-text'),
  inputOnboardingName: document.getElementById('input-onboarding-name'),

  modalFeedback: document.getElementById('modal-feedback'),
  feedbackBody: document.getElementById('feedback-body'),
  nextSubBtn: document.getElementById('btn-next-subchapter'),

  modalBadges: document.getElementById('modal-badges'),
  badgesGrid: document.getElementById('badges-grid'),

  modalCert: document.getElementById('modal-cert'),
  inputStudentId: document.getElementById('input-student-id'),
  textareaCertExport: document.getElementById('textarea-cert-export'),
  textareaCertImport: document.getElementById('textarea-cert-import'),
  certStatusMsg: document.getElementById('cert-status-msg'),
  queueStatusNote: document.getElementById('cert-queue-note'),

  modalVerifier: document.getElementById('modal-verifier'),
  textareaVerifierInput: document.getElementById('textarea-verifier-input'),
  verifierOutput: document.getElementById('verifier-output')
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function deepCloneCanvas(canvasData) {
  if (!canvasData) return null;
  return {
    nodes: (canvasData.nodes || []).map((n) => ({ classId: n.classId, x: n.x, y: n.y })),
    relations: (canvasData.relations || []).map((r) => ({ ...r }))
  };
}

function renderStarsText(count) {
  return '★'.repeat(count) + '☆'.repeat(Math.max(0, 3 - count));
}

function formatErrorCountCzech(n) {
  if (n === 0) return '0 chyb';
  if (n === 1) return '1 chyba';
  if (n >= 2 && n <= 4) return `${n} chyby`;
  return `${n} chyb`;
}

function init() {
  if (dom.validateBtn) {
    dom.validateBtn.textContent = 'Zkontrolovat diagram';
  }

  editor = new UmlCanvasEditor(dom.umlCanvas, dom.umlPalette, dom.umlRelationControls, {
    onChange: (canvasState) => {
      if (activeSubchapter) {
        saveCanvasDraft(activeSubchapter.id, canvasState);
      }
    }
  });

  bindGlobalEvents();
  renderTopbar();
  renderNavTree();
  loadSubchapter(ORDERED_SUBCHAPTERS[0].id);

  flushTelemetryQueue();
  window.addEventListener('online', () => {
    flushTelemetryQueue();
  });

  if (!getState().onboardingSeen && dom.modalOnboarding) {
    dom.onboardingText.textContent = MASTER_STORY.onboardingText;
    openModal(dom.modalOnboarding);
  }
}

function renderTopbar() {
  const state = getState();
  const levelInfo = getLevelInfo(state.xp);

  dom.level.textContent = String(levelInfo.level);
  dom.rank.textContent = levelInfo.rank;
  dom.xpFill.style.width = `${levelInfo.progressPct}%`;
  dom.xpText.textContent = levelInfo.isMaxLevel
    ? `${state.xp} / ${levelInfo.maxCourseXp} XP (MAX)`
    : `${state.xp} / ${levelInfo.nextLevelXp} XP`;

  dom.badgeCount.textContent = `${state.badges.length} / ${CHAPTER_BADGES.length}`;

  const completed = ORDERED_SUBCHAPTERS.filter((s) => getSubchapterProgress(s.id).completed).length;
  dom.completedCount.textContent = `${completed} / ${ORDERED_SUBCHAPTERS.length}`;

  dom.modeToggleBtn.textContent = state.progressionMode === 'sequential'
    ? 'Řízená cesta'
    : 'Volný průchod';
}

function renderNavTree() {
  dom.navTree.innerHTML = '';

  const renderGroup = (heading, chapters) => {
    const titleEl = document.createElement('div');
    titleEl.className = 'nav-section-title';
    titleEl.textContent = heading;
    dom.navTree.appendChild(titleEl);

    for (const ch of chapters) {
      const chBox = document.createElement('div');
      chBox.className = 'nav-chapter';

      const doneInChapter = ch.subchapters.filter((s) => getSubchapterProgress(s.id).completed).length;
      const pct = Math.round((doneInChapter / ch.subchapters.length) * 100);
      const mastered = isChapterMastered(ch);
      const badge = CHAPTER_BADGES.find((b) => b.chapterId === ch.id);

      chBox.innerHTML = `
        <div class="nav-chapter-header">
          <span>${escapeHtml(ch.title)}</span>
          <small title="${mastered ? `Kapitola splněna (${badge?.title})` : 'Dokončeno podkapitol'}">
            ${mastered ? `${badge?.icon || '🏅'} ` : ''}${doneInChapter}/${ch.subchapters.length}
          </small>
        </div>
        <div class="nav-chapter-progress" aria-hidden="true">
          <div class="nav-chapter-progress-fill${mastered ? ' mastered' : ''}" style="width:${pct}%"></div>
        </div>
      `;

      const ul = document.createElement('ul');
      ul.className = 'nav-subchapters';

      for (const sub of ch.subchapters) {
        const li = document.createElement('li');
        const unlocked = isSubchapterUnlocked(sub, ALL_CHAPTERS);
        const prog = getSubchapterProgress(sub.id);
        const isActive = activeSubchapter?.id === sub.id;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `nav-item${isActive ? ' active' : ''}${unlocked ? '' : ' locked'}`;
        btn.disabled = !unlocked;

        let statusHtml = '';
        if (!unlocked) {
          statusHtml = '<span class="nav-item-status" title="Zamčeno – splň předchozí kroky">🔒</span>';
        } else if (prog.stars > 0) {
          statusHtml = `<span class="nav-item-status stars-earned" title="Nejlepší výsledek: ${prog.bestXp} XP">${renderStarsText(prog.stars)}</span>`;
        } else {
          statusHtml = '<span class="nav-item-status">○</span>';
        }

        btn.innerHTML = `
          <span class="nav-item-label">${escapeHtml(sub.shortTitle)}</span>
          ${statusHtml}
        `;

        if (unlocked) {
          btn.addEventListener('click', () => loadSubchapter(sub.id));
        }

        li.appendChild(btn);
        ul.appendChild(li);
      }

      chBox.appendChild(ul);
      dom.navTree.appendChild(chBox);
    }
  };

  renderGroup('Teoretická část', [THEORY_CHAPTER]);
  renderGroup('Praktické domény', PRACTICE_CHAPTERS);
}

function renderChapterProgress() {
  if (!dom.chapterProgress || !activeSubchapter) return;

  const chapter = ALL_CHAPTERS.find((ch) => ch.id === activeSubchapter.chapterId);
  if (!chapter) return;

  const total = chapter.subchapters.length;
  const completedCount = chapter.subchapters.filter((s) => getSubchapterProgress(s.id).completed).length;
  const masteredCount = chapter.subchapters.filter((s) => getSubchapterProgress(s.id).stars >= 2).length;
  const pct = Math.round((completedCount / total) * 100);
  const badge = CHAPTER_BADGES.find((b) => b.chapterId === chapter.id);
  const chapterMastered = isChapterMastered(chapter);

  const badgeStatusText = chapterMastered
    ? `${badge?.icon || '🏅'} Odznak „${badge?.title || chapter.badge}“ získán!`
    : `Pro odznak „${badge?.title || chapter.badge}“: ${masteredCount}/${total} kroků na ≥ 2★`;

  const stepsHtml = chapter.subchapters.map((sub, idx) => {
    const prog = getSubchapterProgress(sub.id);
    const unlocked = isSubchapterUnlocked(sub, ALL_CHAPTERS);
    const isCurrent = sub.id === activeSubchapter.id;

    let stateCls = 'locked';
    if (prog.stars >= 2) stateCls = 'mastered';
    else if (prog.completed) stateCls = 'completed';
    else if (unlocked) stateCls = 'available';

    return `
      <button
        type="button"
        class="chapter-step-pill ${stateCls}${isCurrent ? ' current' : ''}"
        data-step-id="${escapeHtml(sub.id)}"
        ${unlocked ? '' : 'disabled'}
        title="${escapeHtml(sub.title)}${prog.completed ? ` (${prog.bestXp} XP, ${prog.stars}★)` : ''}"
      >
        <span class="step-num">${idx + 1}</span>
        <span class="step-stars">${unlocked ? (prog.stars > 0 ? renderStarsText(prog.stars) : '○') : '🔒'}</span>
      </button>
    `;
  }).join('');

  dom.chapterProgress.innerHTML = `
    <div class="chapter-progress-top">
      <div class="chapter-progress-label">
        <strong>Postup v kapitole:</strong> ${completedCount} / ${total} dokončeno (${pct} %)
      </div>
      <div class="chapter-progress-badge${chapterMastered ? ' earned' : ''}">
        ${escapeHtml(badgeStatusText)}
      </div>
    </div>
    <div class="chapter-progress-bar">
      <div class="chapter-progress-fill${chapterMastered ? ' mastered' : ''}" style="width:${pct}%"></div>
    </div>
    <div class="chapter-steps-track" role="navigation" aria-label="Kroky v kapitole">
      ${stepsHtml}
    </div>
  `;

  dom.chapterProgress.querySelectorAll('.chapter-step-pill:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.stepId;
      if (targetId && targetId !== activeSubchapter.id) {
        loadSubchapter(targetId);
      }
    });
  });
}

function loadSubchapter(subchapterId, { forceResetToDefault = false } = {}) {
  const sub = ORDERED_SUBCHAPTERS.find((s) => s.id === subchapterId);
  if (!sub) return;

  activeSubchapter = sub;
  activeSubchapterStartedAt = Date.now();
  pendingValidation = null;

  const chapter = ALL_CHAPTERS.find((ch) => ch.id === sub.chapterId);
  const prog = getSubchapterProgress(sub.id);
  const state = getState();

  dom.breadcrumb.textContent = `${sub.type === 'theory' ? 'Teoretická část' : 'Praktická část'} / ${chapter.title}`;
  dom.subTitle.textContent = sub.title;
  dom.subStars.textContent = renderStarsText(prog.stars);
  dom.subScore.textContent = prog.attempts > 0 ? `Nejlepší výsledek: ${prog.bestXp} XP` : 'Nejlepší výsledek: —';

  if (sub.type === 'theory' && sub.theoryContent) {
    dom.theorySection.hidden = false;
    dom.theoryHtml.innerHTML = sub.theoryContent.html;
    dom.staticCaption.textContent = sub.theoryContent.staticDiagram?.caption || 'Ukázkový diagram';
    renderStaticUmlDiagram(dom.staticDiagram, sub.theoryContent.staticDiagram);
  } else {
    dom.theorySection.hidden = true;
  }

  dom.assignmentTitle.textContent = sub.assignment.title;
  dom.assignmentDesc.innerHTML = sub.assignment.descriptionHtml;
  dom.assignmentReqs.innerHTML = (sub.assignment.requirements || [])
    .map((req) => `<li>${req}</li>`)
    .join('');

  dom.hintsBox.hidden = true;
  dom.toggleHintsBtn.textContent = 'Zobrazit nápovědu';
  dom.hintsBox.innerHTML = (sub.assignment.hints || []).length
    ? `<strong>Nápověda Mistra:</strong><ul>${sub.assignment.hints.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
    : 'Pro tento úkol není k dispozici žádná nápověda.';

  let initialCanvas = forceResetToDefault ? null : deepCloneCanvas(getCanvasDraft(sub.id));
  let usedInheritance = false;

  if (sub.inheritPreviousCanvas && sub.previousSubchapterId) {
    if (dom.clearCanvasBtn) dom.clearCanvasBtn.hidden = false;
    if (!initialCanvas || !initialCanvas.nodes?.length || forceResetToDefault) {
      const prevCanvas = deepCloneCanvas(getCanvasDraft(sub.previousSubchapterId));
      if (prevCanvas && prevCanvas.nodes.length > 0) {
        initialCanvas = prevCanvas;
        usedInheritance = true;
      }
    }
  } else if (dom.clearCanvasBtn) {
    dom.clearCanvasBtn.hidden = true;
  }

  dom.inheritedBadge.hidden = !usedInheritance;

  const greetingPrefix = state.studentId ? `${state.studentId}, ` : '';
  const chapterIntro = sub.order === 1 && MASTER_STORY.chapterIntros[chapter.id]
    ? `${MASTER_STORY.chapterIntros[chapter.id]} `
    : '';
  const inheritNote = usedInheritance ? `${MASTER_STORY.inheritedCanvasNote} ` : '';
  dom.masterQuote.textContent = `${greetingPrefix}${chapterIntro}${inheritNote}${sub.masterIntro || ''}`.trim();

  editor.loadSubchapter(sub, initialCanvas);
  if (usedInheritance || forceResetToDefault) {
    saveCanvasDraft(sub.id, editor.getDiagramState());
  }

  renderChapterProgress();
  renderNavTree();
}

/**
 * Závazně uloží výsledek do stavu, odešle telemetrii a aktualizuje rozhraní.
 */
function commitValidation({ subchapter, result, diagramState, durationSec }) {
  const outcome = recordSubchapterCompletion(
    subchapter,
    result,
    diagramState,
    ALL_CHAPTERS,
    durationSec
  );
  if (!outcome) return null;

  activeSubchapterStartedAt = Date.now();

  const updatedState = getState();
  const freshCertificate = generateBase64Certificate(updatedState, { includeCanvases: false });
  sendTelemetryEvent(updatedState, outcome.auditEntry, freshCertificate);

  renderTopbar();
  renderChapterProgress();
  renderNavTree();

  if (activeSubchapter?.id === subchapter.id) {
    dom.subStars.textContent = renderStarsText(outcome.newStars);
    dom.subScore.textContent = `Nejlepší výsledek: ${outcome.newBestXp} XP`;
  }

  return outcome;
}

function handleValidation() {
  const diagramState = editor.getDiagramState();
  const result = validateDiagram(activeSubchapter, diagramState);
  const durationSec = Math.max(1, Math.round((Date.now() - activeSubchapterStartedAt) / 1000));
  const closeFixBtn = dom.modalFeedback.querySelector('.modal-footer [data-close-modal="modal-feedback"]');

  // 1. Prázdné plátno: neukládat, neodesílat telemetrii, neodemykat další krok
  if (!result.passed || result.isEmptyCanvas) {
    pendingValidation = null;

    const issueItems = result.details.filter((d) => d.status !== 'ok');
    dom.feedbackBody.innerHTML = `
      <div class="feedback-summary failed">
        <div>
          <strong style="font-size:1.15rem;">Plátno je prázdné (0 XP)</strong>
          <div style="font-size:0.85rem;">Výsledek nebyl uložen – k dokončení podkapitoly nejprve sestav diagram.</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.35rem;color:#94a3b8;">☆☆☆</div>
          <div style="font-size:0.78rem;color:#475569;">${formatErrorCountCzech(result.errors)}</div>
        </div>
      </div>
      <p style="font-style:italic;margin-bottom:0.85rem;">„Plátno je zatím prázdné! Přetáhni z palety požadované třídy, propoj je podle zadání a zkus kontrolu znovu.“</p>
      <ul class="feedback-list">
        ${issueItems.map((d) => `<li class="feedback-item ${d.status}">${escapeHtml(d.message)}</li>`).join('')}
      </ul>
    `;

    if (closeFixBtn) closeFixBtn.textContent = 'Zpět na plátno';
    dom.nextSubBtn.hidden = true;
    delete dom.nextSubBtn.dataset.nextId;
    openModal(dom.modalFeedback);
    return;
  }

  // 2. Perfektní řešení (0 chyb) se uloží ihned; řešení s chybami (errors > 0) zobrazí náhled
  //    a uloží se + odešle telemetrii až po kliknutí na „Potvrdit výsledek“.
  const isDeferredConfirmation = result.errors > 0;
  let outcome;

  if (isDeferredConfirmation) {
    pendingValidation = { subchapter: activeSubchapter, result, diagramState, durationSec };
    outcome = previewSubchapterCompletion(activeSubchapter, result, ALL_CHAPTERS);
  } else {
    pendingValidation = null;
    outcome = commitValidation({ subchapter: activeSubchapter, result, diagramState, durationSec });
  }

  let masterComment = MASTER_STORY.passedPerfect;
  if (result.freedomToFailApplied) {
    masterComment = MASTER_STORY.passedFreedom;
  } else if (result.stars === 2) {
    masterComment = MASTER_STORY.passedTwoStars;
  } else if (result.stars === 1) {
    masterComment = MASTER_STORY.passedOneStar;
  }

  const levelUpHtml = outcome.leveledUp
    ? `
      <div class="feedback-item ok" style="margin-bottom:0.85rem;background:#eff6ff;border-left-color:#2563eb;">
        <strong>🎉 ${isDeferredConfirmation ? 'Po potvrzení postoupíš na úroveň' : 'Nová úroveň'} ${outcome.newLevelInfo.level} – ${escapeHtml(outcome.newLevelInfo.rank)}!</strong><br>
        ${escapeHtml(MASTER_STORY.levelUpPraise(outcome.newLevelInfo.level, outcome.newLevelInfo.rank))}
      </div>
    `
    : '';

  const badgeHtml = outcome.newlyUnlockedBadges.length
    ? outcome.newlyUnlockedBadges
        .map((id) => CHAPTER_BADGES.find((b) => b.id === id))
        .filter(Boolean)
        .map(
          (b) => `
            <div class="hints-box" style="margin-bottom:0.85rem;">
              <strong>${b.icon} ${isDeferredConfirmation ? 'Po potvrzení získáš odznak kapitoly' : 'Získán odznak kapitoly'}: ${escapeHtml(b.title)}!</strong><br>
              <em>„${escapeHtml(b.masterPraise)}“</em>
            </div>
          `
        )
        .join('')
    : '';

  let ruleBannerHtml = '';
  if (result.freedomToFailApplied) {
    ruleBannerHtml = `
      <div class="feedback-item ok" style="margin-bottom:0.85rem;">
        <strong>Svoboda selhat:</strong> První drobná chyba v kompletním diagramu je prominuta – získáváš plných <strong>100 XP</strong> (3 ★). Můžeš ji ještě opravit, nebo výsledek potvrdit.
      </div>
    `;
  } else if (result.stars === 1) {
    ruleBannerHtml = `
      <div class="feedback-item warn" style="margin-bottom:0.85rem;">
        <strong>Náhled výsledku (1 ★):</strong> Po potvrzení se podkapitola splní a odemkne další krok. Pro získání odznaku celé kapitoly ale potřebuješ alespoň <strong>2 hvězdy (≥ 80 XP)</strong> ve všech jejích podkapitolách.
      </div>
    `;
  } else if (isDeferredConfirmation) {
    ruleBannerHtml = `
      <div class="feedback-item warn" style="margin-bottom:0.85rem;">
        <strong>Výsledek zatím není uložen:</strong> Můžeš diagram podle rad níže opravit a zkusit získat plných 100 XP, nebo výsledek rovnou potvrdit.
      </div>
    `;
  }

  const issueItems = result.details.filter((d) => d.status !== 'ok');
  const okItems = result.details.filter((d) => d.status === 'ok');

  const issuesSectionHtml = issueItems.length
    ? `
      <h4 style="margin:0.4rem 0 0.5rem;font-size:0.92rem;color:#991b1b;">Co v diagramu opravit (${formatErrorCountCzech(result.errors)}):</h4>
      <ul class="feedback-list" style="margin-bottom:0.9rem;">
        ${issueItems.map((d) => `<li class="feedback-item ${d.status}">${escapeHtml(d.message)}</li>`).join('')}
      </ul>
    `
    : '';

  const okSectionHtml = okItems.length
    ? `
      <h4 style="margin:0.4rem 0 0.5rem;font-size:0.92rem;color:#065f46;">Co už máš správně (${okItems.length}):</h4>
      <ul class="feedback-list">
        ${okItems.map((d) => `<li class="feedback-item ok">${escapeHtml(d.message)}</li>`).join('')}
      </ul>
    `
    : '';

  const xpDeltaText = isDeferredConfirmation
    ? (outcome.xpDelta > 0
        ? `Po potvrzení se přičte +${outcome.xpDelta} XP k tvému postupu.`
        : `Dosavadní nejlepší výkon (${outcome.newBestXp} XP) zůstane zachován (+0 XP).`)
    : (outcome.xpDelta > 0
        ? `Připsáno +${outcome.xpDelta} XP k tvému postupu.`
        : `Dosavadní nejlepší výkon (${outcome.newBestXp} XP) zůstává zachován (+0 XP).`);

  dom.feedbackBody.innerHTML = `
    <div class="feedback-summary ${result.stars >= 2 ? 'passed' : 'warn'}">
      <div>
        <strong style="font-size:1.15rem;">${isDeferredConfirmation ? 'Náhled výsledku' : 'Výsledek'}: ${result.xp} XP (${formatErrorCountCzech(result.errors)})</strong>
        <div style="font-size:0.85rem;">${escapeHtml(xpDeltaText)}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.35rem;color:#d97706;">${renderStarsText(result.stars)}</div>
        <div style="font-size:0.78rem;color:#475569;">${isDeferredConfirmation ? `Bude pokus #${outcome.attempts}` : `Pokus #${outcome.attempts}`} · ${durationSec} s</div>
      </div>
    </div>
    <p style="font-style:italic;margin-bottom:0.85rem;">„${escapeHtml(masterComment)}“</p>
    ${levelUpHtml}
    ${badgeHtml}
    ${ruleBannerHtml}
    ${issuesSectionHtml}
    ${okSectionHtml}
  `;

  const nextSub = findNextUnlockedSubchapter(activeSubchapter, {
    assumeCompletedId: isDeferredConfirmation ? activeSubchapter.id : null
  });

  if (closeFixBtn) {
    closeFixBtn.textContent = isDeferredConfirmation ? 'Opravit diagram' : 'Zůstat u diagramu';
  }

  if (isDeferredConfirmation) {
    dom.nextSubBtn.hidden = false;
    dom.nextSubBtn.dataset.nextId = nextSub ? nextSub.id : '';
    dom.nextSubBtn.textContent = nextSub
      ? 'Potvrdit výsledek a pokračovat →'
      : 'Potvrdit a uložit výsledek';
  } else if (nextSub) {
    dom.nextSubBtn.hidden = false;
    dom.nextSubBtn.dataset.nextId = nextSub.id;
    dom.nextSubBtn.textContent = 'Pokračovat na další podkapitolu →';
  } else {
    dom.nextSubBtn.hidden = true;
    delete dom.nextSubBtn.dataset.nextId;
  }

  openModal(dom.modalFeedback);
}

function findNextUnlockedSubchapter(currentSub, { assumeCompletedId = null } = {}) {
  const idx = ORDERED_SUBCHAPTERS.findIndex((s) => s.id === currentSub.id);
  const isCompleted = (s) => s.id === assumeCompletedId || getSubchapterProgress(s.id).completed;

  // 1. Nejprve hledá další odemčenou a dosud nedokončenou podkapitolu směrem dopředu
  for (let i = idx + 1; i < ORDERED_SUBCHAPTERS.length; i++) {
    const sub = ORDERED_SUBCHAPTERS[i];
    if (isSubchapterUnlocked(sub, ALL_CHAPTERS, { assumeCompletedId }) && !isCompleted(sub)) {
      return sub;
    }
  }

  // 2. Pokud nic není dopředu (např. student začal poslední praktickou kapitolou), projde od začátku
  for (let i = 0; i < idx; i++) {
    const sub = ORDERED_SUBCHAPTERS[i];
    if (isSubchapterUnlocked(sub, ALL_CHAPTERS, { assumeCompletedId }) && !isCompleted(sub)) {
      return sub;
    }
  }

  // 3. Pokud už je vše odemčené dokončeno, přejde na další odemčený krok v pořadí
  for (let i = idx + 1; i < ORDERED_SUBCHAPTERS.length; i++) {
    if (isSubchapterUnlocked(ORDERED_SUBCHAPTERS[i], ALL_CHAPTERS, { assumeCompletedId })) {
      return ORDERED_SUBCHAPTERS[i];
    }
  }

  return null;
}

function renderBadgesModal() {
  const unlocked = new Set(getState().badges);
  dom.badgesGrid.innerHTML = CHAPTER_BADGES.map((b) => {
    const isUnlocked = unlocked.has(b.id);
    const ch = ALL_CHAPTERS.find((c) => c.id === b.chapterId);
    const masteredSubs = ch
      ? ch.subchapters.filter((s) => getSubchapterProgress(s.id).stars >= 2).length
      : 0;
    const totalSubs = ch ? ch.subchapters.length : 0;

    return `
      <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-title">${escapeHtml(b.title)}</div>
        <div class="badge-desc">${escapeHtml(b.description)}</div>
        <div style="margin-top:0.45rem;font-size:0.75rem;font-weight:700;color:${isUnlocked ? '#059669' : '#64748b'};">
          ${isUnlocked ? '✓ Získáno' : `Splněno na ≥2★: ${masteredSubs}/${totalSubs}`}
        </div>
      </div>
    `;
  }).join('');
}

function openCertModal() {
  const state = getState();
  dom.inputStudentId.value = state.studentId || '';
  dom.textareaCertExport.value = generateBase64Certificate(state);
  dom.textareaCertImport.value = '';
  dom.certStatusMsg.textContent = '';

  const pending = getPendingTelemetryCount();
  if (dom.queueStatusNote) {
    dom.queueStatusNote.textContent = pending > 0
      ? `Ve frontě čeká ${pending} neodeslaných telemetrických záznamů (odešlou se automaticky po obnovení sítě).`
      : 'Všechny telemetrické záznamy jsou synchronizovány.';
  }

  openModal(dom.modalCert);
}

function runInstructorVerifier() {
  const raw = dom.textareaVerifierInput.value;
  const verification = verifyBase64Certificate(raw);
  dom.verifierOutput.hidden = false;

  if (!verification.valid) {
    dom.verifierOutput.innerHTML = `
      <div style="color:#dc2626;font-weight:700;">✗ Ověření selhalo: ${escapeHtml(verification.error)}</div>
    `;
    return;
  }

  const p = verification.payload;
  const levelInfo = getLevelInfo(p.xp || 0);

  const chapterRows = ALL_CHAPTERS.map((ch) => {
    const subs = ch.subchapters.map((s) => p.subchapters?.[s.id]);
    const doneCount = subs.filter((s) => s?.completed).length;
    const minStars = subs.every((s) => s?.completed)
      ? Math.min(...subs.map((s) => s?.stars || 0))
      : 0;
    const chXp = subs.reduce((acc, s) => acc + (s?.completed ? (s.bestXp ?? s.bestScore ?? 0) : 0), 0);
    const badge = CHAPTER_BADGES.find((b) => b.chapterId === ch.id);
    const hasBadge = (p.badges || []).includes(badge?.id);

    return `
      <tr>
        <td><strong>${escapeHtml(ch.title)}</strong></td>
        <td>${doneCount} / ${ch.subchapters.length}</td>
        <td>${chXp} XP</td>
        <td>${hasBadge ? `${badge.icon} Splněna (≥2★)` : (doneCount === ch.subchapters.length ? `Dokončena (min. ${minStars}★)` : 'Rozpracována')}</td>
      </tr>
    `;
  }).join('');

  const subRows = ORDERED_SUBCHAPTERS.map((sub) => {
    const sp = p.subchapters?.[sub.id];
    const bestXp = sp ? (sp.bestXp ?? sp.bestScore ?? 0) : null;
    return `
      <tr>
        <td>${escapeHtml(sub.shortTitle)}</td>
        <td>${bestXp !== null ? `${bestXp} XP` : '—'}</td>
        <td>${sp ? renderStarsText(sp.stars) : '☆☆☆'}</td>
        <td>${sp ? sp.attempts : 0}</td>
      </tr>
    `;
  }).join('');

  const timelineItems = (p.auditLog || [])
    .slice()
    .reverse()
    .map((entry) => {
      const ts = escapeHtml((entry.ts || '').slice(0, 19).replace('T', ' '));
      if (entry.type === 'SUBCHAPTER_COMPLETE') {
        return `<li><code>${ts}</code> — <strong>${escapeHtml(entry.subchapterId)}</strong>: ${entry.errors} chyb, ${entry.xp} XP (+${entry.xpDelta} XP, celkem ${entry.totalXp} XP, lvl ${entry.level}), pokus #${entry.attempts}, čas ${entry.durationSec} s [${escapeHtml(entry.progressionMode)}]</li>`;
      }
      return `<li><code>${ts}</code> — [${escapeHtml(entry.type || 'EVENT')}] ${escapeHtml(entry.details || '')}</li>`;
    })
    .join('');

  dom.verifierOutput.innerHTML = `
    <div style="color:#059669;font-weight:700;margin-bottom:0.5rem;">
      ✓ Podpis integrity certifikátu ověřen (hash: <code>${escapeHtml(verification.signature)}</code>)
      ${verification.xpConsistent ? '' : ' <span style="color:#d97706;">⚠️ Zjištěna odchylka součtu XP!</span>'}
    </div>
    <div><strong>Student:</strong> ${escapeHtml(p.studentId || '(neuvedeno)')} | <strong>Celkem XP:</strong> ${p.xp} / ${levelInfo.maxCourseXp} (Úroveň ${levelInfo.level} – ${escapeHtml(levelInfo.rank)})</div>
    <div><strong>Režim progrese:</strong> ${p.everUsedOpenMode ? '⚠️ Byl použit Volný průchod (open)' : '✓ Čistě Řízená cesta (sequential)'} | <strong>Vygenerováno:</strong> ${escapeHtml(verification.generatedAt)}</div>

    <h4 style="margin:0.85rem 0 0.35rem;font-size:0.88rem;">Přehled kapitol a odznaků</h4>
    <table class="verifier-table">
      <thead><tr><th>Kapitola</th><th>Podkapitoly</th><th>Získané XP</th><th>Stav / Odznak</th></tr></thead>
      <tbody>${chapterRows}</tbody>
    </table>

    <h4 style="margin:0.85rem 0 0.35rem;font-size:0.88rem;">Detail podkapitol</h4>
    <table class="verifier-table">
      <thead><tr><th>Podkapitola</th><th>Nejlepší XP</th><th>Hvězdy</th><th>Pokusy</th></tr></thead>
      <tbody>${subRows}</tbody>
    </table>

    <h4 style="margin:0.85rem 0 0.35rem;font-size:0.88rem;">Časová osa pokusů a auditní log (${(p.auditLog || []).length} záznamů)</h4>
    <ul style="margin:0;padding-left:1.15rem;max-height:220px;overflow-y:auto;font-size:0.78rem;">
      ${timelineItems || '<li>Auditní log je prázdný.</li>'}
    </ul>
  `;
}

function openModal(modalEl) {
  if (modalEl) modalEl.hidden = false;
}

function closeModal(modalEl) {
  if (modalEl) {
    modalEl.hidden = true;
    if (modalEl === dom.modalFeedback) {
      pendingValidation = null;
    }
  }
}

function bindGlobalEvents() {
  document.getElementById('btn-onboarding-start')?.addEventListener('click', () => {
    completeOnboarding(dom.inputOnboardingName?.value || '');
    closeModal(dom.modalOnboarding);
    loadSubchapter(activeSubchapter.id);
  });

  dom.modeToggleBtn.addEventListener('click', () => {
    const current = getState().progressionMode;
    const next = current === 'sequential' ? 'open' : 'sequential';
    if (next === 'open') {
      const ok = window.confirm(
        'Přepnutí na „Volný průchod“ okamžitě odemkne všechny podkapitoly všech kapitol. Přepnutí se zaznamená do telemetrického a auditního logu. Pokračovat?'
      );
      if (!ok) return;
    }

    const modeEvent = setProgressionMode(next);
    if (modeEvent) {
      const state = getState();
      sendTelemetryEvent(state, modeEvent, generateBase64Certificate(state, { includeCanvases: false }));
    }

    renderTopbar();
    renderChapterProgress();
    renderNavTree();
  });

  dom.toggleHintsBtn.addEventListener('click', () => {
    const isHidden = dom.hintsBox.hidden;
    dom.hintsBox.hidden = !isHidden;
    dom.toggleHintsBtn.textContent = isHidden ? 'Skrýt nápovědu' : 'Zobrazit nápovědu';
  });

  dom.resetCanvasBtn?.addEventListener('click', () => {
    const isInheritedStep = Boolean(
      activeSubchapter?.inheritPreviousCanvas &&
      activeSubchapter?.previousSubchapterId &&
      getCanvasDraft(activeSubchapter.previousSubchapterId)?.nodes?.length
    );

    const confirmMsg = isInheritedStep
      ? 'Resetovat aktuální plátno do výchozího stavu tohoto kroku? Obnoví se třídy a vazby z předchozí podkapitoly a nově přidané třídy se vrátí do palety.'
      : 'Resetovat aktuální plátno? Všechny třídy se vrátí zpět do palety a vazby na plátně budou smazány.';

    if (window.confirm(confirmMsg)) {
      loadSubchapter(activeSubchapter.id, { forceResetToDefault: true });
    }
  });

  dom.clearCanvasBtn?.addEventListener('click', () => {
    if (window.confirm('Opravdu chcete úplně vyprázdnit plátno a vrátit všechny třídy zpět do palety?')) {
      editor.clearCanvas();
    }
  });

  dom.validateBtn.addEventListener('click', handleValidation);

  dom.nextSubBtn.addEventListener('click', () => {
    const nextId = dom.nextSubBtn.dataset.nextId;
    if (pendingValidation) {
      const toCommit = pendingValidation;
      pendingValidation = null;
      commitValidation(toCommit);
    }
    closeModal(dom.modalFeedback);
    if (nextId) loadSubchapter(nextId);
  });

  document.getElementById('btn-open-badges')?.addEventListener('click', () => {
    renderBadgesModal();
    openModal(dom.modalBadges);
  });

  document.getElementById('btn-open-cert')?.addEventListener('click', openCertModal);

  document.getElementById('link-open-verifier')?.addEventListener('click', (e) => {
    e.preventDefault();
    dom.verifierOutput.hidden = true;
    openModal(dom.modalVerifier);
  });

  document.getElementById('btn-save-student-id')?.addEventListener('click', () => {
    setStudentId(dom.inputStudentId.value);
    dom.textareaCertExport.value = generateBase64Certificate(getState());
    dom.certStatusMsg.textContent = 'Jméno / ID uloženo a Base64 certifikát aktualizován.';
  });

  document.getElementById('btn-copy-cert')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(dom.textareaCertExport.value);
      dom.certStatusMsg.textContent = 'Base64 certifikát zkopírován do schránky.';
    } catch {
      dom.textareaCertExport.select();
      document.execCommand('copy');
      dom.certStatusMsg.textContent = 'Base64 certifikát zkopírován.';
    }
  });

  document.getElementById('btn-import-cert')?.addEventListener('click', () => {
    const verification = verifyBase64Certificate(dom.textareaCertImport.value);
    if (!verification.valid) {
      window.alert(`Nelze obnovit zálohu: ${verification.error}`);
      return;
    }
    importStateFromObject(verification.payload, ALL_CHAPTERS);
    renderTopbar();
    renderNavTree();
    const targetSubId = isSubchapterUnlocked(activeSubchapter, ALL_CHAPTERS)
      ? activeSubchapter.id
      : ORDERED_SUBCHAPTERS[0].id;
    loadSubchapter(targetSubId);
    dom.textareaCertExport.value = generateBase64Certificate(getState());
    dom.certStatusMsg.textContent = 'Postup byl úspěšně ověřen a obnoven ze zálohy.';
  });

  document.getElementById('btn-reset-all')?.addEventListener('click', () => {
    if (!window.confirm('Opravdu chcete nenávratně smazat celý postup, XP, odznaky a uložené diagramy?')) return;
    resetAllState();
    renderTopbar();
    renderNavTree();
    loadSubchapter(ORDERED_SUBCHAPTERS[0].id);
    closeModal(dom.modalCert);
  });

  document.getElementById('btn-run-verifier')?.addEventListener('click', runInstructorVerifier);

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.closeModal);
      if (target) closeModal(target);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });
}

document.addEventListener('DOMContentLoaded', init);