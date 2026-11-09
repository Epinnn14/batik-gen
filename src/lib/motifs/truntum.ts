import { el, f, ring } from '../svg';
import type { Motif } from './types';

/**
 * Truntum — small jasmine-like star flowers scattered over a dark cloth.
 * A 3×3 grid with jitter inside one tile keeps it organic yet seamless.
 */
export const truntum: Motif = {
  id: 'truntum',
  name: 'Truntum',
  origin: 'Surakarta, attributed to Queen Kencana (Kasunanan) in the 18th century',
  meaning: '"Tumaruntum" — love that blooms again; worn by parents at a wedding.',
  render({ rng, pal, scale, uid }) {
    const cells = 3;
    const t = scale * cells;
    const sw = Math.max(0.8, scale * 0.02);
    const petals = rng.int(5, 8);
    const filled = rng.chance(0.4);
    let out = '';

    const flower = (cx: number, cy: number, r: number, rot: number) => {
      let g = '';
      for (const [x, y] of ring(cx, cy, r * 0.55, petals, rot)) {
        g += el('circle', {
          cx: x, cy: y, r: r * 0.36,
          fill: filled ? pal.light : 'none', stroke: pal.light, 'stroke-width': sw,
        });
      }
      g += el('circle', { cx, cy, r: r * 0.22, fill: pal.accent, stroke: pal.light, 'stroke-width': sw * 0.6 });
      return g;
    };

    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        const cx = (i + 0.5) * scale + rng.range(-0.12, 0.12) * scale;
        const cy = (j + 0.5) * scale + rng.range(-0.12, 0.12) * scale;
        const r = scale * rng.range(0.24, 0.32);
        out += flower(cx, cy, r, rng.range(0, Math.PI));
        // tiny "cecek" dots — the dotted fill typical of hand-drawn batik
        for (const [x, y] of ring(cx, cy, r * 1.35, rng.int(3, 6), rng.range(0, 6))) {
          out += el('circle', { cx: x, cy: y, r: sw * 0.9, fill: pal.light, opacity: 0.8 });
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
