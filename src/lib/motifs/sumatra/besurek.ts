import { onBg } from '../../palettes';
import { el, f, ring, spiral, tile } from '../../svg';
import type { Rng } from '../../rng';
import type { Motif } from '../types';
import type { Palette } from '../../palettes';

function rafflesia(rng: Rng, pal: Palette, cx: number, cy: number, r: number, sw: number): string {
  let out = '';
  const rot = rng.range(0, 72);
  for (let i = 0; i < 5; i++) {
    const a = rot + i * 72;
    const warts = rng.int(4, 7);
    let petal = el('ellipse', {
      cx,
      cy: cy - r * 0.58,
      rx: r * 0.42,
      ry: r * 0.38,
      fill: pal.ink,
      stroke: pal.light,
      'stroke-width': sw,
    });
    for (let k = 0; k < warts; k++) {
      const wa = rng.range(0, Math.PI * 2);
      const wr = rng.range(0.1, 0.28) * r;
      petal += el('circle', {
        cx: cx + Math.cos(wa) * wr,
        cy: cy - r * 0.62 + Math.sin(wa) * wr * 0.8,
        r: r * rng.range(0.035, 0.06),
        fill: pal.light,
      });
    }
    out += `<g transform="rotate(${f(a)} ${f(cx)} ${f(cy)})">${petal}</g>`;
  }
  // the central cup with its ring of spikes
  out += el('circle', { cx, cy, r: r * 0.34, fill: pal.accent, stroke: pal.light, 'stroke-width': sw });
  out += el('circle', { cx, cy, r: r * 0.2, fill: pal.bg, stroke: pal.light, 'stroke-width': sw * 0.7 });
  for (const [x, y] of ring(cx, cy, r * 0.12, 7)) {
    out += el('circle', { cx: x, cy: y, r: sw * 0.9, fill: pal.light });
  }
  return out;
}

/**
 * Besurek — "lettered" batik of Bengkulu. Besides calligraphy it carries the
 * Rafflesia arnoldii flower and the curling fern frond (relung paku); this
 * generator draws the flower and the fern.
 */
export const besurek: Motif = {
  id: 'besurek',
  name: 'Besurek Rafflesia',
  island: 'sumatra',
  region: 'Bengkulu',
  origin: 'Bengkulu — batik besurek, said to have arrived with traders and the exiled from Java',
  meaning:
    'Rafflesia, the giant flower of the Bengkulu forest, beside the fern that keeps unfurling: pride in the land.',
  palette: 'lasem',
  render({ rng, pal, scale: t, uid }) {
    const sw = Math.max(1, t * 0.012);
    const line = onBg(pal);
    let out = '';

    // half-drop: one big flower in the centre, a smaller one on the corners
    out += rafflesia(rng, pal, t / 2, t / 2, t * 0.3, sw);
    const corner = rafflesia(rng, pal, 0, 0, t * 0.17, sw);
    for (const [x, y] of [
      [0, 0],
      [t, 0],
      [0, t],
      [t, t],
    ]) {
      out += `<g transform="translate(${f(x)} ${f(y)})">${corner}</g>`;
    }

    // relung paku: fern fronds unrolling at the edge midpoints
    const turns = rng.range(1.4, 2.2);
    const fr = t * 0.075;
    for (const [x, y, a] of [
      [t / 2, 0, 0],
      [t / 2, t, Math.PI],
      [0, t / 2, Math.PI / 2],
      [t, t / 2, -Math.PI / 2],
    ]) {
      out += el('path', {
        d: spiral(x, y, fr, turns, a),
        fill: 'none',
        stroke: line,
        'stroke-width': sw * 1.2,
        'stroke-linecap': 'round',
      });
      for (const [lx, ly] of ring(x, y, fr * 1.35, 6, a)) {
        out += el('circle', { cx: lx, cy: ly, r: sw * 1.2, fill: pal.accent });
      }
    }

    return tile(`${uid}-besurek`, t, t, pal.bg, out);
  },
};
