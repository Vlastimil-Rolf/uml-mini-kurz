/**
 * Konfigurace gamifikace, exponenciálních úrovní, příběhových textů Mistra,
 * odznaků kapitol, integrity klíče a Google Formuláře pro telemetrii.
 */

export const APP_CONFIG = {
  version: '1.1.0',
  storageKey: 'uml_minikurz_state_v1',
  telemetryQueueKey: 'uml_minikurz_telemetry_queue_v1',
  integritySecret: 'UML25-CECH-MISTRA-INTEGRITY-KEY-2026#9f4a',
  chapterMasteryMinStars: 2, // Minimum 2 hvězdy (>= 80 XP) v každé podkapitole pro splnění kapitoly
  chapterMasteryMinXp: 80,
  maxLevel: 4,               // Nejvyšší dosažitelná úroveň (1500 XP)
  maxCourseXp: 1900          // Maximální počet XP za celý kurz (19 podkapitol × 100 XP)
};

/**
 * Příběhové hodnosti pro úrovně 0 až 4 (maximální úroveň kurzu).
 */
export const LEVEL_RANKS = [
  'Nováček v cechu',           // Level 0 (0–99 XP)
  'Učedník objektů',           // Level 1 (100–299 XP)
  'Tovaryš asociací',          // Level 2 (300–699 XP)
  'Architekt struktur',        // Level 3 (700–1499 XP)
  'Mistr návrhových diagramů'  // Level 4 (1500–1900 XP, MAX)
];

/**
 * Exponenciální výpočet úrovně pro celkové XP >= 0 se stropem na úrovni 4 (max. 1900 XP).
 * Úroveň začíná na 0 (0 XP). Postup z úrovně x na x+1 vyžaduje 2^x * 100 XP:
 *   0 → 1: +100 XP (celkem 100)
 *   1 → 2: +200 XP (celkem 300)
 *   2 → 3: +400 XP (celkem 700)
 *   3 → 4: +800 XP (celkem 1500, maximální úroveň; lišta dále sleduje postup k 1900 XP)
 */
export function getLevelInfo(totalXp) {
  const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));
  let level = 0;
  let currentLevelStartXp = 0;
  let xpForNextStep = 100; // 2^0 * 100

  while (level < APP_CONFIG.maxLevel && safeXp >= currentLevelStartXp + xpForNextStep) {
    currentLevelStartXp += xpForNextStep;
    level += 1;
    xpForNextStep = Math.pow(2, level) * 100;
  }

  const isMaxLevel = level >= APP_CONFIG.maxLevel;
  const nextLevelXp = isMaxLevel ? APP_CONFIG.maxCourseXp : currentLevelStartXp + xpForNextStep;
  const stepSpan = Math.max(1, nextLevelXp - currentLevelStartXp);
  const xpIntoLevel = Math.max(0, Math.min(safeXp, nextLevelXp) - currentLevelStartXp);
  const progressPct = Math.min(100, Math.round((xpIntoLevel / stepSpan) * 100));
  const rank = LEVEL_RANKS[Math.min(level, LEVEL_RANKS.length - 1)];

  return {
    level,
    maxLevel: APP_CONFIG.maxLevel,
    isMaxLevel,
    rank,
    xp: safeXp,
    maxCourseXp: APP_CONFIG.maxCourseXp,
    currentLevelStartXp,
    nextLevelXp,
    xpIntoLevel,
    xpNeededForNext: stepSpan,
    xpRemaining: Math.max(0, nextLevelXp - safeXp),
    progressPct
  };
}

/**
 * Tematické odznaky za splnění jednotlivých kapitol (všechny podkapitoly na >= 2 hvězdy).
 * ID kapitol přesně odpovídají THEORY_CHAPTER ('teorie') a PRACTICE_CHAPTERS.
 */
