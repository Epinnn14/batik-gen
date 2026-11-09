import { onBg } from '../../palettes';
import { el, f, pts, steppedDiamond, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Ikat Belah Ketupat — the stepped rhombus lattice with hooks seen across the
 * ikat of East Nusa Tenggara. The stair-stepped edges imitate how a woven
 * design is built thread by thread.
 */
export const ikat: Motif = {
  id: 'ikat',
  name: 'Ikat Belah Ketupat',
  island: 'bali-nusa-tenggara',
  region: 'East Nusa Tenggara (Sumba, Flores, Timor)',
  origin: 'Inspired by the rhombus-and-hook designs of East Nusa Tenggara ikat',
  meaning:
    'Linked rhombi with hooks hold on to each other: kinship and the bonds between clans.',
  palette: 'tanah',
  render({ rng, pal, scale: w, uid }) {
    const h = w * rng.range(1.2, 1.45);
    const steps = rng.int(5, 8);
    const nested = rng.int(3, 4);
    const sw = Math.max(1, w * 0.014);
    const line = onBg(pal);
    const fills = [pal.ink, pal.light, pal.accent, pal.ink, pal.light];
    let out = '';

    // nested rhombus in the middle, vertices touching the tile edges
    for (let k = 0; k < nested; k++) {
      const s = 1 - k / (nested + 0.5);
      out += el('polygon', {
        points: pts(steppedDiamond(w / 2, h / 2, (w / 2) * s, (h / 2) * s, Math.max(1, Math.round(steps * s)))),
        fill: fills[k],
      });
    }
    // the gaps between rhombi form another rhombus around every tile corner
    for (const [x, y] of [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ]) {
      out += el('polygon', {
        points: pts(steppedDiamond(x, y, w * 0.18, h * 0.18, 2)),
        fill: pal.accent,
      });
      out += el('polygon', {
        points: pts(steppedDiamond(x, y, w * 0.07, h * 0.07, 1)),
        fill: line,
      });
    }

    // hooks (kait) on the left and right vertices, where neighbouring rhombi touch
    const hk = w * 0.08;
    for (const [x, dir] of [
      [0, 1],
      [w, -1],
    ] as const) {
      for (const sy of [-1, 1]) {
        out += el('path', {
          d: `M ${f(x)} ${f(h / 2)} l ${f(dir * hk)} ${f(sy * hk * 0.6)} l ${f(-dir * hk * 0.45)} ${f(sy * hk * 0.45)}`,
          fill: 'none',
          stroke: line,
          'stroke-width': sw * 1.4,
          'stroke-linecap': 'square',
        });
      }
    }

    return tile(`${uid}-ikat`, w, h, pal.bg, out);
  },
};
