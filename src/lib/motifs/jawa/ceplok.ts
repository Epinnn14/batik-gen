import { onBg } from '../../palettes';
import { el, f, ring } from '../../svg';
import type { Motif } from '../types';

/** Ceplok — geometric rosettes inside a square grid (8-fold symmetry). */
export const ceplok: Motif = {
  id: 'ceplok',
  name: 'Ceplok',
  island: 'jawa',
  region: 'Yogyakarta',
  origin: 'Yogyakarta — a large family of grid-based "ceplokan" patterns',
  meaning: 'Balance of the four directions around a centre (keblat papat lima pancer).',
  palette: 'nila',
  render({ rng, pal, scale: t, uid }) {
    const c = t / 2;
    const sw = Math.max(1, t * 0.014);
    const petalCount = rng.pick([4, 8, 8, 12]);
    const starFill = rng.chance(0.5);
    const ringed = rng.chance(0.6);
    const line = onBg(pal);
    let out = '';

    // 8-point star from two rotated squares
    const sq = (rot: number, r: number) =>
      ring(c, c, r, 4, rot).map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
    out += el('polygon', { points: sq(Math.PI / 4, t * 0.42), fill: starFill ? pal.ink : 'none', stroke: starFill ? pal.light : line, 'stroke-width': sw });
    out += el('polygon', { points: sq(0, t * 0.42), fill: starFill ? pal.ink : 'none', stroke: starFill ? pal.light : line, 'stroke-width': sw });

    if (ringed) out += el('circle', { cx: c, cy: c, r: t * 0.27, fill: pal.bg, stroke: pal.accent, 'stroke-width': sw * 1.4 });

    // petals
    const pr = t * 0.2;
    for (let i = 0; i < petalCount; i++) {
      const a = (i / petalCount) * 360;
      out += `<g transform="rotate(${f(a)} ${f(c)} ${f(c)})">` +
        el('ellipse', { cx: c, cy: c - pr * 0.62, rx: pr * (petalCount > 8 ? 0.16 : 0.26), ry: pr * 0.55, fill: ringed || !starFill ? line : pal.light, opacity: 0.92 }) +
        '</g>';
    }
    out += el('circle', { cx: c, cy: c, r: t * 0.055, fill: pal.accent, stroke: pal.light, 'stroke-width': sw });

    // corner quarter-flowers so tiles interlock
    for (const [x, y] of [[0, 0], [t, 0], [0, t], [t, t]]) {
      out += el('circle', { cx: x, cy: y, r: t * 0.12, fill: pal.ink, stroke: pal.light, 'stroke-width': sw });
      out += el('circle', { cx: x, cy: y, r: t * 0.04, fill: pal.accent });
    }
    // edge midpoints: small diamonds
    for (const [x, y] of [[c, 0], [0, c], [t, c], [c, t]]) {
      const d = t * 0.045;
      out += el('polygon', { points: `${f(x - d)},${f(y)} ${f(x)},${f(y - d)} ${f(x + d)},${f(y)} ${f(x)},${f(y + d)}`, fill: line });
    }

    const id = `${uid}-ceplok`;
    return (
      `<defs><pattern id="${id}" width="${f(t)}" height="${f(t)}" patternUnits="userSpaceOnUse">` +
      el('rect', { width: t, height: t, fill: pal.bg }) + out +
      `</pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/>`
    );
  },
};
