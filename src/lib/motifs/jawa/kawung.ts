import { el, f, ring } from '../../svg';
import type { Motif } from '../types';

/**
 * Kawung — four ovals (the cut aren palm fruit) meeting at a point.
 * Ovals are placed on the tile diagonals so neighbouring tiles join into
 * the classic endless lattice of four-petal flowers.
 */
export const kawung: Motif = {
  id: 'kawung',
  name: 'Kawung',
  island: 'jawa',
  region: 'Yogyakarta & Surakarta',
  origin: 'Central Java (Yogyakarta & Surakarta courts), one of the oldest batik patterns',
  meaning: 'The aren fruit: purity, order and the hope that one stays useful to others.',
  palette: 'sogan',
  render({ rng, pal, scale: t, uid }) {
    const rx = t * rng.range(0.3, 0.345);
    const ry = t * rng.range(0.13, 0.19);
    const inner = rng.pick(['dots', 'seed', 'line'] as const);
    const centre = rng.pick(['dot', 'star', 'ring'] as const);
    const dots = rng.int(2, 4);
    const strokeW = Math.max(1, t * 0.018);

    const oval = (cx: number, cy: number, angle: number): string => {
      const parts = [
        el('ellipse', { cx, cy, rx, ry, fill: pal.ink, stroke: pal.light, 'stroke-width': strokeW }),
      ];
      const rot = `rotate(${f(angle)} ${f(cx)} ${f(cy)})`;
      if (inner === 'seed') {
        parts.push(el('ellipse', { cx, cy, rx: rx * 0.55, ry: ry * 0.45, fill: 'none', stroke: pal.light, 'stroke-width': strokeW * 0.8 }));
      } else if (inner === 'line') {
        parts.push(el('line', { x1: cx - rx * 0.7, y1: cy, x2: cx + rx * 0.7, y2: cy, stroke: pal.light, 'stroke-width': strokeW }));
      } else {
        for (let i = 0; i < dots; i++) {
          const x = cx - rx * 0.5 + (rx * (i + 0.5)) / dots;
          parts.push(el('circle', { cx: x, cy, r: ry * 0.16, fill: pal.light }));
        }
      }
      return `<g transform="${rot}">${parts.join('')}</g>`;
    };

    const q = t / 4;
    const ovals = [
      oval(q, q, 45), oval(3 * q, q, -45), oval(q, 3 * q, -45), oval(3 * q, 3 * q, 45),
    ].join('');

    const centreMark = (cx: number, cy: number): string => {
      if (centre === 'ring') {
        return el('circle', { cx, cy, r: t * 0.06, fill: pal.bg, stroke: pal.accent, 'stroke-width': strokeW });
      }
      if (centre === 'star') {
        const pts = ring(cx, cy, t * 0.07, 4).map(([x, y]) => `${f(x)},${f(y)}`);
        const inner4 = ring(cx, cy, t * 0.025, 4, Math.PI / 4).map(([x, y]) => `${f(x)},${f(y)}`);
        const star = pts.flatMap((p, i) => [p, inner4[i]]).join(' ');
        return el('polygon', { points: star, fill: pal.accent });
      }
      return el('circle', { cx, cy, r: t * 0.045, fill: pal.accent });
    };
    const centres = [[t / 2, t / 2], [0, 0], [t, 0], [0, t], [t, t]].map(([x, y]) => centreMark(x, y)).join('');

    const id = `${uid}-kawung`;
    return (
      `<defs><pattern id="${id}" width="${f(t)}" height="${f(t)}" patternUnits="userSpaceOnUse">` +
      el('rect', { width: t, height: t, fill: pal.bg }) + ovals + centres +
      `</pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/>`
    );
  },
};
