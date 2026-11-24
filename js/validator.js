/**
 * Deterministický validátor návrhových diagramů tříd podle UML 2.5.
 * - Provádí optimální párování vazeb a počítá každou dílčí chybu na vazbě samostatně.
 * - Počítá XP podle pravidla „svobody selhat“ (1 drobná chyba v kompletním diagramu = 100 XP, 11+ chyb = 45 XP).
 * - Ošetřuje prázdné plátno (passed: false, 0 XP, 0 ★ – neodemkne další krok).
 * - Generuje konkrétní formativní zpětnou vazbu v češtině bez prozrazování surového PlantUML kódu.
 */

export const XP_BY_ERRORS = [100, 100, 90, 81, 73, 66, 60, 55, 51, 48, 46, 45];

const RELATION_TYPE_NAMES = {
  association_bi: 'obousměrnou prostou asociaci (plná čára bez šipek)',
  association_uni: 'jednosměrnou prostou asociaci (plná čára s otevřenou šipkou)',
  aggregation: 'agregaci (prázdný kosočtverec u celku a otevřená šipka k části)',
  composition: 'kompozici (plný kosočtverec u celku a otevřená šipka k části)',
  generalization: 'generalizaci / dědičnost (plná čára s prázdným trojúhelníkem k rodiči)',
  realization: 'realizaci rozhraní (přerušovaná čára s prázdným trojúhelníkem k rozhraní)'
};

function normalizeMultiplicity(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).trim().replace(/\s+/g, '');
  if (!cleaned) return null;
  if (cleaned === '*' || cleaned.toLowerCase() === '0..n') return '0..*';
  if (cleaned.toLowerCase() === '1..n') return '1..*';
  if (cleaned === '1..1') return '1';
  return cleaned;
}

function normalizeRole(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).trim().replace(/\s+/g, ' ').toLowerCase();
  return cleaned || null;
}

function roleMatches(expectedRole, actualRole) {
  if (expectedRole === null || expectedRole === undefined || expectedRole === '') return true;
  const act = normalizeRole(actualRole);
  if (!act) return false;

  if (Array.isArray(expectedRole)) {
    return expectedRole.some((r) => normalizeRole(r) === act);
  }
  return normalizeRole(expectedRole) === act;
}

function normalizeNavigability(rel) {
  if (rel.type === 'generalization' || rel.type === 'realization') {
    return 'directed';
  }
  if (rel.type === 'aggregation' || rel.type === 'composition') {
    return 'unidirectional';
  }
  const nav = String(rel.navigability || 'bidirectional').toLowerCase();
  if (nav === 'unidirectional' || nav === 'target') {
    return 'unidirectional';
  }
  return 'bidirectional';
}

function getCanonicalRelationKind(rel) {
  if (rel.type === 'association') {
    return normalizeNavigability(rel) === 'unidirectional' ? 'association_uni' : 'association_bi';
  }
  return rel.type;
}

function getSubchapterClasses(subchapter) {
  return subchapter?.classes || subchapter?.paletteClasses || [];
}

function getClassDef(subchapter, classId) {
  return getSubchapterClasses(subchapter).find((c) => c.id === classId) || null;
}

function getClassName(subchapter, classId) {
  return getClassDef(subchapter, classId)?.name || classId;
}

export function calculateXp(errorCount, { allowFreedomToFail = true } = {}) {
  const safeErrors = Math.max(0, Math.floor(Number(errorCount) || 0));
  if (safeErrors === 0) return XP_BY_ERRORS[0];
  const effectiveIdx = allowFreedomToFail ? safeErrors : safeErrors + 1;
  const idx = Math.min(effectiveIdx, XP_BY_ERRORS.length - 1);
  return XP_BY_ERRORS[idx];
}

export function calculateStars(xp) {
  if (xp >= 100) return 3;
  if (xp >= 80) return 2;
  if (xp > 0) return 1;
  return 0;
}

