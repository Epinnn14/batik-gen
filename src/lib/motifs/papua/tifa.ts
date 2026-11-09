import { onBg } from '../../palettes';
import { el, f, pts, spiral, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Tifa — the hourglass drum of Papua and Maluku, carved from one log with a
 * lizard-skin head and a curled handle on one side. Drums stand in a half-drop
 * grid with small triangles between them.
 */
export const tifa: Motif = {
  id: 'tifa',
  name: 'Tifa',
  island: 'papua',
  region: 'Papua',
  origin: 'Papua — the tifa drum that leads dances and ceremonies',
  meaning: 'The voice of the tifa calls people together: celebration, unity and identity.',
  palette: 'tanah',
  render({ rng, pal, scale, uid }) {
    const w = scale * 1.1;
    const h = scale * 1.3;
    const cw = w / 2;
    const sw = Math.max(1, scale * 0.014);
    const rings = rng.int(2, 4);
    const zig = rng.int(5, 8);
    const handleSide = rng.chance(0.5) ? 1 : -1;
    const line = onBg(pal);
    let out = '';

    const drum = (cx: number, cy: number) => {
      const dh = h * 0.74;
      const y0 = cy - dh / 2;
      const y1 = cy + dh / 2;
      const tw = cw * 0.3;
      const ww = cw * 0.17;
      const bw = cw * 0.26;
      let g = el('path', {
        d:
          `M ${f(cx - tw)} ${f(y0)} C ${f(cx - tw)} ${f(cy - dh * 0.15)} ${f(cx - ww)} ${f(cy - dh * 0.1)} ${f(cx - ww)} ${f(cy)} ` +
          `C ${f(cx - ww)} ${f(cy + dh * 0.15)} ${f(cx - bw)} ${f(cy + dh * 0.2)} ${f(cx - bw)} ${f(y1)} ` +
          `L ${f(cx + bw)} ${f(y1)} C ${f(cx + bw)} ${f(cy + dh * 0.2)} ${f(cx + ww)} ${f(cy + dh * 0.15)} ${f(cx + ww)} ${f(cy)} ` +
          `C ${f(cx + ww)} ${f(cy - dh * 0.1)} ${f(cx + tw)} ${f(cy - dh * 0.15)} ${f(cx + tw)} ${f(y0)} Z`,
        fill: pal.ink,
        stroke: pal.light,
        'stroke-width': sw,
      });
      // drum head
      g += el('ellipse', { cx, cy: y0, rx: tw, ry: tw * 0.22, fill: pal.light, stroke: pal.accent, 'stroke-width': sw });
      // lacing rings near the head and a zigzag band on the body
      for (let i = 1; i <= rings; i++) {
        const y = y0 + dh * 0.04 * i + dh * 0.02;
        g += el('line', { x1: cx - tw * 0.92, y1: y, x2: cx + tw * 0.92, y2: y, stroke: pal.accent, 'stroke-width': sw * 0.8 });
      }
      const zy = cy + dh * 0.22;
      const zw = bw * 0.85;
      const zz: [number, number][] = Array.from({ length: zig * 2 + 1 }, (_, i) => [
        cx - zw + (i * 2 * zw) / (zig * 2),
        zy + (i % 2 ? -1 : 1) * dh * 0.03,
      ]);
      g += el('polyline', { points: pts(zz), fill: 'none', stroke: pal.light, 'stroke-width': sw * 0.8 });
      // carved handle with a curl at its top
      const hx = cx + handleSide * (ww + cw * 0.12);
      g += el('path', {
        d: `M ${f(cx + handleSide * tw * 0.8)} ${f(y0 + dh * 0.22)} Q ${f(hx + handleSide * cw * 0.06)} ${f(cy)} ${f(cx + handleSide * bw * 0.85)} ${f(cy + dh * 0.3)}`,
        fill: 'none',
        stroke: pal.accent,
        'stroke-width': sw * 1.6,
        'stroke-linecap': 'round',
      });
      g += el('path', {
        d: spiral(hx, cy - dh * 0.05, cw * 0.06, 1.5),
        fill: 'none',
        stroke: pal.accent,
        'stroke-width': sw,
      });
      return g;
    };

    // half-drop: one column centred, the other shifted by half a repeat
    out += drum(cw / 2, h / 2);
    out += drum(cw * 1.5, 0) + drum(cw * 1.5, h);

    // small triangles between the drums
    const tr = cw * 0.08;
    for (const [x, y] of [
      [cw / 2, 0],
      [cw / 2, h],
      [cw * 1.5, h / 2],
    ]) {
      out += el('polygon', {
        points: pts([
          [x - tr, y + tr * 0.6],
          [x, y - tr * 0.9],
          [x + tr, y + tr * 0.6],
        ]),
        fill: line,
      });
    }

    return tile(`${uid}-tifa`, w, h, pal.bg, out);
  },
};
