/**
 * Plnohodnotný interaktivní i statický editor návrhových diagramů tříd dle UML 2.5 (konvence UOMO).
 * - Drag-and-Drop (Pointer Events) pro myš i dotyk s fixním náhledem (odolný vůči odscrollování)
 * - Dědění souřadnic a vazeb při inheritPreviousCanvas: true s aktualizací definic tříd
 * - Kliknutí na vazbu ji vybere (smazání klávesou Delete / Backspace), dvojklik nebo tlačítko Upravit otevře editor vazby
 * - Přesné UML 2.5 markery (včetně <──> pro obousměrnou asociaci), zakřivení vícenásobných vazeb
 *   a nekolizní rozmístění štítků multiplicity a role pro vodorovné, šikmé i vertikální vazby
 */

const MULTIPLICITY_OPTIONS = [
  { value: '', label: '— (neuvedeno)' },
  { value: '1', label: '1' },
  { value: '0..1', label: '0..1' },
  { value: '1..*', label: '1..*' },
  { value: '0..*', label: '0..*' }
];

const RELATION_PRESETS = [
  {
    key: 'association_uni',
    type: 'association',
    navigability: 'unidirectional',
    label: 'Asociace (řiditelná)',
    symbol: '──>',
    allowMultiplicity: true,
    allowSourceRole: false,
    allowTargetRole: true
  },
  {
    key: 'aggregation_uni',
    type: 'aggregation',
    navigability: 'unidirectional',
    label: 'Agregace',
    symbol: '◇──>',
    allowMultiplicity: true,
    allowSourceRole: false,
    allowTargetRole: true
  },
  {
    key: 'composition_uni',
    type: 'composition',
    navigability: 'unidirectional',
    label: 'Kompozice',
    symbol: '◆──>',
    allowMultiplicity: true,
    allowSourceRole: false,
    allowTargetRole: true
  },
  {
    key: 'generalization',
    type: 'generalization',
    navigability: 'none',
    label: 'Generalizace / dědičnost',
    symbol: '──▷',
    allowMultiplicity: false,
    allowSourceRole: false,
    allowTargetRole: false
  },
  {
    key: 'realization',
    type: 'realization',
    navigability: 'none',
    label: 'Realizace rozhraní',
    symbol: '┄┄▷',
    allowMultiplicity: false,
    allowSourceRole: false,
    allowTargetRole: false
  },
  {
    key: 'association_bi',
    type: 'association',
    navigability: 'bidirectional',
    label: 'Obousměrná asociace',
    symbol: '<──>',
    allowMultiplicity: true,
    allowSourceRole: true,
    allowTargetRole: true
  }
];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getPresetByKey(key) {
  return RELATION_PRESETS.find((p) => p.key === key) || RELATION_PRESETS[0];
}

function isUnidirectionalNav(nav) {
  return nav === 'target' || nav === 'unidirectional';
}

function getPresetKeyFromRelation(rel) {
  if (rel.type === 'generalization') return 'generalization';
  if (rel.type === 'realization') return 'realization';
  if (rel.type === 'aggregation') return 'aggregation_uni';
  if (rel.type === 'composition') return 'composition_uni';
  if (rel.type === 'association' && !isUnidirectionalNav(rel.navigability)) return 'association_bi';
  return 'association_uni';
}

function formatAttribute(attr) {
  const vis = attr.visibility || '-';
  const typePart = attr.type ? `: ${attr.type}` : '';
  return `${vis} ${attr.name}${typePart}`;
}

function formatMethod(method) {
  const vis = method.visibility || '+';
  const params = method.params || '';
  const ret = method.returnType ? `: ${method.returnType}` : '';
  return `${vis} ${method.name}(${params})${ret}`;
}

function isTypingInFormField(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function buildUmlClassInnerHtml(classDef, { showReturnBtn = false } = {}) {
  const stereotypeText = classDef.stereotype
    ? classDef.stereotype
    : (classDef.kind === 'interface' ? 'interface' : (classDef.isAbstract ? 'abstract' : null));

  const stereotypeHtml = stereotypeText
    ? `<span class="uml-class-stereotype">&laquo;${escapeHtml(stereotypeText)}&raquo;</span>`
    : '';

  const nameClasses = ['uml-class-name'];
  if (classDef.isAbstract) nameClasses.push('abstract');

  const attrs = classDef.attributes || [];
  const methods = classDef.methods || [];

  const attrsHtml = attrs.length
    ? attrs
        .map((a) => `<div class="uml-member${a.isStatic ? ' static' : ''}">${escapeHtml(formatAttribute(a))}</div>`)
        .join('')
    : '<div class="uml-member uml-member-empty">&nbsp;</div>';

  const methodsHtml = methods.length
    ? methods
        .map((m) => {
          const cls = `uml-member${m.isStatic ? ' static' : ''}${m.isAbstract ? ' abstract' : ''}`;
          return `<div class="${cls}">${escapeHtml(formatMethod(m))}</div>`;
        })
        .join('')
    : '<div class="uml-member uml-member-empty">&nbsp;</div>';

  return `
    <div class="uml-class-header${stereotypeText === 'interface' ? ' is-interface' : ''}">
      ${stereotypeHtml}
      <span class="${nameClasses.join(' ')}">${escapeHtml(classDef.name)}</span>
      ${showReturnBtn ? '<button type="button" class="uml-class-remove" title="Vrátit třídu do palety" aria-label="Vrátit třídu do palety">↩</button>' : ''}
    </div>
    <div class="uml-class-compartment">${attrsHtml}</div>
    <div class="uml-class-compartment">${methodsHtml}</div>
  `;
}

function buildClassBoxElement(classDef, options = {}) {
  const { interactive = false, onRemove = null, onPortPointerDown = null } = options;
  const el = document.createElement('div');
  el.className = `uml-class-box${interactive ? ' interactive' : ''}`;
  el.dataset.classId = classDef.id;
  el.innerHTML = buildUmlClassInnerHtml(classDef, { showReturnBtn: interactive });

  if (interactive) {
    if (onRemove) {
      el.querySelector('.uml-class-remove')?.addEventListener('click', (e) => {
        e.stopPropagation();
        onRemove(classDef.id);
      });
    }

    for (const side of ['top', 'right', 'bottom', 'left']) {
      const port = document.createElement('button');
      port.type = 'button';
      port.className = `uml-port uml-port-${side}`;
      port.title = 'Táhněte na jinou třídu pro vytvoření vazby';
      port.setAttribute('aria-label', `Vytvořit vazbu ze třídy ${classDef.name}`);
      port.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onPortPointerDown) onPortPointerDown(classDef.id, side, e);
      });
      el.appendChild(port);
    }
  }

  return el;
}

/* ============================================================================
 * SVG Geometrie a přesné vykreslování UML 2.5 vazeb
 * ========================================================================== */

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