function describeTypeMismatch(expRel, actRel, srcName, tgtName) {
  if (expRel.feedback?.wrongType) {
    return expRel.feedback.wrongType;
  }

  const expKind = getCanonicalRelationKind(expRel);
  const actKind = getCanonicalRelationKind(actRel);

  if (expKind === 'composition' && actKind === 'aggregation') {
    return `Vazba mezi třídami ${srcName} a ${tgtName} má nastavenou agregaci (prázdný kosočtverec), ale část ${tgtName} je existenčně vázána na celek ${srcName} – použij kompozici (plný kosočtverec).`;
  }
  if (expKind === 'aggregation' && actKind === 'composition') {
    return `Vazba mezi třídami ${srcName} a ${tgtName} má nastavenou kompozici (plný kosočtverec), ale instance ${tgtName} může existovat nezávisle na ${srcName} – použij volnější agregaci (prázdný kosočtverec).`;
  }
  if (expKind === 'realization' && actKind === 'generalization') {
    return `Mezi ${srcName} a rozhraním ${tgtName} jsi použil/a generalizaci (plná čára). Implementace rozhraní se v UML 2.5 značí realizací (přerušovaná čára s prázdným trojúhelníkem).`;
  }
  if (expKind === 'generalization' && actKind === 'realization') {
    return `Mezi ${srcName} a nadtřídou ${tgtName} jsi použil/a realizaci (přerušovaná čára). Dědičnost mezi třídami se značí generalizací (plná čára s prázdným trojúhelníkem).`;
  }
  if (expKind === 'association_uni' && actKind === 'association_bi') {
    return `Vazba mezi ${srcName} a ${tgtName} je nastavena jako obousměrná, ale zadání vyžaduje jednosměrnou navigovatelnost směrem od ${srcName} k ${tgtName} (otevřená šipka na cíli).`;
  }
  if (expKind === 'association_bi' && actKind === 'association_uni') {
    return `Vazba mezi ${srcName} a ${tgtName} má nastavenou jednosměrnou šipku, ale podle zadání má být obousměrnou prostou asociací (plná čára bez šipek).`;
  }

  const expLabel = RELATION_TYPE_NAMES[expKind] || expKind;
  const actLabel = RELATION_TYPE_NAMES[actKind] || actKind;
  return `Vazba mezi třídami ${srcName} a ${tgtName} má nesprávný typ (máš ${actLabel}, zadání vyžaduje ${expLabel}).`;
}

function describeDirectionMismatch(expRel, srcName, tgtName) {
  if (expRel.feedback?.wrongDirection) {
    return expRel.feedback.wrongDirection;
  }

  if (expRel.type === 'generalization') {
    return `Vazba dědičnosti mezi ${srcName} a ${tgtName} má obrácený směr – prázdný trojúhelník musí směřovat od potomka (${srcName}) k nadřazené třídě (${tgtName}).`;
  }
  if (expRel.type === 'realization') {
    return `Vazba realizace mezi ${srcName} a ${tgtName} má obrácený směr – prázdný trojúhelník musí směřovat od implementující třídy (${srcName}) k rozhraní (${tgtName}).`;
  }
  if (expRel.type === 'composition' || expRel.type === 'aggregation') {
    const diamondName = expRel.type === 'composition' ? 'plný kosočtverec' : 'prázdný kosočtverec';
    return `Vazba mezi ${srcName} a ${tgtName} má obrácený směr – ${diamondName} musí být na straně celku (${srcName}) a otevřená šipka musí směřovat k části (${tgtName}).`;
  }
  return `Jednosměrná asociace mezi ${srcName} a ${tgtName} má obrácený směr – otevřená šipka navigovatelnosti má směřovat od ${srcName} k ${tgtName}.`;
}

function describeMultiplicityMismatch(expRel, side, className, srcName, tgtName, actualMult) {
  if (side === 'source' && expRel.feedback?.wrongSourceMultiplicity) {
    return expRel.feedback.wrongSourceMultiplicity;
  }
  if (side === 'target' && expRel.feedback?.wrongTargetMultiplicity) {
    return expRel.feedback.wrongTargetMultiplicity;
  }

  const stateHint = actualMult
    ? `aktuálně nastaveno „${actualMult}“`
    : 'násobnost není vyplněna';

  return `U vazby ${srcName} – ${tgtName} zkontroluj násobnost na straně třídy ${className} (${stateHint}). Ověř v zadání minimální a maximální počet souvisejících instancí.`;
}

function describeRoleMismatch(expRel, side, className, srcName, tgtName) {
  if (side === 'source' && expRel.feedback?.wrongSourceRole) {
    return expRel.feedback.wrongSourceRole;
  }
  if (side === 'target' && expRel.feedback?.wrongTargetRole) {
    return expRel.feedback.wrongTargetRole;
  }
  return `U vazby ${srcName} – ${tgtName} zkontroluj požadovaný název role na straně třídy ${className}.`;
}

