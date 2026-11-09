import { onBg } from '../../palettes';
import { el, f, pts, ring, steppedDiamond, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Pintu Aceh — the low front door of the Rumoh Aceh house, framed by a stepped
 * gable; the same shape is famous as an Acehnese filigree brooch.
 */
export const pintuAceh: Motif = {
  id: 'pintu-aceh',
  name: 'Pintu Aceh',
  island: 'sumatra',
  region: 'Aceh',
  origin: 'Aceh — taken from the door of the traditional Rumoh Aceh house',
  meaning:
    'The door is low so every guest bows on entering: humility, and an open but respectful home.',
  palette: 'malam',
  render({ rng, pal, scale: t, uid }) {
    const c = t / 2;
    const sw = Math.max(1, t * 0.014);
    const steps = rng.int(3, 5);
    const arch = rng.pick(['round', 'pointed'] as const);
    const corner = rng.pick(['star', 'dot'] as const);
    const line = onBg(pal);
    const R = t * 0.43;
    let out = '';

    out += el('polygon', {
      points: pts(steppedDiamond(c, c, R, R, steps)),
      fill: pal.ink,
      stroke: pal.light,
      'stroke-width': sw,
    });
    out += el('polygon', {
      points: pts(steppedDiamond(c, c, R * 0.78, R * 0.78, steps)),
      fill: 'none',
      stroke: pal.accent,
      'stroke-width': sw * 0.8,
    });

    // the doorway
    const dw = R * 0.42;
    const top = c - R * 0.22;
    const bottom = c + R * 0.5;
    const x0 = c - dw / 2;
    const x1 = c + dw / 2;
    const head =
      arch === 'round'
        ? `A ${f(dw / 2)} ${f(dw / 2)} 0 0 1 ${f(x1)} ${f(top)}`
        : `Q ${f(c)} ${f(top - dw * 0.9)} ${f(x1)} ${f(top)}`;
    out += el('path', {
      d: `M ${f(x0)} ${f(bottom)} L ${f(x0)} ${f(top)} ${head} L ${f(x1)} ${f(bottom)} Z`,
      fill: pal.bg,
      stroke: pal.light,
      'stroke-width': sw,
    });
    out += el('line', { x1: c, y1: top - dw * 0.1, x2: c, y2: bottom, stroke: pal.accent, 'stroke-width': sw * 0.8 });
    out += el('circle', { cx: c + dw * 0.22, cy: (top + bottom) / 2 + dw * 0.2, r: sw * 1.4, fill: pal.accent });
    // threshold step
    out += el('rect', {
      x: x0 - dw * 0.2,
      y: bottom,
      width: dw * 1.4,
      height: R * 0.08,
      fill: pal.accent,
    });
    // small rhombus above the door
    const ry = c - R * 0.62;
    const rd = R * 0.08;
    out += el('polygon', {
      points: pts([
        [c - rd, ry],
        [c, ry - rd],
        [c + rd, ry],
        [c, ry + rd],
      ]),
      fill: pal.light,
    });

    // corners where four tiles meet
    for (const [x, y] of [
      [0, 0],
      [t, 0],
      [0, t],
      [t, t],
    ]) {
      if (corner === 'star') {
        const outer = ring(x, y, t * 0.06, 8, -Math.PI / 2);
        const inner = ring(x, y, t * 0.025, 8, -Math.PI / 2 + Math.PI / 8);
        out += el('polygon', { points: pts(outer.flatMap((p, i) => [p, inner[i]])), fill: pal.accent });
      } else {
        out += el('circle', { cx: x, cy: y, r: t * 0.05, fill: pal.accent, stroke: line, 'stroke-width': sw });
      }
    }
    for (const [x, y] of [
      [c, 0],
      [0, c],
      [t, c],
      [c, t],
    ]) {
      out += el('circle', { cx: x, cy: y, r: sw * 1.6, fill: line });
    }

    return tile(`${uid}-pintu-aceh`, t, t, pal.bg, out);
  },
};
