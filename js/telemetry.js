/**
 * Modul telemetrie, anti-cheat certifikátu (Base64 + deterministický podpis integrity)
 * a odolného odesílání do Google Formuláře s offline frontou v localStorage.
 */
import { APP_CONFIG, GOOGLE_FORM_CONFIG, getLevelInfo } from './config.js';

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(base64) {
  const binary = atob(base64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Deterministický 64-bitový kontrolní podpis (dvojitý FNV-1a s tajným klíčem v config.js).
 * Odhalí jakoukoli ruční úpravu XP, hvězd, identity, historie přejmenování, režimu progrese či auditního logu.
 */
export function computeIntegrityHash(canonicalPayloadJson) {
  const secret = APP_CONFIG.integritySecret;
  const inputA = `${secret}|A|${canonicalPayloadJson}`;
  const inputB = `${canonicalPayloadJson}|B|${secret}`;

  const fnv1a = (str, seed) => {
    let h = seed >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  };

  return `${fnv1a(inputA, 0x811c9dc5)}${fnv1a(inputB, 0x9e3779b9)}`;
}

/**
 * Vytvoří kompaktní, deterministicky podepsaný Base64 certifikát obsahující
 * celý stav postupu (včetně uložených pláten pro plnou obnovu), identitní pole i auditní log.
 */
export function generateBase64Certificate(state, { includeCanvases = true } = {}) {
  const compactSubchapters = {};
  for (const [id, entry] of Object.entries(state.subchapters || {})) {
    compactSubchapters[id] = {
      bestXp: entry.bestXp ?? entry.bestScore ?? 0,
      stars: entry.stars || 0,
      attempts: entry.attempts || 0,
      completed: Boolean(entry.completed),
      firstCompletedAt: entry.firstCompletedAt || null,
      lastAttemptAt: entry.lastAttemptAt || null,
      ...(includeCanvases ? { savedCanvas: entry.savedCanvas || null } : {})
    };
  }

  const payload = {
    version: state.version || APP_CONFIG.version,
    sessionId: state.sessionId || '',
    studentId: state.studentId || '',
    initialStudentId: state.initialStudentId || '',
    nameHistory: Array.isArray(state.nameHistory) ? state.nameHistory : [],
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
    progressionMode: state.progressionMode,
    everUsedOpenMode: Boolean(state.everUsedOpenMode),
    xp: state.xp || 0,
    badges: state.badges || [],
    subchapters: compactSubchapters,
    auditLog: (state.auditLog || []).slice(-120)
  };

  const canonicalJson = JSON.stringify(payload);
  const envelope = {
    v: APP_CONFIG.version,
    generatedAt: new Date().toISOString(),
    sig: computeIntegrityHash(canonicalJson),
    payload
  };

  return utf8ToBase64(JSON.stringify(envelope));
}

/**
 * Dekóduje Base64 certifikát a ověří podpis integrity i konzistenci XP.
 * Plně zpětně kompatibilní se staršími certifikáty bez polí sessionId / initialStudentId / nameHistory.
 */
export function verifyBase64Certificate(base64String) {
  if (!base64String || !base64String.trim()) {
    return { valid: false, error: 'Nebyl vložen žádný Base64 řetězec.' };
  }

  try {
    const decodedJson = base64ToUtf8(base64String);
    const envelope = JSON.parse(decodedJson);

    if (!envelope || !envelope.payload || !envelope.sig) {
      return { valid: false, error: 'Neplatná struktura certifikátu (chybí payload nebo podpis).' };
    }

    const expectedSig = computeIntegrityHash(JSON.stringify(envelope.payload));
    const signatureOk = envelope.sig === expectedSig;

    // Druhotná kontrola: souhlasí deklarované celkové XP se součtem bestXp podkapitol?
    const sumSubXp = Object.values(envelope.payload.subchapters || {}).reduce(
      (acc, s) => acc + (s.completed ? (s.bestXp ?? s.bestScore ?? 0) : 0),
      0
    );
    const xpConsistent = sumSubXp === (envelope.payload.xp || 0);

    if (!signatureOk) {
      return {
        valid: false,
        signatureOk: false,
        xpConsistent,
        error: 'Kontrolní podpis integrity nesouhlasí – Base64 certifikát byl ručně upraven nebo poškozen!'
      };
    }

    return {
      valid: true,
      signatureOk: true,
      xpConsistent,
      generatedAt: envelope.generatedAt,
      signature: envelope.sig,
      payload: envelope.payload,
      error: null
    };
  } catch (err) {
    return {
      valid: false,
      error: 'Vložený text není platný Base64 certifikát.'
    };
  }
}

/* ============================================================================
 * Offline fronta a odesílání telemetrie do Google Formuláře
 * ========================================================================== */

function loadTelemetryQueue() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.telemetryQueueKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTelemetryQueue(queue) {
  try {
    localStorage.setItem(APP_CONFIG.telemetryQueueKey, JSON.stringify(queue.slice(-50)));
  } catch (err) {
    console.warn('Nepodařilo se uložit offline frontu telemetrie:', err);
  }
}

export function getPendingTelemetryCount() {
  return loadTelemetryQueue().length;
}

function buildFormParams(record) {
  const e = GOOGLE_FORM_CONFIG.entries;
  const params = new URLSearchParams();
  params.append(e.studentId, record.studentId || 'anonym');
  params.append(e.eventType, record.eventType || 'SUBCHAPTER_COMPLETE');
  params.append(e.subchapterId, record.subchapterId || '');
  params.append(e.errors, String(record.errors ?? ''));
  params.append(e.xpEarned, String(record.xpEarned ?? ''));
  params.append(e.xpDelta, String(record.xpDelta ?? ''));
  params.append(e.totalXp, String(record.totalXp ?? 0));
  params.append(e.level, String(record.level ?? 0));
  params.append(e.progressionMode, record.progressionMode || 'sequential');
  params.append(e.attempts, String(record.attempts ?? ''));
  params.append(e.durationSec, String(record.durationSec ?? ''));
  params.append(e.certificateBase64, record.certificateBase64 || '');
  return params;
}

async function postSingleRecord(record) {
  const bodyParams = buildFormParams(record);

  if (!GOOGLE_FORM_CONFIG.enabled) {
    console.info('[Telemetry dry-run] Připravený požadavek pro Google Formulář:', Object.fromEntries(bodyParams.entries()));
    return { sent: true, dryRun: true };
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Prohlížeč je offline.');
  }

  await fetch(GOOGLE_FORM_CONFIG.formActionUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: bodyParams
  });

  return { sent: true, dryRun: false };
}

/**
 * Pokusí se odeslat všechny neodeslané záznamy z offline fronty v localStorage.
 */
export async function flushTelemetryQueue() {
  const queue = loadTelemetryQueue();
  if (queue.length === 0) return { flushed: 0, remaining: 0 };

  const remaining = [];
  let flushed = 0;

  for (let i = 0; i < queue.length; i++) {
    try {
      await postSingleRecord(queue[i]);
      flushed++;
    } catch {
      // Při prvním výpadku sítě ponechá zbytek fronty pro pozdější pokus
      remaining.push(...queue.slice(i));
      break;
    }
  }

  saveTelemetryQueue(remaining);
  return { flushed, remaining: remaining.length };
}

/**
 * Odešle telemetrickou událost na pozadí (po splnění podkapitoly nebo přepnutí režimu).
 * Při výpadku sítě uloží záznam do fronty v localStorage pro pozdější automatické odeslání.
 */
export async function sendTelemetryEvent(state, auditEntry, certificateBase64) {
  // Nejprve zkusí doposlat starší čekající požadavky
  await flushTelemetryQueue();

  const levelInfo = getLevelInfo(state.xp);
  const record = {
    queuedAt: new Date().toISOString(),
    studentId: state.studentId || 'anonym',
    eventType: auditEntry?.type || 'SUBCHAPTER_COMPLETE',
    subchapterId: auditEntry?.subchapterId || '',
    errors: auditEntry?.errors ?? '',
    xpEarned: auditEntry?.xp ?? '',
    xpDelta: auditEntry?.xpDelta ?? '',
    totalXp: state.xp,
    level: `${levelInfo.level} (${levelInfo.rank})`,
    progressionMode: state.everUsedOpenMode ? `${state.progressionMode} (open-used)` : state.progressionMode,
    attempts: auditEntry?.attempts ?? '',
    durationSec: auditEntry?.durationSec ?? '',
    certificateBase64
  };

  try {
    const res = await postSingleRecord(record);
    return {
      ok: true,
      queued: false,
      dryRun: res.dryRun,
      message: res.dryRun
        ? 'Testovací režim telemetrie (pro ostré odeslání nastavte enabled: true a URL v js/config.js).'
        : 'Telemetrie byla odeslána na pozadí.'
    };
  } catch (err) {
    const queue = loadTelemetryQueue();
    queue.push(record);
    saveTelemetryQueue(queue);
    return {
      ok: false,
      queued: true,
      dryRun: false,
      message: 'Síť není dostupná – záznam byl uložen do offline fronty a odešle se automaticky později.'
    };
  }
}