function evaluateRelationCandidate(expRel, actRel, subchapter) {
  const sameDirection = expRel.sourceId === actRel.sourceId && expRel.targetId === actRel.targetId;
  const reverseDirection = expRel.sourceId === actRel.targetId && expRel.targetId === actRel.sourceId;

  if (!sameDirection && !reverseDirection) {
    return { compatible: false };
  }

  const srcName = getClassName(subchapter, expRel.sourceId);
  const tgtName = getClassName(subchapter, expRel.targetId);

  const expKind = getCanonicalRelationKind(expRel);
  const actKind = getCanonicalRelationKind(actRel);
  const isBidirectionalExpected = expKind === 'association_bi';
  const isHierarchyExpected = expRel.type === 'generalization' || expRel.type === 'realization';

  const issues = [];

  if (expKind !== actKind) {
    issues.push(describeTypeMismatch(expRel, actRel, srcName, tgtName));
  }

  if (!isBidirectionalExpected && reverseDirection) {
    issues.push(describeDirectionMismatch(expRel, srcName, tgtName));
  }

  const actMultAtExpectedSrc = normalizeMultiplicity(
    sameDirection ? actRel.sourceMultiplicity : actRel.targetMultiplicity
  );
  const actMultAtExpectedTgt = normalizeMultiplicity(
    sameDirection ? actRel.targetMultiplicity : actRel.sourceMultiplicity
  );
  const actRoleAtExpectedSrc = sameDirection ? actRel.sourceRole : actRel.targetRole;
  const actRoleAtExpectedTgt = sameDirection ? actRel.targetRole : actRel.sourceRole;

  if (isHierarchyExpected) {
    if (actMultAtExpectedSrc || actMultAtExpectedTgt) {
      const kindCz = expRel.type === 'generalization' ? 'generalizace (dědičnosti)' : 'realizace rozhraní';
      issues.push(
        `Na vazbě ${kindCz} mezi ${srcName} a ${tgtName} máš nastavenou násobnost. V UML 2.5 se u ${kindCz} násobnosti neuvádějí – odeber je.`
      );
    }
  } else {
    const expSrcMult = normalizeMultiplicity(expRel.sourceMultiplicity);
    const expTgtMult = normalizeMultiplicity(expRel.targetMultiplicity);

    if (expSrcMult && actMultAtExpectedSrc !== expSrcMult) {
      issues.push(
        describeMultiplicityMismatch(expRel, 'source', srcName, srcName, tgtName, actMultAtExpectedSrc)
      );
    }
    if (expTgtMult && actMultAtExpectedTgt !== expTgtMult) {
      issues.push(
        describeMultiplicityMismatch(expRel, 'target', tgtName, srcName, tgtName, actMultAtExpectedTgt)
      );
    }
  }

  if (!isHierarchyExpected) {
    if (expRel.sourceRole && !roleMatches(expRel.sourceRole, actRoleAtExpectedSrc)) {
      issues.push(describeRoleMismatch(expRel, 'source', srcName, srcName, tgtName));
    }
    if (expRel.targetRole && !roleMatches(expRel.targetRole, actRoleAtExpectedTgt)) {
      issues.push(describeRoleMismatch(expRel, 'target', tgtName, srcName, tgtName));
    }
  }

  return {
    compatible: true,
    isPerfect: issues.length === 0,
    sameDirection,
    issues
  };
}

