import { onBg } from '../../palettes';
import { el, f, pts, spiral, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Batang Garing — the Dayak Ngaju tree of life: a trunk standing in a jar
 * (the underworld), branches curling up in pairs, a spear point on top (the upper world).
 */
export const batangGaring: Motif = {
  id: 'batang-garing',
  name: 'Batang Garing',
  island: 'kalimantan',
  region: 'Central Kalimantan (Dayak Ngaju)',
  origin: 'Dayak Ngaju of Central Kalimantan, from the Kaharingan creation story',
  meaning:
    'The tree of life joins the upper and lower worlds; its paired branches are balance between people and nature.',
  palette: 'sogan',
  render({ rng, pal, scale: w, uid }) {
    const h = w * 1.4;
    const cx = w / 2;
    const sw = Math.max(1, w * 0.022);
    const levels = rng.int(3, 4);
    const curl = rng.range(1.1, 1.7);
    const fruit = rng.chance(0.6);
    const line = onBg(pal);
    let out = '';

    const top = h * 0.16;
    const foot = h * 0.82;
    out += el('line', {
      x1: cx,
      y1: foot,
      x2: cx,
      y2: top,
      stroke: pal.ink,
      'stroke-width': sw * 1.6,
      'stroke-linecap': 'round',
    });

    for (let l = 0; l < levels; l++) {
      const k = l / Math.max(1, levels - 1);
      const y = foot - h * 0.12 - k * (foot - top - h * 0.22);
      const bw = w * (0.4 - k * 0.2);
      const bh = h * (0.12 - k * 0.03);
      for (const dir of [-1, 1] as const) {
        const ex = cx + dir * bw;
        const ey = y - bh;
        const r = w * (0.06 - k * 0.02);
        const spin = dir > 0 ? -1 : 1; // the spiral ends exactly at the branch tip
        out += el('path', {
          d: `M ${f(cx)} ${f(y)} C ${f(cx + dir * bw * 0.35)} ${f(y)} ${f(ex)} ${f(y - bh * 0.2)} ${f(ex)} ${f(ey)}`,
          fill: 'none',
          stroke: pal.ink,
          'stroke-width': sw,
          'stroke-linecap': 'round',
        });
        // the hook at the end curls back towards the trunk
        out += el('path', {
          d: spiral(ex - dir * r, ey, r, curl, (dir > 0 ? 0 : Math.PI) + dir * curl * Math.PI * 2, spin),
          fill: 'none',
          stroke: pal.ink,
          'stroke-width': sw * 0.8,
          'stroke-linecap': 'round',
        });
        // a leaf on the branch
        const lx = cx + dir * bw * 0.55;
        const ly = y - bh * 0.25;
        out += `<g transform="rotate(${f(dir * -35)} ${f(lx)} ${f(ly)})">${el('ellipse', {
          cx: lx,
          cy: ly - w * 0.04,
          rx: w * 0.02,
          ry: w * 0.045,
          fill: pal.accent,
        })}</g>`;
        if (fruit) out += el('circle', { cx: ex, cy: ey + r * 1.6, r: sw * 1.1, fill: pal.accent });
      }
    }

    // spear point (upper world)
    out += el('polygon', {
      points: pts([
        [cx, h * 0.03],
        [cx + w * 0.05, top - h * 0.03],
        [cx, top + h * 0.01],
        [cx - w * 0.05, top - h * 0.03],
      ]),
      fill: pal.accent,
      stroke: pal.ink,
      'stroke-width': sw * 0.6,
    });
    // jar (balanga) at the foot (lower world)
    const jw = w * 0.16;
    out += el('path', {
      d: `M ${f(cx - jw * 0.55)} ${f(foot)} C ${f(cx - jw * 1.2)} ${f(foot + h * 0.05)} ${f(cx - jw)} ${f(h * 0.95)} ${f(cx - jw * 0.6)} ${f(h * 0.96)} L ${f(cx + jw * 0.6)} ${f(h * 0.96)} C ${f(cx + jw)} ${f(h * 0.95)} ${f(cx + jw * 1.2)} ${f(foot + h * 0.05)} ${f(cx + jw * 0.55)} ${f(foot)} Z`,
      fill: pal.ink,
      stroke: pal.light,
      'stroke-width': sw * 0.6,
    });
    out += el('line', {
      x1: cx - jw * 0.85,
      y1: foot + h * 0.06,
      x2: cx + jw * 0.85,
      y2: foot + h * 0.06,
      stroke: pal.accent,
      'stroke-width': sw * 0.7,
    });

    // dotted ground (cecek) along the tile edges
    for (let i = 0; i < 6; i++) {
      out += el('circle', { cx: 0, cy: (h * (i + 0.5)) / 6, r: sw * 0.7, fill: line });
      out += el('circle', { cx: w, cy: (h * (i + 0.5)) / 6, r: sw * 0.7, fill: line });
    }

    return tile(`${uid}-batang-garing`, w, h, pal.bg, out);
  },
};