function buildSvgDefs(prefix) {
  const defs = createSvgElement('defs');

  // Otevřená šipka na cíli (-->)
  const arrowOpen = createSvgElement('marker', {
    id: `${prefix}-arrow-open`,
    viewBox: '0 0 14 12',
    markerWidth: '14',
    markerHeight: '12',
    refX: '13',
    refY: '6',
    orient: 'auto',
    markerUnits: 'userSpaceOnUse'
  });
  arrowOpen.appendChild(createSvgElement('path', {
    d: 'M 2 1.5 L 13 6 L 2 10.5',
    fill: 'none',
    stroke: '#1e3a5f',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }));

  // Otevřená šipka na zdroji (<--) pro obousměrně řiditelnou asociaci (<-->)
  const arrowOpenStart = createSvgElement('marker', {
    id: `${prefix}-arrow-open-start`,
    viewBox: '0 0 14 12',
    markerWidth: '14',
    markerHeight: '12',
    refX: '1',
    refY: '6',
    orient: 'auto',
    markerUnits: 'userSpaceOnUse'
  });
  arrowOpenStart.appendChild(createSvgElement('path', {
    d: 'M 12 1.5 L 1 6 L 12 10.5',
    fill: 'none',
    stroke: '#1e3a5f',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }));

  // Prázdný trojúhelník pro generalizaci a realizaci rozhraní
  const arrowTriangle = createSvgElement('marker', {
    id: `${prefix}-arrow-triangle`,
    viewBox: '0 0 16 14',
    markerWidth: '16',
    markerHeight: '14',
    refX: '15',
    refY: '7',
    orient: 'auto',
    markerUnits: 'userSpaceOnUse'
  });
  arrowTriangle.appendChild(createSvgElement('path', {
    d: 'M 1.5 1.5 L 15 7 L 1.5 12.5 Z',
    fill: '#ffffff',
    stroke: '#1e3a5f',
    'stroke-width': '1.8',
    'stroke-linejoin': 'round'
  }));

  // Prázdný kosočtverec pro agregaci
  const diamondOpen = createSvgElement('marker', {
    id: `${prefix}-diamond-open`,
    viewBox: '0 0 18 12',
    markerWidth: '18',
    markerHeight: '12',
    refX: '1',
    refY: '6',
    orient: 'auto',
    markerUnits: 'userSpaceOnUse'
  });
  diamondOpen.appendChild(createSvgElement('path', {
    d: 'M 1 6 L 9 1.5 L 17 6 L 9 10.5 Z',
    fill: '#ffffff',
    stroke: '#1e3a5f',
    'stroke-width': '1.7',
    'stroke-linejoin': 'round'
  }));

  // Plný kosočtverec pro kompozici
  const diamondFilled = createSvgElement('marker', {
    id: `${prefix}-diamond-filled`,
    viewBox: '0 0 18 12',
    markerWidth: '18',
    markerHeight: '12',
    refX: '1',
    refY: '6',
    orient: 'auto',
    markerUnits: 'userSpaceOnUse'
  });
  diamondFilled.appendChild(createSvgElement('path', {
    d: 'M 1 6 L 9 1.5 L 17 6 L 9 10.5 Z',
    fill: '#1e3a5f',
    stroke: '#1e3a5f',
    'stroke-width': '1.5',
    'stroke-linejoin': 'round'
  }));

  defs.append(arrowOpen, arrowOpenStart, arrowTriangle, diamondOpen, diamondFilled);
  return defs;
}

function intersectRectFromCenter(rect, targetPt, padding = 1.5) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const dx = targetPt.x - cx;
  const dy = targetPt.y - cy;

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: cx, y: cy };
  }

  const hw = rect.w / 2 + padding;
  const hh = rect.h / 2 + padding;

  const scaleX = Math.abs(dx) > 0.001 ? hw / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.001 ? hh / Math.abs(dy) : Infinity;
  const t = Math.min(scaleX, scaleY);

  return {
    x: cx + dx * t,
    y: cy + dy * t
  };
}

function evalQuadBezier(p0, q, p2, t) {
  const mt = 1 - t;
  const x = mt * mt * p0.x + 2 * mt * t * q.x + t * t * p2.x;
  const y = mt * mt * p0.y + 2 * mt * t * q.y + t * t * p2.y;

  const tx = 2 * mt * (q.x - p0.x) + 2 * t * (p2.x - q.x);
  const ty = 2 * mt * (q.y - p0.y) + 2 * t * (p2.y - q.y);
  const len = Math.hypot(tx, ty) || 1;

  return { x, y, tx: tx / len, ty: ty / len };
}

function estimateBadgeWidth(text) {
  return Math.max(18, String(text).length * 6.8 + 10);
}

function appendSvgBadgeText(parent, x, y, text, className = 'uml-svg-label') {
  if (!text) return;
  const group = createSvgElement('g', { class: `${className}-group` });

  const approxW = estimateBadgeWidth(text);
  const approxH = 17;

  const bg = createSvgElement('rect', {
    x: (x - approxW / 2).toFixed(1),
    y: (y - approxH / 2).toFixed(1),
    width: approxW.toFixed(1),
    height: approxH.toFixed(1),
    rx: '4',
    ry: '4',
    class: 'uml-edge-label-bg'
  });

  const labelEl = createSvgElement('text', {
    x: x.toFixed(1),
    y: (y + 3.8).toFixed(1),
    'text-anchor': 'middle',
    class: className
  });
  labelEl.textContent = text;

  group.append(bg, labelEl);
  parent.appendChild(group);
}

/**
 * Nekolizní rozmístění štítků multiplicity a role na konci vazby:
 * - U svislých úseků (|ty| > |tx|) umístí multiplicitu vlevo (multW / 2 + 10)
 *   a roli vpravo (roleW / 2 + 10) od osy čáry, takže se nikdy nemohou překrýt.
 * - U vodorovných úseků (|tx| >= |ty|) umístí multiplicitu nad čáru (-15 px)
 *   a roli pod čáru (+16 px) s odstupem od okraje třídy.
 */
