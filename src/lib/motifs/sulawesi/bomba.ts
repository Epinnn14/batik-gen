import { onBg } from '../../palettes';
import { el, f, ring, tile } from '../../svg';
import type { Motif } from '../types';

/** Heart-shaped petal with its point at (0,0) and the lobes at distance s. */
const heart = (s: number) =>
  `M 0 0 C ${f(-s * 0.5)} ${f(-s * 0.3)} ${f(-s * 0.62)} ${f(-s * 0.95)} ${f(-s * 0.27)} ${f(-s)} ` +
  `C ${f(-s * 0.1)} ${f(-s * 1.02)} 0 ${f(-s * 0.9)} 0 ${f(-s * 0.82)} ` +
  `C 0 ${f(-s * 0.9)} ${f(s * 0.1)} ${f(-s * 1.02)} ${f(s * 0.27)} ${f(-s)} ` +
  `C ${f(s * 0.62)} ${f(-s * 0.95)} ${f(s * 0.5)} ${f(-s * 0.3)} 0 0 Z`;

/**
 * Bomba — the "flower" batik of the Kaili people of Palu: heart-petalled
 * blossoms in a grid, with leaves between the petals and small flowers on the corners.
 */
export const bomba: Motif = {
  id: 'bomba',
  name: 'Bomba',
  island: 'sulawesi',
  region: 'Palu, Central Sulawesi (Kaili)',
  origin: 'Kaili people of Palu; "bomba" means flower and the cloth is given to honoured guests',
  meaning: 'A blooming flower: friendship, warmth and an open welcome to whoever comes.',
  palette: 'pesisir',
  render({ rng, pal, scale: t, uid }) {
    const c = t / 2;
    const sw = Math.max(1, t * 0.012);
    const petals = rng.pick([4, 4, 6]);
    const dotted = rng.chance(0.6);
    const line = onBg(pal);
    let out = '';

    const flower = (cx: number, cy: number, s: number, rot: number) => {
      let g = '';
      for (let i = 0; i < petals; i++) {
        const a = rot + (i / petals) * 360;
        g +=
          `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(a)})">` +
          el('path', { d: heart(s), fill: pal.ink, stroke: pal.light, 'stroke-width': sw }) +
          el('path', {
            d: heart(s * 0.55),
            transform: `translate(0 ${f(-s * 0.3)})`,
            fill: 'none',
            stroke: pal.light,
            'stroke-width': sw * 0.7,
          }) +
          '</g>';
        // leaf between two petals
        const la = a + 180 / petals;
        g +=
          `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(la)})">` +
          el('ellipse', { cx: 0, cy: -s * 0.95, rx: s * 0.09, ry: s * 0.22, fill: pal.accent }) +
          '</g>';
      }
      g += el('circle', { cx, cy, r: s * 0.16, fill: pal.accent, stroke: pal.light, 'stroke-width': sw });
      return g;
    };

    const s = t * 0.3;
    out += flower(c, c, s, rng.pick([0, 45]));
    for (const [x, y] of [
      [0, 0],
      [t, 0],
      [0, t],
      [t, t],
    ]) {
      out += flower(x, y, s * 0.42, 45);
    }
    if (dotted) {
      for (const [x, y] of ring(c, c, s * 1.33, petals * 4, Math.PI / (petals * 4))) {
        out += el('circle', { cx: x, cy: y, r: sw * 0.9, fill: line });
      }
    }
    // small rings on the edge midpoints, where four leaves meet
    for (const [x, y] of [
      [c, 0],
      [0, c],
      [t, c],
      [c, t],
    ]) {
      out += el('circle', { cx: x, cy: y, r: sw * 2, fill: 'none', stroke: line, 'stroke-width': sw });
    }

    return tile(`${uid}-bomba`, t, t, pal.bg, out);
  },
};
