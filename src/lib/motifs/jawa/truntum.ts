import { onBg } from '../../palettes';
import { el, f, ring } from '../../svg';
import type { Motif } from '../types';

/**
 * Truntum — small jasmine-like star flowers scattered over a dark cloth.
 * A 3×3 grid with jitter inside one tile keeps it organic yet seamless.
 */
export const truntum: Motif = {
  id: 'truntum',
  name: 'Truntum',
  island: 'jawa',
  region: 'Surakarta',
  origin: 'Surakarta, attributed to Queen Kencana (Kasunanan) in the 18th century',
  meaning: '"Tumaruntum" — love that blooms again; worn by parents at a wedding.',
  palette: 'malam',
  render({ rng, pal, scale, uid }) {
    const cells = 3;
    const t = scale * cells;
    const sw = Math.max(0.8, scale * 0.02);
    const petals = rng.int(5, 8);
    const filled = rng.chance(0.4);
    const line = onBg(pal);
    let out = '';

    const flower = (cx: number, cy: number, r: number, rot: number) => {
      let g = '';
      // pointed, radial petals like a jasmine star
      for (let k = 0; k < petals; k++) {
        const a = rot + (k / petals) * 360;
        g += `<g transform="rotate(${f(a)} ${f(cx)} ${f(cy)})">` +
          el('ellipse', {
            cx, cy: cy - r * 0.55, rx: r * (0.62 / petals) * 2.2, ry: r * 0.42,
            fill: filled ? line : 'none', stroke: line, 'stroke-width': sw,
          }) + '</g>';
      }
      g += el('circle', { cx, cy, r: r * 0.2, fill: pal.accent, stroke: line, 'stroke-width': sw * 0.8 });
      return g;
    };

    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        const cx = (i + 0.5) * scale + rng.range(-0.12, 0.12) * scale;
        const cy = (j + 0.5) * scale + rng.range(-0.12, 0.12) * scale;
        const r = scale * rng.range(0.24, 0.32);
        out += flower(cx, cy, r, rng.range(0, 90));
        // tiny "cecek" dots — the dotted fill typical of hand-drawn batik
        for (const [x, y] of ring(cx, cy, r * 1.35, rng.int(3, 6), rng.range(0, 6))) {
          out += el('circle', { cx: x, cy: y, r: sw * 0.9, fill: line, opacity: 0.8 });
        }
      }
    }

    const id = `${uid}-truntum`;
    return (
      `<defs><pattern id="${id}" width="${f(t)}" height="${f(t)}" patternUnits="userSpaceOnUse">` +
      el('rect', { width: t, height: t, fill: pal.bg }) + out +
      `</pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/>`
    );
  },
};
