import { onBg } from '../../palettes';
import { el, f, pts, spiral, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Pucuk Rebung — rows of young bamboo shoots (tall triangles) standing on a
 * border band, with inverted triangles filling the gaps between them.
 */
export const pucukRebung: Motif = {
  id: 'pucuk-rebung',
  name: 'Pucuk Rebung',
  island: 'sumatra',
  region: 'Riau & West Sumatra (Malay and Minangkabau)',
  origin: 'Malay world of Riau and the Minangkabau of West Sumatra; also common on songket',
  meaning:
    'The bamboo shoot grows straight and becomes useful at every age: growth, hope and good conduct.',
  palette: 'lasem',
  render({ rng, pal, scale: w, uid }) {
    const h = w * rng.range(1.1, 1.3);
    const sw = Math.max(1, w * 0.016);
    const base = h * 0.8;
    const apex = h * 0.06;
    const half = w * rng.range(0.34, 0.4);
    const nested = rng.int(2, 4);
    const style = rng.pick(['nested', 'stem'] as const);
    const line = onBg(pal);
    let out = '';

    // the shoot
    const tri = (s: number) => {
      const cy = (2 * base + apex) / 3; // centroid
      const p = (x: number, y: number) => [w / 2 + (x - w / 2) * s, cy + (y - cy) * s] as const;
      return pts([p(w / 2, apex), p(w / 2 + half, base), p(w / 2 - half, base)]);
    };
    out += el('polygon', { points: tri(1), fill: pal.ink, stroke: pal.light, 'stroke-width': sw });
    if (style === 'nested') {
      for (let k = 1; k <= nested; k++) {
        const s = 1 - k / (nested + 1);
        out += el('polygon', {
          points: tri(s),
          fill: k === nested ? pal.accent : 'none',
          stroke: pal.light,
          'stroke-width': sw * 0.8,
        });
      }
    } else {
      out += el('line', {
        x1: w / 2,
        y1: base,
        x2: w / 2,
        y2: apex + h * 0.1,
        stroke: pal.light,
        'stroke-width': sw,
      });
      for (let k = 1; k <= nested + 1; k++) {
        const y = base - ((base - apex) * k) / (nested + 2.5);
        const len = half * (1 - (base - y) / (base - apex)) * 0.7;
        for (const dir of [-1, 1]) {
          out += el('path', {
            d: `M ${f(w / 2)} ${f(y + len * 0.5)} Q ${f(w / 2 + dir * len * 0.6)} ${f(y + len * 0.3)} ${f(w / 2 + dir * len)} ${f(y - len * 0.25)}`,
            fill: 'none',
            stroke: pal.accent,
            'stroke-width': sw * 1.2,
            'stroke-linecap': 'round',
          });
        }
      }
    }

    // tendrils curling out of the base corners
    for (const dir of [-1, 1] as const) {
      out += el('path', {
        d: spiral(w / 2 + dir * (half + w * 0.04), base - h * 0.05, w * 0.05, 1.6, Math.PI, dir),
        fill: 'none',
        stroke: line,
        'stroke-width': sw,
        'stroke-linecap': 'round',
      });
    }

    // inverted triangles in the gaps (drawn on both edges so tiles join)
    const gap = (w - 2 * half) / 2 + w * 0.14;
    for (const x of [0, w]) {
      out += el('polygon', {
        points: pts([
          [x - gap, apex],
          [x + gap, apex],
          [x, base * 0.62],
        ]),
        fill: 'none',
        stroke: line,
        'stroke-width': sw,
      });
      out += el('circle', { cx: x, cy: apex + (base * 0.62 - apex) * 0.38, r: sw * 2, fill: pal.accent });
    }

    // border band with small diamonds
    const by = base + (h - base) * 0.18;
    out += el('line', { x1: 0, y1: by, x2: w, y2: by, stroke: line, 'stroke-width': sw * 0.8 });
    out += el('line', { x1: 0, y1: h - sw, x2: w, y2: h - sw, stroke: line, 'stroke-width': sw * 0.8 });
    const n = 4;
    const my = (by + h) / 2;
    const d = Math.min(w / n / 2.8, (h - by) * 0.32);
    for (let i = 0; i < n; i++) {
      const x = (w * (i + 0.5)) / n;
      out += el('polygon', {
        points: pts([
          [x - d, my],
          [x, my - d],
          [x + d, my],
          [x, my + d],
        ]),
        fill: i % 2 ? pal.accent : line,
      });
    }

    return tile(`${uid}-pucuk-rebung`, w, h, pal.bg, out);
  },
};
