import { onBg } from '../../palettes';
import { el, f, pts, ring, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Pa' Barre Allo — the sun disc carved on the gables of the Toraja tongkonan
 * house: a circle of rays around rings, with triangles in the corners.
 */
export const barreAllo: Motif = {
  id: 'barre-allo',
  name: "Pa' Barre Allo",
  island: 'sulawesi',
  region: 'Tana Toraja, South Sulawesi',
  origin: 'Toraja wood carving (passura\'), painted on the tongkonan house',
  meaning:
    'The sun: the source of life and the hope that the family will shine and be blessed by the Creator.',
  palette: 'toraja',
  render({ rng, pal, scale: t, uid }) {
    const c = t / 2;
    const sw = Math.max(1, t * 0.012);
    const rays = rng.pick([12, 16, 20]);
    const centre = rng.pick(['wheel', 'flower'] as const);
    const line = onBg(pal);
    const R = t * 0.42;
    let out = '';

    out += el('circle', { cx: c, cy: c, r: R, fill: pal.ink, stroke: pal.light, 'stroke-width': sw });

    // triangular rays between two radii, alternating yellow and white
    const r0 = R * 0.64;
    const r1 = R * 0.95;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
      const da = (Math.PI / rays) * 0.85;
      out += el('polygon', {
        points: pts([
          [c + Math.cos(a - da) * r0, c + Math.sin(a - da) * r0],
          [c + Math.cos(a) * r1, c + Math.sin(a) * r1],
          [c + Math.cos(a + da) * r0, c + Math.sin(a + da) * r0],
        ]),
        fill: i % 2 ? pal.light : pal.accent,
      });
    }

    out += el('circle', { cx: c, cy: c, r: r0 * 0.97, fill: pal.bg, stroke: pal.accent, 'stroke-width': sw * 1.4 });
    out += el('circle', { cx: c, cy: c, r: r0 * 0.72, fill: 'none', stroke: pal.light, 'stroke-width': sw });
    if (centre === 'wheel') {
      for (const [x, y] of ring(c, c, r0 * 0.72, 8)) {
        out += el('line', { x1: c, y1: c, x2: x, y2: y, stroke: pal.light, 'stroke-width': sw });
      }
    } else {
      for (let i = 0; i < 4; i++) {
        out += `<g transform="rotate(${i * 45} ${f(c)} ${f(c)})">${el('ellipse', {
          cx: c,
          cy: c,
          rx: r0 * 0.14,
          ry: r0 * 0.62,
          fill: pal.ink,
          stroke: pal.light,
          'stroke-width': sw * 0.8,
        })}</g>`;
      }
    }
    out += el('circle', { cx: c, cy: c, r: r0 * 0.18, fill: pal.accent, stroke: pal.light, 'stroke-width': sw });

    // corner triangles: four tiles together make a diamond
    const k = t * 0.16;
    for (const [x, y, sx, sy] of [
      [0, 0, 1, 1],
      [t, 0, -1, 1],
      [0, t, 1, -1],
      [t, t, -1, -1],
    ]) {
      out += el('polygon', {
        points: pts([
          [x, y],
          [x + sx * k, y],
          [x, y + sy * k],
        ]),
        fill: pal.ink,
        stroke: line,
        'stroke-width': sw,
      });
      out += el('polygon', {
        points: pts([
          [x, y],
          [x + sx * k * 0.5, y],
          [x, y + sy * k * 0.5],
        ]),
        fill: pal.accent,
      });
    }

    return tile(`${uid}-barre-allo`, t, t, pal.bg, out);
  },
};