export function validateDiagram(subchapter, diagramState) {
  const expectedClasses = subchapter?.validationRules?.expectedClasses || subchapter?.expectedClasses || [];
  const expectedRelations = subchapter?.validationRules?.expectedRelations || subchapter?.expectedRelations || [];

  const placedIds = new Set((diagramState?.nodes || []).map((n) => n.classId));
  const actualRelations = diagramState?.relations || [];
  const isEmptyCanvas = placedIds.size === 0 && expectedClasses.length > 0;

  const details = [];
  let errorCount = 0;

  if (isEmptyCanvas) {
    details.push({
      status: 'error',
      category: 'empty_canvas',
      message: 'Plátno je prázdné – neumístil/a jsi žádnou třídu ani rozhraní. Přetáhni požadované prvky z levé palety na plátno a propoj je podle zadání.'
    });
  }

  // 1. Kontrola tříd a rozhraní
  let matchedClasses = 0;
  for (const expClassId of expectedClasses) {
    const cls = getClassDef(subchapter, expClassId);
    const name = cls?.name || expClassId;
    const entityLabel = cls?.stereotype === 'interface' || cls?.kind === 'interface' ? 'Rozhraní' : 'Třída';

    if (placedIds.has(expClassId)) {
      matchedClasses++;
      details.push({
        status: 'ok',
        category: 'class',
        message: `${entityLabel} ${name} je správně umístěna na plátně.`
      });
    } else {
      errorCount++;
      details.push({
        status: 'error',
        category: 'missing_class',
        message: `Chybí požadovaná položka: ${entityLabel.toLowerCase()} ${name} není umístěna na plátně. Přetáhni ji z palety.`
      });
    }
  }

  const missingClasses = expectedClasses.length - matchedClasses;
  const expectedClassSet = new Set(expectedClasses);
  let extraClassesCount = 0;
  for (const placedId of placedIds) {
    if (!expectedClassSet.has(placedId)) {
      extraClassesCount++;
      errorCount++;
      const name = getClassName(subchapter, placedId);
      details.push({
        status: 'error',
        category: 'extra_class',
        message: `Třída ${name} do tohoto zadání nepatří. Odeber ji z plátna zpět do palety.`
      });
    }
  }

  // 2. Optimální deterministické párování vazeb
  const candidatePairs = [];
  expectedRelations.forEach((expRel, expIdx) => {
    actualRelations.forEach((actRel, actIdx) => {
      const evaluation = evaluateRelationCandidate(expRel, actRel, subchapter);
      if (evaluation.compatible) {
        candidatePairs.push({ expIdx, actIdx, evaluation });
      }
    });
  });

  candidatePairs.sort((a, b) => {
    if (a.evaluation.isPerfect !== b.evaluation.isPerfect) {
      return a.evaluation.isPerfect ? -1 : 1;
    }
    if (a.evaluation.issues.length !== b.evaluation.issues.length) {
      return a.evaluation.issues.length - b.evaluation.issues.length;
    }
    if (a.evaluation.sameDirection !== b.evaluation.sameDirection) {
      return a.evaluation.sameDirection ? -1 : 1;
    }
    return a.expIdx - b.expIdx || a.actIdx - b.actIdx;
  });

  const matchedExpToAct = new Map();
  const usedActIndices = new Set();

  for (const pair of candidatePairs) {
    if (matchedExpToAct.has(pair.expIdx) || usedActIndices.has(pair.actIdx)) continue;
    matchedExpToAct.set(pair.expIdx, pair);
    usedActIndices.add(pair.actIdx);
  }

  // 3. Vyhodnocení spárovaných a chybějících vazeb (každá dílčí chyba na vazbě = 1 chyba)
  let perfectRelations = 0;
  let misconfiguredRelations = 0;
  let missingRelations = 0;

  expectedRelations.forEach((expRel, expIdx) => {
    const srcName = getClassName(subchapter, expRel.sourceId);
    const tgtName = getClassName(subchapter, expRel.targetId);
    const match = matchedExpToAct.get(expIdx);

    if (match) {
      if (match.evaluation.isPerfect) {
        perfectRelations++;
        details.push({
          status: 'ok',
          category: 'relation',
          message: `Vazba mezi ${srcName} a ${tgtName} je navržena správně.`
        });
      } else {
        misconfiguredRelations++;
        errorCount += match.evaluation.issues.length;
        for (const issueMsg of match.evaluation.issues) {
          details.push({
            status: 'warn',
            category: 'misconfigured_relation',
            message: issueMsg
          });
        }
      }
    } else {
      missingRelations++;
      errorCount++;
      const customMissing = expRel.feedback?.missing;
      details.push({
        status: 'error',
        category: 'missing_relation',
        message: customMissing
          || `Chybí požadovaná vazba mezi třídami ${srcName} a ${tgtName}. Podívej se znovu do zadání, jaký vztah je spojuje.`
      });
    }
  });

  // 4. Nadbytečné vazby navíc
  let extraRelations = 0;
  actualRelations.forEach((actRel, actIdx) => {
    if (usedActIndices.has(actIdx)) return;
    extraRelations++;
    errorCount++;
    const srcName = getClassName(subchapter, actRel.sourceId);
    const tgtName = getClassName(subchapter, actRel.targetId);
    details.push({
      status: 'error',
      category: 'extra_relation',
      message: `Vazba mezi ${srcName} a ${tgtName} je v diagramu navíc – zadání takové přímé propojení nevyžaduje. Klikni na ni a smaž ji (klávesa Delete).`
    });
  });

  // 5. Finální výpočet XP a hvězd
  // - Prázdné plátno: nelze odevzdat (passed: false, 0 XP, 0 ★)
  // - Svoboda selhat (1 chyba = 100 XP) platí pro 1 drobnou chybu v kompletním diagramu,
  //   nikoli při opomenutí třídy, opomenutí požadované vazby či přidání zakázané vazby v úloze bez vazeb.
  const passed = !isEmptyCanvas;
  const allowFreedomToFail =
    passed &&
    missingClasses === 0 &&
    missingRelations === 0 &&
    !(expectedRelations.length === 0 && extraRelations > 0);

  const xp = passed ? calculateXp(errorCount, { allowFreedomToFail }) : 0;
  const stars = passed ? calculateStars(xp) : 0;
  const freedomToFailApplied = allowFreedomToFail && errorCount === 1;

  const statusOrder = { error: 0, warn: 1, ok: 2 };
  details.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return {
    errors: errorCount,
    xp,
    score: xp,
    stars,
    passed,
    isEmptyCanvas,
    allowFreedomToFail,
    freedomToFailApplied,
    details,
    metrics: {
      matchedClasses,
      missingClasses,
      totalExpectedClasses: expectedClasses.length,
      extraClassesCount,
      perfectRelations,
      misconfiguredRelations,
      missingRelations,
      extraRelations,
      totalExpectedRelations: expectedRelations.length
    }
  };
}