function placeEndpointBadges(edgeGroup, pt, edgeEndPt, midPt, multiplicity, role, hasMarker) {
  if (!multiplicity && !role) return;

  const isVertical = Math.abs(pt.ty) > Math.abs(pt.tx);
  const multW = multiplicity ? estimateBadgeWidth(multiplicity) : 0;
  const roleW = role ? estimateBadgeWidth(role) : 0;

  if (isVertical) {
    const multX = pt.x - (multW / 2 + 10);
    const roleX = pt.x + (roleW / 2 + 10);

    // Mírný posun od okraje třídy / šipky / kosočtverce podél svislé osy
    const inwardDirY = Math.sign(midPt.y - edgeEndPt.y) || 1;
    const minVerticalClearance = hasMarker ? 26 : 18;
    const currentDistY = Math.abs(pt.y - edgeEndPt.y);
    const maxDistY = Math.max(minVerticalClearance, Math.abs(midPt.y - edgeEndPt.y) - 6);
    const safeDistY = Math.min(Math.max(currentDistY, minVerticalClearance), maxDistY);
    const badgeY = edgeEndPt.y + inwardDirY * safeDistY;

    if (multiplicity) {
      appendSvgBadgeText(edgeGroup, multX, badgeY, multiplicity, 'uml-svg-mult');
    }
    if (role) {
      appendSvgBadgeText(edgeGroup, roleX, badgeY, role, 'uml-svg-role');
    }
    return;
  }

  // Vodorovný / mírně šikmý úsek: multiplicita nad čarou (-15 px), role pod čarou (+16 px)
  const inwardDirX = Math.sign(midPt.x - edgeEndPt.x) || 1;
  const halfSpanX = Math.abs(midPt.x - edgeEndPt.x);
  const markerClearance = hasMarker ? 16 : 8;

  const computeSafeHorizontalX = (badgeW) => {
    const currentDistX = Math.abs(pt.x - edgeEndPt.x);
    const desiredDistX = Math.max(currentDistX, badgeW / 2 + markerClearance);
    const maxDistX = Math.max(currentDistX, halfSpanX);
    return edgeEndPt.x + inwardDirX * Math.min(desiredDistX, maxDistX);
  };

  if (multiplicity) {
    appendSvgBadgeText(edgeGroup, computeSafeHorizontalX(multW), pt.y - 15, multiplicity, 'uml-svg-mult');
  }
  if (role) {
    appendSvgBadgeText(edgeGroup, computeSafeHorizontalX(roleW), pt.y + 16, role, 'uml-svg-role');
  }
}

function renderSvgRelations(svgEl, nodesMap, relations, options = {}) {
  const {
    prefix = 'uml',
    interactive = false,
    selectedId = null,
    onSelectRelation = null,
    onEditRelation = null
  } = options;

  svgEl.innerHTML = '';
  svgEl.appendChild(buildSvgDefs(prefix));

  const bundles = new Map();
  for (const rel of relations) {
    if (!nodesMap.has(rel.sourceId) || !nodesMap.has(rel.targetId)) continue;
    const key = [rel.sourceId, rel.targetId].sort().join('::');
    if (!bundles.has(key)) bundles.set(key, []);
    bundles.get(key).push(rel);
  }

  for (const [, bundleRels] of bundles) {
    const total = bundleRels.length;

    bundleRels.forEach((rel, index) => {
      const srcRect = nodesMap.get(rel.sourceId);
      const tgtRect = nodesMap.get(rel.targetId);
      if (!srcRect || !tgtRect) return;

      const c1 = { x: srcRect.x + srcRect.w / 2, y: srcRect.y + srcRect.h / 2 };
      const c2 = { x: tgtRect.x + tgtRect.w / 2, y: tgtRect.y + tgtRect.h / 2 };

      const isCanonical = rel.sourceId < rel.targetId;
      const dxCanon = isCanonical ? (c2.x - c1.x) : (c1.x - c2.x);
      const dyCanon = isCanonical ? (c2.y - c1.y) : (c1.y - c2.y);
      const dist = Math.hypot(dxCanon, dyCanon) || 1;
      const nx = -dyCanon / dist;
      const ny = dxCanon / dist;

      const curveSpacing = 62;
      const offset = total > 1 ? (index - (total - 1) / 2) * curveSpacing : 0;

      const controlPt = {
        x: (c1.x + c2.x) / 2 + nx * offset,
        y: (c1.y + c2.y) / 2 + ny * offset
      };

      const p1 = intersectRectFromCenter(srcRect, offset === 0 ? c2 : controlPt, 1.5);
      const p2 = intersectRectFromCenter(tgtRect, offset === 0 ? c1 : controlPt, 1.5);

      const pathData = offset === 0
        ? `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
        : `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${controlPt.x.toFixed(1)} ${controlPt.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;

      const edgeGroup = createSvgElement('g', {
        class: `uml-edge-group${interactive ? ' interactive' : ''}${selectedId === rel.id ? ' selected' : ''}`,
        'data-rel-id': rel.id || ''
      });

      if (interactive) {
        const hitPath = createSvgElement('path', { d: pathData, class: 'uml-edge-hit' });
        edgeGroup.appendChild(hitPath);
        edgeGroup.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onSelectRelation) onSelectRelation(rel);
        });
        edgeGroup.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          if (onEditRelation) onEditRelation(rel);
        });
      }

      const pathAttrs = { d: pathData, class: 'uml-edge-path' };
      const isBidirectionalAssoc = rel.type === 'association' && !isUnidirectionalNav(rel.navigability);

      if (rel.type === 'realization' || rel.type === 'dependency') {
        pathAttrs['stroke-dasharray'] = '7 5';
      }

      let hasStartMarker = false;
      let hasEndMarker = false;

      if (rel.type === 'generalization' || rel.type === 'realization') {
        pathAttrs['marker-end'] = `url(#${prefix}-arrow-triangle)`;
        hasEndMarker = true;
      } else {
        if (rel.type === 'aggregation') {
          pathAttrs['marker-start'] = `url(#${prefix}-diamond-open)`;
          hasStartMarker = true;
        } else if (rel.type === 'composition') {
          pathAttrs['marker-start'] = `url(#${prefix}-diamond-filled)`;
          hasStartMarker = true;
        } else if (isBidirectionalAssoc) {
          // Obousměrně řiditelná asociace má dle konvence UOMO otevřenou šipku na obou koncích (<──>)
          pathAttrs['marker-start'] = `url(#${prefix}-arrow-open-start)`;
          hasStartMarker = true;
        }

        const shouldShowTargetArrow =
          isUnidirectionalNav(rel.navigability) ||
          isBidirectionalAssoc ||
          rel.type === 'aggregation' ||
          rel.type === 'composition' ||
          rel.type === 'dependency';

        if (shouldShowTargetArrow) {
          pathAttrs['marker-end'] = `url(#${prefix}-arrow-open)`;
          hasEndMarker = true;
        }
      }

      edgeGroup.appendChild(createSvgElement('path', pathAttrs));

      const qEval = offset === 0
        ? { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
        : controlPt;

      const edgeLen = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      const baseEndOffsetPx = Math.min(34, Math.max(22, edgeLen * 0.22));
      const srcOffsetPx = hasStartMarker ? baseEndOffsetPx + 10 : baseEndOffsetPx;
      const tgtOffsetPx = hasEndMarker ? baseEndOffsetPx + 8 : baseEndOffsetPx;

      const tSrc = Math.min(0.34, srcOffsetPx / edgeLen);
      const tTgt = Math.max(0.66, 1 - tgtOffsetPx / edgeLen);

      const midPt = evalQuadBezier(p1, qEval, p2, 0.5);
      const srcPt = evalQuadBezier(p1, qEval, p2, tSrc);
      const tgtPt = evalQuadBezier(p1, qEval, p2, tTgt);

      if (rel.label) {
        appendSvgBadgeText(
          edgeGroup,
          midPt.x - midPt.ty * 13,
          midPt.y + midPt.tx * 13,
          rel.label,
          'uml-svg-label'
        );
      }

      placeEndpointBadges(edgeGroup, srcPt, p1, midPt, rel.sourceMultiplicity, rel.sourceRole, hasStartMarker);
      placeEndpointBadges(edgeGroup, tgtPt, p2, midPt, rel.targetMultiplicity, rel.targetRole, hasEndMarker);

      svgEl.appendChild(edgeGroup);
    });
  }
}