export const CHAPTER_BADGES = [
  {
    id: 'badge_theory',
    chapterId: 'teorie',
    title: 'Pečeť základů UML',
    description: 'Splň všech 7 podkapitol teoretické kapitoly alespoň na 2 hvězdy (≥ 80 XP).',
    icon: '📜',
    masterPraise: 'Zvládl jsi všech sedm pilířů UML 2.5! Teď se před tebou otevírají brány všech tří praktických dílen.'
  },
  {
    id: 'badge_autoservis',
    chapterId: 'ch-autoservis',
    title: 'Hlavní architekt Autoservisu',
    description: 'Splň všechny 4 podkapitoly praktické kapitoly Autoservis alespoň na 2 hvězdy.',
    icon: '🔧',
    masterPraise: 'Dílna šlape jako hodinky! Tvůj návrh zakázek, vozidel i dílů obstojí v každém provozu.'
  },
  {
    id: 'badge_banka',
    chapterId: 'ch-banka',
    title: 'Strážce bankovních struktur',
    description: 'Splň všechny 4 podkapitoly praktické kapitoly Banka alespoň na 2 hvězdy.',
    icon: '🏛️',
    masterPraise: 'Přesnost hodná finančního sektoru. Tvé účty, klienti a transakce jsou modelovány s naprostou disciplínou.'
  },
  {
    id: 'badge_geometrie',
    chapterId: 'ch-geometrie',
    title: 'Mistr vektorového plátna',
    description: 'Splň všechny 4 podkapitoly praktické kapitoly Geometrie (Malování) alespoň na 2 hvězdy.',
    icon: '📐',
    masterPraise: 'Elegance abstrakce a polymorfismu v plné kráse! Získáváš uznání cechu pro grafické domény.'
  }
];

/**
 * Příběhové texty Mistra návrhových diagramů tříd.
 */
export const MASTER_STORY = {
  onboardingTitle: 'Vítej v cechu návrhových diagramů tříd',
  onboardingText: 'Jsem Mistr návrhových diagramů tříd a provedu tě cestou od prvních asociací až po čistou objektovou architekturu podle UML 2.5. Neboj se chybovat – v našem cechu platí svoboda selhat a každý diagram můžeš kdykoli vylepšit.',
  chapterIntros: {
    teorie: 'V teoretické síni si osvojíš sedm základních kamenů UML 2.5. Jakmile projdeš všemi sedmi zkouškami, odemknou se ti tři praktické domény.',
    'ch-autoservis': 'Vítej v Autoservisu! Čeká tě čtyřkrokový rozvoj modelu od evidence vozidel až po zakázky a fakturaci. Každý krok navazuje na tvé předchozí plátno.',
    'ch-banka': 'Vstupuješ do Banky – domény, kde na přesnosti násobností a kompozic záleží každá transakce. Stavěj model krok za krokem.',
'ch-geometrie': 'Vítej v ateliéru Geometrie (Malování)! Tady prověříš kompozice vrstev, agregaci palet, abstraktní třídy a dědičnost na vektorových tvarech.'
  },
  inheritedCanvasNote: 'Tvé předchozí plátno jsem přenesl do nového kroku a aktualizoval třídy o čerstvé atributy a operace.',
  levelUpPraise: (level, rank) => `Výborně! Postupuješ na úroveň ${level} a cech ti uděluje hodnost „${rank}“.`,
  passedPerfect: 'Bez jediného kazu! Přesně takhle vypadá čistý návrhový diagram podle UML 2.5.',
  passedFreedom: 'Skvělá práce! První drobnou chybu ti v duchu svobody selhat promíjím za plných 100 XP. Přesto se na ni podívej, ať je model dokonalý.',
  passedTwoStars: 'Dobrá práce! Podkapitola je pevně zvládnuta na 2 hvězdy. Chceš-li dosáhnout plných 100 XP, můžeš drobnosti ještě doladit.',
  passedOneStar: 'První krok máš za sebou a další úloha je odemčena. Pro získání odznaku kapitoly ale budeš potřebovat alespoň 2 hvězdy – zkus diagram podle rad vylepšit.'
};

/**
 * Konfigurace Google Formuláře pro odesílání telemetrie na pozadí (POST, no-cors, URLSearchParams).
 * Pro ostré nasazení nastavte enabled: true a doplňte skutečné ID formuláře a entry polí.
 */
export const GOOGLE_FORM_CONFIG = {
  enabled: true,
  formActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeYFXgyrovYTJ-2URggEvu4is_FRcjbRM_gUx_LvE0_v8JcoA/formResponse',
  entries: {
    studentId: 'entry.1934734169',
    eventType: 'entry.586102503',
    subchapterId: 'entry.28802913',
    errors: 'entry.1998687436',
    xpEarned: 'entry.1836337263',
    xpDelta: 'entry.1790766734',
    totalXp: 'entry.915177165',
    level: 'entry.1898188013',
    progressionMode: 'entry.1997292551',
    attempts: 'entry.332969736',
    durationSec: 'entry.1069572224',
    certificateBase64: 'entry.1905503728'
  }
};