/* ============================================================================
 * Statický renderovací režim pro teoretickou část
 * ========================================================================== */

let staticRenderCounter = 0;

export function renderStaticUmlDiagram(containerElement, diagramSpec) {
  containerElement.innerHTML = '';

  if (!diagramSpec || !Array.isArray(diagramSpec.classes) || diagramSpec.classes.length === 0) {
    containerElement.innerHTML = '<p class="static-empty-note">Ukázkový diagram pro tuto podkapitolu bude doplněn.</p>';
    return;
  }

  const prefix = `static-uml-${++staticRenderCounter}`;
  const stage = document.createElement('div');
  stage.className = 'uml-stage';
  containerElement.appendChild(stage);

  const svgEl = createSvgElement('svg', { class: 'uml-svg-layer' });
  stage.appendChild(svgEl);

  const boxRefs = [];

  for (const cls of diagramSpec.classes) {
    const box = buildClassBoxElement(cls, { interactive: false });
    const x = cls.x ?? 20;
    const y = cls.y ?? 20;
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    stage.appendChild(box);
    boxRefs.push({ id: cls.id, x, y, box });
  }

  const layoutAndDraw = () => {
    const nodesMap = new Map();
    let maxRight = 420;
    let maxBottom = 220;

    for (const ref of boxRefs) {
      const w = ref.box.offsetWidth || 195;
      const h = ref.box.offsetHeight || 105;
      nodesMap.set(ref.id, { x: ref.x, y: ref.y, w, h });
      maxRight = Math.max(maxRight, ref.x + w + 40);
      maxBottom = Math.max(maxBottom, ref.y + h + 40);
    }

    stage.style.minWidth = `${maxRight}px`;
    stage.style.minHeight = `${maxBottom}px`;
    svgEl.setAttribute('width', String(maxRight));
    svgEl.setAttribute('height', String(maxBottom));

    renderSvgRelations(svgEl, nodesMap, diagramSpec.relations || [], {
      prefix,
      interactive: false
    });
  };

  layoutAndDraw();
  requestAnimationFrame(layoutAndDraw);
}

/* ============================================================================
 * Interaktivní UML 2.5 Editor
 * ========================================================================== */

export class UmlCanvasEditor {
  constructor(canvasEl, paletteEl, relationControlsEl, { onChange } = {}) {
    this.canvasEl = canvasEl;
    this.paletteEl = paletteEl;
    this.relationControlsEl = relationControlsEl;
    this.onChange = onChange || (() => {});

    this.subchapter = null;
    this.paletteMap = new Map();
    this.nodes = [];
    this.relations = [];

    this.connectMode = false;
    this.pendingSourceId = null;
    this.selectedRelationId = null;
    this.editingRelation = null;

    this.stageEl = null;
    this.svgEl = null;
    this.tempSvgEl = null;
    this.nodesMap = new Map();

    this.toolbarConnectBtn = document.getElementById('btn-connect-mode');
    this._initRelationModal();
    this._bindGlobalShortcuts();
  }

  _bindGlobalShortcuts() {
    if (this.toolbarConnectBtn) {
      this.toolbarConnectBtn.addEventListener('click', () => this.toggleConnectMode());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.connectMode) this.setConnectMode(false);
        if (this.selectedRelationId) {
          this.selectRelation(null);
        }
        if (this.modalEl && !this.modalEl.hidden) {
          this._closeRelationModal();
        }
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedRelationId) {
        if (isTypingInFormField(e.target)) return;
        e.preventDefault();
        const idToDelete = this.selectedRelationId;
        if (this.modalEl && !this.modalEl.hidden) {
          this._closeRelationModal();
        }
        this.removeRelation(idToDelete);
      }
    });

    this.canvasEl.addEventListener('click', (e) => {
      if (e.target === this.canvasEl || e.target === this.stageEl || e.target === this.svgEl) {
        if (this.pendingSourceId) {
          this.pendingSourceId = null;
          this._updateConnectHighlights();
          this._renderRelationBar();
        }
        if (this.selectedRelationId) {
          this.selectRelation(null);
        }
      }
    });
  }

  _initRelationModal() {
    let modal = document.getElementById('modal-relation-editor');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-relation-editor';
      modal.className = 'modal-backdrop';
      modal.hidden = true;
      modal.innerHTML = `
        <div class="modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="rel-modal-title">
          <div class="modal-header">
            <h3 id="rel-modal-title">Nastavení UML 2.5 vazby</h3>
            <button type="button" class="modal-close" id="rel-modal-close" aria-label="Zavřít">&times;</button>
          </div>
          <div class="modal-body" id="rel-modal-body"></div>
          <div class="modal-footer" id="rel-modal-footer"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modalEl = modal;
    this.modalTitleEl = modal.querySelector('#rel-modal-title');
    this.modalBodyEl = modal.querySelector('#rel-modal-body');
    this.modalFooterEl = modal.querySelector('#rel-modal-footer');

    modal.querySelector('#rel-modal-close')?.addEventListener('click', () => this._closeRelationModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this._closeRelationModal();
    });
  }

  setConnectMode(enabled) {
    this.connectMode = Boolean(enabled);
    this.pendingSourceId = null;
    this.canvasEl.classList.toggle('connect-mode', this.connectMode);
    if (this.toolbarConnectBtn) {
      this.toolbarConnectBtn.classList.toggle('btn-connect-active', this.connectMode);
      this.toolbarConnectBtn.setAttribute('aria-pressed', String(this.connectMode));
    }
    this._updateConnectHighlights();
    this._renderRelationBar();
  }

  toggleConnectMode() {
    this.setConnectMode(!this.connectMode);
  }

  loadSubchapter(subchapter, initialCanvasState = null) {
    this.subchapter = subchapter;
    const classesList = subchapter.classes || subchapter.paletteClasses || [];
    this.paletteMap = new Map(classesList.map((c) => [c.id, c]));
    this.setConnectMode(false);
    this.selectedRelationId = null;

    if (initialCanvasState && Array.isArray(initialCanvasState.nodes)) {
      this.nodes = initialCanvasState.nodes
        .filter((n) => this.paletteMap.has(n.classId))
        .map((n) => ({
          classId: n.classId,
          x: Math.max(12, Math.round(n.x)),
          y: Math.max(12, Math.round(n.y))
        }));

      const validIds = new Set(this.nodes.map((n) => n.classId));
      this.relations = (initialCanvasState.relations || [])
        .filter((r) => validIds.has(r.sourceId) && validIds.has(r.targetId))
        .map((r) => {
          const relType = r.type || 'association';
          const defaultNav = (relType === 'generalization' || relType === 'realization')
            ? 'none'
            : 'unidirectional';
          return {
            id: r.id || `rel-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            type: relType,
            sourceId: r.sourceId,
            targetId: r.targetId,
            sourceMultiplicity: r.sourceMultiplicity || null,
            targetMultiplicity: r.targetMultiplicity || null,
            navigability: r.navigability || defaultNav,
            label: r.label || '',
            sourceRole: r.sourceRole || '',
            targetRole: r.targetRole || ''
          };
        });
    } else {
      this.nodes = [];
      this.relations = [];
    }

    this.render();
  }

  _findFreePosition() {
    const colWidth = 255;
    const rowHeight = 165;
    for (let i = 0; i < 30; i++) {
      const candidateX = 28 + (i % 3) * colWidth;
      const candidateY = 28 + Math.floor(i / 3) * rowHeight;
      const overlaps = this.nodes.some(
        (n) => Math.abs(n.x - candidateX) < 160 && Math.abs(n.y - candidateY) < 100
      );
      if (!overlaps) return { x: candidateX, y: candidateY };
    }
    return { x: 40 + this.nodes.length * 24, y: 40 + this.nodes.length * 24 };
  }

  addClassToCanvas(classId, x = null, y = null) {
    if (!this.paletteMap.has(classId)) return;
    if (this.nodes.some((n) => n.classId === classId)) return;

    const pos = (x !== null && y !== null)
      ? { x: Math.max(12, Math.round(x)), y: Math.max(12, Math.round(y)) }
      : this._findFreePosition();

    this.nodes.push({ classId, x: pos.x, y: pos.y });
    this._emitChange();
    this.render();
  }

  removeClassFromCanvas(classId) {
    this.nodes = this.nodes.filter((n) => n.classId !== classId);
    this.relations = this.relations.filter((r) => r.sourceId !== classId && r.targetId !== classId);
    if (this.pendingSourceId === classId) this.pendingSourceId = null;
    if (this.selectedRelationId && !this.relations.some((r) => r.id === this.selectedRelationId)) {
      this.selectedRelationId = null;
    }
    this._emitChange();
    this.render();
  }

  /**
   * Označí vazbu bez přestavby SVG DOMu, aby spolehlivě fungoval i dvojklik (dblclick).
   */
  selectRelation(rel) {
    this.selectedRelationId = rel ? rel.id : null;
    if (this.svgEl) {
      this.svgEl.querySelectorAll('.uml-edge-group').forEach((g) => {
        g.classList.toggle('selected', g.getAttribute('data-rel-id') === this.selectedRelationId);
      });
    }
    this._renderRelationBar();
  }

  saveRelation(relData, existingId = null) {
    if (!relData.sourceId || !relData.targetId || relData.sourceId === relData.targetId) return;

    if (existingId) {
      const idx = this.relations.findIndex((r) => r.id === existingId);
      if (idx !== -1) {
        this.relations[idx] = { ...this.relations[idx], ...relData, id: existingId };
      }
    } else {
      this.relations.push({
        id: `rel-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        ...relData
      });
    }

    this.selectedRelationId = null;
    this._emitChange();
    this.render();
  }

  removeRelation(relationId) {
    this.relations = this.relations.filter((r) => r.id !== relationId);
    if (this.selectedRelationId === relationId) this.selectedRelationId = null;
    this._emitChange();
    this.render();
  }

  clearCanvas() {
    this.nodes = [];
    this.relations = [];
    this.pendingSourceId = null;
    this.selectedRelationId = null;
    this._emitChange();
    this.render();
  }

  getDiagramState() {
    return {
      nodes: this.nodes.map((n) => ({ classId: n.classId, x: n.x, y: n.y })),
      relations: this.relations.map((r) => ({ ...r }))
    };
  }

  _emitChange() {
    this.onChange(this.getDiagramState());
  }

  render() {
    this._renderPalette();
    this._renderCanvas();
    this._renderRelationBar();
  }

  _renderPalette() {
    this.paletteEl.innerHTML = '';
    const placedIds = new Set(this.nodes.map((n) => n.classId));
    const classesList = this.subchapter?.classes || this.subchapter?.paletteClasses || [];

    for (const cls of classesList) {
      const isPlaced = placedIds.has(cls.id);
      const wrapper = document.createElement('div');
      wrapper.className = `palette-card palette-uml-card${isPlaced ? ' placed' : ''}`;
      wrapper.dataset.classId = cls.id;

      wrapper.innerHTML = `
        <div class="palette-uml-preview">
          ${buildUmlClassInnerHtml(cls, { showReturnBtn: false })}
        </div>
        <div class="palette-card-footer">
          <span>${isPlaced ? '✓ Umístěno na plátně' : 'Přetáhněte nebo klikněte'}</span>
        </div>
      `;

      if (!isPlaced) {
        this._attachPalettePointerDrag(wrapper, cls);
      }

      this.paletteEl.appendChild(wrapper);
    }
  }

  _attachPalettePointerDrag(cardEl, classDef) {
    cardEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      let isDragging = false;
      let ghost = null;

      const onMove = (moveEvt) => {
        const dist = Math.hypot(moveEvt.clientX - startX, moveEvt.clientY - startY);
        if (!isDragging && dist > 6) {
          isDragging = true;
          ghost = document.createElement('div');
          ghost.className = 'uml-class-box palette-drag-ghost';
          ghost.style.position = 'fixed';
          ghost.innerHTML = buildUmlClassInnerHtml(classDef, { showReturnBtn: false });
          document.body.appendChild(ghost);
        }

        if (isDragging && ghost) {
          ghost.style.left = `${moveEvt.clientX - 95}px`;
          ghost.style.top = `${moveEvt.clientY - 30}px`;

          const rect = this.canvasEl.getBoundingClientRect();
          const over =
            moveEvt.clientX >= rect.left &&
            moveEvt.clientX <= rect.right &&
            moveEvt.clientY >= rect.top &&
            moveEvt.clientY <= rect.bottom;
          this.canvasEl.classList.toggle('drag-over', over);
        }
      };

      const onUp = (upEvt) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        this.canvasEl.classList.remove('drag-over');

        if (ghost) {
          ghost.remove();
          ghost = null;
        }

        if (!isDragging) {
          this.addClassToCanvas(classDef.id);
          return;
        }

        const rect = this.canvasEl.getBoundingClientRect();
        const overCanvas =
          upEvt.clientX >= rect.left &&
          upEvt.clientX <= rect.right &&
          upEvt.clientY >= rect.top &&
          upEvt.clientY <= rect.bottom;

        if (overCanvas) {
          const x = Math.max(12, Math.round(upEvt.clientX - rect.left + this.canvasEl.scrollLeft - 95));
          const y = Math.max(12, Math.round(upEvt.clientY - rect.top + this.canvasEl.scrollTop - 30));
          this.addClassToCanvas(classDef.id, x, y);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });
  }

  _renderCanvas() {
    this.canvasEl.innerHTML = '';
    this.nodesMap.clear();

    const stage = document.createElement('div');
    stage.className = 'uml-stage';
    this.stageEl = stage;
    this.canvasEl.appendChild(stage);

    const svgEl = createSvgElement('svg', { class: 'uml-svg-layer' });
    this.svgEl = svgEl;
    stage.appendChild(svgEl);

    const tempSvgEl = createSvgElement('svg', { class: 'uml-svg-temp-layer' });
    this.tempSvgEl = tempSvgEl;
    stage.appendChild(tempSvgEl);

    if (this.nodes.length === 0) {
      const hint = document.createElement('div');
      hint.className = 'canvas-empty-hint';
      hint.innerHTML = 'Přetáhněte třídy z levé palety na plátno (nebo na kartu klikněte).<br><small>Vazby vytvoříte tažením z kotevního bodu třídy nebo tlačítkem <strong>Propojit třídy</strong>.</small>';
      stage.appendChild(hint);
      return;
    }

    const boxRefs = [];

    for (const node of this.nodes) {
      const classDef = this.paletteMap.get(node.classId);
      if (!classDef) continue;

      const box = buildClassBoxElement(classDef, {
        interactive: true,
        onRemove: (id) => this.removeClassFromCanvas(id),
        onPortPointerDown: (sourceId, side, evt) => this._startPortConnection(sourceId, side, evt)
      });

      box.style.left = `${node.x}px`;
      box.style.top = `${node.y}px`;

      this._attachNodeInteraction(box, node);
      stage.appendChild(box);
      boxRefs.push({ node, box });
    }

    this._refreshGeometryAndSvg(boxRefs);
    this._updateConnectHighlights();
  }

  _refreshGeometryAndSvg(boxRefs = null) {
    if (!this.stageEl || !this.svgEl) return;

    const boxes = boxRefs || Array.from(this.stageEl.querySelectorAll('.uml-class-box.interactive')).map((box) => ({
      node: this.nodes.find((n) => n.classId === box.dataset.classId),
      box
    })).filter((item) => Boolean(item.node));

    this.nodesMap.clear();
    let maxRight = Math.max(this.canvasEl.clientWidth || 720, 720);
    let maxBottom = Math.max(this.canvasEl.clientHeight || 420, 420);

    for (const { node, box } of boxes) {
      const w = box.offsetWidth || 195;
      const h = box.offsetHeight || 105;
      this.nodesMap.set(node.classId, { x: node.x, y: node.y, w, h });
      maxRight = Math.max(maxRight, node.x + w + 90);
      maxBottom = Math.max(maxBottom, node.y + h + 90);
    }

    this.stageEl.style.width = `${maxRight}px`;
    this.stageEl.style.height = `${maxBottom}px`;
    this.svgEl.setAttribute('width', String(maxRight));
    this.svgEl.setAttribute('height', String(maxBottom));
    if (this.tempSvgEl) {
      this.tempSvgEl.setAttribute('width', String(maxRight));
      this.tempSvgEl.setAttribute('height', String(maxBottom));
    }

    renderSvgRelations(this.svgEl, this.nodesMap, this.relations, {
      prefix: 'interactive-uml',
      interactive: true,
      selectedId: this.selectedRelationId,
      onSelectRelation: (rel) => this.selectRelation(rel),
      onEditRelation: (rel) => this.openRelationModal({ existingRelation: rel })
    });
  }

  _updateConnectHighlights() {
    if (!this.stageEl) return;
    this.stageEl.querySelectorAll('.uml-class-box.interactive').forEach((box) => {
      box.classList.toggle('connect-source', this.pendingSourceId === box.dataset.classId);
    });
  }

  _attachNodeInteraction(boxEl, node) {
    boxEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      if (this.connectMode) {
        e.preventDefault();
        e.stopPropagation();
        this._handleConnectModeClick(node.classId);
        return;
      }

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = node.x;
      const origY = node.y;
      let moved = false;

      boxEl.classList.add('is-dragging');

      const onMove = (moveEvt) => {
        const dx = moveEvt.clientX - startX;
        const dy = moveEvt.clientY - startY;
        if (Math.hypot(dx, dy) > 2) moved = true;

        node.x = Math.max(12, Math.round(origX + dx));
        node.y = Math.max(12, Math.round(origY + dy));
        boxEl.style.left = `${node.x}px`;
        boxEl.style.top = `${node.y}px`;

        this._refreshGeometryAndSvg();
      };

      const onUp = () => {
        boxEl.classList.remove('is-dragging');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (moved) this._emitChange();
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });
  }

  _handleConnectModeClick(classId) {
    if (!this.pendingSourceId) {
      this.pendingSourceId = classId;
      this._updateConnectHighlights();
      this._renderRelationBar();
      return;
    }

    if (this.pendingSourceId === classId) {
      this.pendingSourceId = null;
      this._updateConnectHighlights();
      this._renderRelationBar();
      return;
    }

    const sourceId = this.pendingSourceId;
    this.pendingSourceId = null;
    this._updateConnectHighlights();
    this._renderRelationBar();
    this.openRelationModal({ sourceId, targetId: classId });
  }

  _startPortConnection(sourceId, side) {
    const srcRect = this.nodesMap.get(sourceId);
    if (!srcRect || !this.tempSvgEl) return;

    const anchorPt = {
      top: { x: srcRect.x + srcRect.w / 2, y: srcRect.y },
      right: { x: srcRect.x + srcRect.w, y: srcRect.y + srcRect.h / 2 },
      bottom: { x: srcRect.x + srcRect.w / 2, y: srcRect.y + srcRect.h },
      left: { x: srcRect.x, y: srcRect.y + srcRect.h / 2 }
    }[side];

    const tempLine = createSvgElement('line', {
      x1: anchorPt.x,
      y1: anchorPt.y,
      x2: anchorPt.x,
      y2: anchorPt.y,
      class: 'uml-temp-connection'
    });
    this.tempSvgEl.innerHTML = '';
    this.tempSvgEl.appendChild(tempLine);

    let hoveredTargetEl = null;

    const findTargetBox = (clientX, clientY) => {
      const el = document.elementFromPoint(clientX, clientY);
      const box = el?.closest('.uml-class-box.interactive');
      if (box && box.dataset.classId !== sourceId) return box;
      return null;
    };

    const onMove = (moveEvt) => {
      const canvasRect = this.canvasEl.getBoundingClientRect();
      const x2 = moveEvt.clientX - canvasRect.left + this.canvasEl.scrollLeft;
      const y2 = moveEvt.clientY - canvasRect.top + this.canvasEl.scrollTop;
      tempLine.setAttribute('x2', String(x2));
      tempLine.setAttribute('y2', String(y2));

      const targetBox = findTargetBox(moveEvt.clientX, moveEvt.clientY);
      if (hoveredTargetEl && hoveredTargetEl !== targetBox) {
        hoveredTargetEl.classList.remove('connect-target-hover');
      }
      hoveredTargetEl = targetBox;
      if (hoveredTargetEl) {
        hoveredTargetEl.classList.add('connect-target-hover');
      }
    };

    const onUp = (upEvt) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      this.tempSvgEl.innerHTML = '';

      if (hoveredTargetEl) {
        hoveredTargetEl.classList.remove('connect-target-hover');
      }

      const targetBox = findTargetBox(upEvt.clientX, upEvt.clientY);
      if (targetBox) {
        this.openRelationModal({ sourceId, targetId: targetBox.dataset.classId });
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  _renderRelationBar() {
    const placedCount = this.nodes.length;
    const selectedRel = this.relations.find((r) => r.id === this.selectedRelationId) || null;

    let statusText = 'Kliknutím na vazbu ji vyberete (smazání klávesou Delete/Backspace), dvojklikem nebo kliknutím na štítek ji upravíte.';

    if (placedCount < 2) {
      statusText = 'Pro vytvoření vazby umístěte na plátno alespoň 2 třídy.';
    } else if (this.connectMode) {
      if (this.pendingSourceId) {
        const srcName = this.paletteMap.get(this.pendingSourceId)?.name || '';
        statusText = `Zdroj vybrán: ${srcName}. Nyní klikněte na cílovou třídu (Esc zruší).`;
      } else {
        statusText = 'Režim propojení je aktivní: klikněte na zdrojovou třídu na plátně.';
      }
    }

    const selectedBannerHtml = selectedRel
      ? (() => {
          const sName = this.paletteMap.get(selectedRel.sourceId)?.name || selectedRel.sourceId;
          const tName = this.paletteMap.get(selectedRel.targetId)?.name || selectedRel.targetId;
          return `
            <div class="relation-selected-bar">
              <span>Vybraná vazba: <strong>${escapeHtml(sName)} → ${escapeHtml(tName)}</strong></span>
              <div class="relation-selected-actions">
                <button type="button" id="btn-edit-selected-rel" class="btn btn-sm btn-primary">✎ Upravit</button>
                <button type="button" id="btn-del-selected-rel" class="btn btn-sm btn-danger">Smazat (Delete)</button>
              </div>
            </div>
          `;
        })()
      : '';

    this.relationControlsEl.innerHTML = `
      <div class="relation-bar-top">
        <div class="relation-bar-actions">
          <button type="button" id="btn-bar-connect" class="btn btn-sm ${this.connectMode ? 'btn-primary' : 'btn-outline'}" ${placedCount < 2 ? 'disabled' : ''}>
            ${this.connectMode ? '✓ Ukončit režim propojení' : '⤳ Propojit třídy'}
          </button>
          <span class="relation-bar-status">${escapeHtml(statusText)}</span>
        </div>
      </div>
      ${selectedBannerHtml}
      <div class="relation-list" id="rel-summary-list"></div>
    `;

    this.relationControlsEl.querySelector('#btn-bar-connect')?.addEventListener('click', () => {
      this.toggleConnectMode();
    });

    if (selectedRel) {
      this.relationControlsEl.querySelector('#btn-edit-selected-rel')?.addEventListener('click', () => {
        this.openRelationModal({ existingRelation: selectedRel });
      });
      this.relationControlsEl.querySelector('#btn-del-selected-rel')?.addEventListener('click', () => {
        this.removeRelation(selectedRel.id);
      });
    }

    const listEl = this.relationControlsEl.querySelector('#rel-summary-list');
    if (this.relations.length === 0) {
      listEl.innerHTML = '<span class="relation-empty-note">Zatím nejsou vytvořeny žádné vazby.</span>';
      return;
    }

    for (const rel of this.relations) {
      const srcName = this.paletteMap.get(rel.sourceId)?.name || rel.sourceId;
      const tgtName = this.paletteMap.get(rel.targetId)?.name || rel.targetId;
      const preset = getPresetByKey(getPresetKeyFromRelation(rel));
      const isSelected = rel.id === this.selectedRelationId;

      const pill = document.createElement('div');
      pill.className = `relation-pill${isSelected ? ' is-selected' : ''}`;
      pill.title = 'Kliknutím upravíte vazbu';
      pill.innerHTML = `
        <button type="button" class="relation-pill-edit">
          <strong>${escapeHtml(srcName)}</strong>
          ${rel.sourceMultiplicity ? `<span class="pill-mult">[${escapeHtml(rel.sourceMultiplicity)}]</span>` : ''}
          ${rel.sourceRole ? `<em class="pill-role">(${escapeHtml(rel.sourceRole)})</em>` : ''}
          <span class="pill-sym">${escapeHtml(preset.symbol)}</span>
          <strong>${escapeHtml(tgtName)}</strong>
          ${rel.targetMultiplicity ? `<span class="pill-mult">[${escapeHtml(rel.targetMultiplicity)}]</span>` : ''}
          ${rel.targetRole ? `<em class="pill-role">(${escapeHtml(rel.targetRole)})</em>` : ''}
        </button>
        <button type="button" class="relation-pill-del" title="Smazat vazbu" aria-label="Smazat vazbu">&times;</button>
      `;

      pill.querySelector('.relation-pill-edit').addEventListener('click', () => {
        this.openRelationModal({ existingRelation: rel });
      });
      pill.querySelector('.relation-pill-del').addEventListener('click', () => {
        this.removeRelation(rel.id);
      });

      listEl.appendChild(pill);
    }
  }

  openRelationModal({ sourceId = null, targetId = null, existingRelation = null } = {}) {
    const isEdit = Boolean(existingRelation);
    this.editingRelation = existingRelation ? { ...existingRelation } : null;
    this.selectRelation(existingRelation || null);

    const draft = isEdit
      ? {
          sourceId: existingRelation.sourceId,
          targetId: existingRelation.targetId,
          presetKey: getPresetKeyFromRelation(existingRelation),
          sourceMultiplicity: existingRelation.sourceMultiplicity || '',
          targetMultiplicity: existingRelation.targetMultiplicity || '',
          sourceRole: existingRelation.sourceRole || '',
          targetRole: existingRelation.targetRole || ''
        }
      : {
          sourceId,
          targetId,
          presetKey: 'association_uni',
          sourceMultiplicity: '1',
          targetMultiplicity: '0..*',
          sourceRole: '',
          targetRole: ''
        };

    this.modalTitleEl.textContent = isEdit ? 'Upravit UML 2.5 vazbu' : 'Nová UML 2.5 vazba';

    const renderForm = () => {
      const srcName = this.paletteMap.get(draft.sourceId)?.name || draft.sourceId;
      const tgtName = this.paletteMap.get(draft.targetId)?.name || draft.targetId;
      const activePreset = getPresetByKey(draft.presetKey);

      const multOptionsHtml = (selectedVal) =>
        MULTIPLICITY_OPTIONS.map(
          (opt) => `<option value="${escapeHtml(opt.value)}"${opt.value === selectedVal ? ' selected' : ''}>${escapeHtml(opt.label)}</option>`
        ).join('');

      const presetCardsHtml = RELATION_PRESETS.map((p) => `
        <label class="relation-type-card${p.key === draft.presetKey ? ' active' : ''}">
          <input type="radio" name="rel-preset" value="${p.key}" ${p.key === draft.presetKey ? 'checked' : ''}>
          <span class="rel-card-symbol">${escapeHtml(p.symbol)}</span>
          <span class="rel-card-label">${escapeHtml(p.label)}</span>
        </label>
      `).join('');

      let rolesSectionHtml = '';
      if (activePreset.allowTargetRole && !activePreset.allowSourceRole) {
        // Řiditelná vazba směrem k cíli (asociace, agregace, kompozice): zobrazit a zvýraznit pouze Roli u cíle
        rolesSectionHtml = `
          <div class="form-group role-target-highlight">
            <label for="rel-input-tgt-role">Role u cíle (${escapeHtml(tgtName)}) — odpovídá názvu referenčního atributu ve třídě ${escapeHtml(srcName)}:</label>
            <input type="text" id="rel-input-tgt-role" class="input" value="${escapeHtml(draft.targetRole)}" placeholder="např. vozidla, polozky, styl">
            <span class="role-field-hint">U řiditelné vazby se role uvádí pouze na cílové straně (u šipky).</span>
          </div>
        `;
      } else if (activePreset.allowSourceRole && activePreset.allowTargetRole) {
        // Obousměrná asociace (<──>): obě role
        rolesSectionHtml = `
          <div class="relation-row-2col">
            <div class="form-group">
              <label for="rel-input-src-role">Role u zdroje (${escapeHtml(srcName)}):</label>
              <input type="text" id="rel-input-src-role" class="input" value="${escapeHtml(draft.sourceRole)}" placeholder="např. vlastnik">
            </div>
            <div class="form-group role-target-highlight">
              <label for="rel-input-tgt-role">Role u cíle (${escapeHtml(tgtName)}):</label>
              <input type="text" id="rel-input-tgt-role" class="input" value="${escapeHtml(draft.targetRole)}" placeholder="např. ucty">
            </div>
          </div>
        `;
      }

      this.modalBodyEl.innerHTML = `
        <div class="relation-endpoints-banner">
          <div class="endpoint-box">
            <span class="endpoint-caption">Zdroj (odkud)</span>
            <strong>${escapeHtml(srcName)}</strong>
          </div>
          <button type="button" id="btn-swap-direction" class="btn btn-sm btn-outline btn-swap" title="Otočit směr vazby">
            ⇄ Otočit směr
          </button>
          <div class="endpoint-box">
            <span class="endpoint-caption">Cíl (kam)</span>
            <strong>${escapeHtml(tgtName)}</strong>
          </div>
        </div>

        <div class="form-group">
          <label>Typ vazby podle UML 2.5:</label>
          <div class="relation-type-grid">${presetCardsHtml}</div>
        </div>

        <div class="relation-row-2col" ${activePreset.allowMultiplicity ? '' : 'style="opacity:0.55;"'}>
          <div class="form-group">
            <label for="rel-input-src-mult">Multiplicita u zdroje (${escapeHtml(srcName)}):</label>
            <select id="rel-input-src-mult" class="input" ${activePreset.allowMultiplicity ? '' : 'disabled'}>
              ${multOptionsHtml(activePreset.allowMultiplicity ? draft.sourceMultiplicity : '')}
            </select>
          </div>
          <div class="form-group">
            <label for="rel-input-tgt-mult">Multiplicita u cíle (${escapeHtml(tgtName)}):</label>
            <select id="rel-input-tgt-mult" class="input" ${activePreset.allowMultiplicity ? '' : 'disabled'}>
              ${multOptionsHtml(activePreset.allowMultiplicity ? draft.targetMultiplicity : '')}
            </select>
          </div>
        </div>

        ${!activePreset.allowMultiplicity
          ? '<p class="rel-hint-note">Pro generalizaci a realizaci rozhraní se v UML 2.5 multiplicita ani role neuvádějí.</p>'
          : ''}

        ${rolesSectionHtml}
      `;

      this.modalBodyEl.querySelectorAll('input[name="rel-preset"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          draft.presetKey = radio.value;
          const nextPreset = getPresetByKey(draft.presetKey);
          if (!nextPreset.allowMultiplicity) {
            draft.sourceMultiplicity = '';
            draft.targetMultiplicity = '';
          }
          if (!nextPreset.allowSourceRole) {
            draft.sourceRole = '';
          }
          if (!nextPreset.allowTargetRole) {
            draft.targetRole = '';
          }
          renderForm();
        });
      });

      this.modalBodyEl.querySelector('#btn-swap-direction')?.addEventListener('click', () => {
        [draft.sourceId, draft.targetId] = [draft.targetId, draft.sourceId];
        [draft.sourceMultiplicity, draft.targetMultiplicity] = [draft.targetMultiplicity, draft.sourceMultiplicity];
        if (activePreset.allowSourceRole) {
          [draft.sourceRole, draft.targetRole] = [draft.targetRole, draft.sourceRole];
        } else {
          draft.sourceRole = '';
        }
        renderForm();
      });

      this.modalBodyEl.querySelector('#rel-input-src-mult')?.addEventListener('change', (e) => {
        draft.sourceMultiplicity = e.target.value;
      });
      this.modalBodyEl.querySelector('#rel-input-tgt-mult')?.addEventListener('change', (e) => {
        draft.targetMultiplicity = e.target.value;
      });
      this.modalBodyEl.querySelector('#rel-input-src-role')?.addEventListener('input', (e) => {
        draft.sourceRole = e.target.value;
      });
      this.modalBodyEl.querySelector('#rel-input-tgt-role')?.addEventListener('input', (e) => {
        draft.targetRole = e.target.value;
      });
    };

    renderForm();

    this.modalFooterEl.innerHTML = `
      ${isEdit ? '<button type="button" id="btn-rel-delete" class="btn btn-danger" style="margin-right:auto;">Smazat vazbu</button>' : ''}
      <button type="button" id="btn-rel-cancel" class="btn btn-outline">Zrušit</button>
      <button type="button" id="btn-rel-save" class="btn btn-primary">${isEdit ? 'Uložit změny' : 'Vytvořit vazbu'}</button>
    `;

    this.modalFooterEl.querySelector('#btn-rel-cancel').addEventListener('click', () => this._closeRelationModal());

    if (isEdit) {
      this.modalFooterEl.querySelector('#btn-rel-delete').addEventListener('click', () => {
        this.removeRelation(existingRelation.id);
        this._closeRelationModal();
      });
    }

    this.modalFooterEl.querySelector('#btn-rel-save').addEventListener('click', () => {
      const preset = getPresetByKey(draft.presetKey);
      const payload = {
        type: preset.type,
        navigability: preset.navigability,
        sourceId: draft.sourceId,
        targetId: draft.targetId,
        sourceMultiplicity: preset.allowMultiplicity ? (draft.sourceMultiplicity || null) : null,
        targetMultiplicity: preset.allowMultiplicity ? (draft.targetMultiplicity || null) : null,
        label: '',
        sourceRole: preset.allowSourceRole ? draft.sourceRole.trim() : '',
        targetRole: preset.allowTargetRole ? draft.targetRole.trim() : ''
      };

      this.saveRelation(payload, isEdit ? existingRelation.id : null);
      this._closeRelationModal();
    });

    this.modalEl.hidden = false;
  }

  _closeRelationModal() {
    if (this.modalEl) this.modalEl.hidden = true;
    this.editingRelation = null;
    this.selectRelation(null);
  }
}
