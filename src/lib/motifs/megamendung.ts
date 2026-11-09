import { mix } from '../palettes';
import { el, f } from '../svg';
import type { Motif } from './types';

/**
 * Mega Mendung — layered clouds whose colour steps from dark to light,
 * traditionally seven gradations. Not a repeating tile: clouds are scattered
 * over the whole canvas.
 */
export const megaMendung: Motif = {
  id: 'megamendung',
  name: 'Mega Mendung',
  origin: 'Trusmi, Cirebon (West Java), with Chinese cloud-motif influence',
  meaning: 'Overcast clouds that bring rain: patience and a cool head under pressure.',
  render({ rng, pal, scale, width, height }) {
    const layers = rng.int(5, 7);
    const size = scale * 2.1;
    const cols = Math.ceil(width / size) + 1;
    const rows = Math.ceil(height / (size * 0.75)) + 1;
    const clouds: { cx: number; cy: number; rx: number; ry: number; lobes: number; rot: number }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rng.chance(0.38)) continue;
        clouds.push({
          cx: c * size + (r % 2 ? size / 2 : 0) + rng.range(-0.2, 0.2) * size,
          cy: r * size * 0.75 + rng.range(-0.15, 0.15) * size,
          rx: size * rng.range(0.45, 0.7),
          ry: size * rng.range(0.28, 0.4),
          lobes: rng.int(6, 10),
          rot: rng.range(0, Math.PI * 2),
        });
      }
    }
    clouds.sort((a, b) => a.cy - b.cy);

    // scalloped outline: points on an ellipse joined by outward arcs
    const cloudPath = (cx: number, cy: number, rx: number, ry: number, lobes: number, rot: number) => {
      const pts = Array.from({ length: lobes }, (_, i) => {
        const a = rot + (i / lobes) * Math.PI * 2;
        return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
      });
      let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
      for (let i = 1; i <= lobes; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i % lobes];
        const chord = Math.hypot(x1 - x0, y1 - y0);
        d += ` A ${f(chord * 0.58)} ${f(chord * 0.58)} 0 0 1 ${f(x1)} ${f(y1)}`;
      }
      return d + ' Z';
    };

    let out = el('rect', { width: '100%', height: '100%', fill: pal.bg });
    const sw = Math.max(1, scale * 0.012);
    for (const cl of clouds) {
      for (let k = 0; k < layers; k++) {
        const s = 1 - (k / layers) * 0.86;
        out += el('path', {
          d: cloudPath(cl.cx, cl.cy, cl.rx * s, cl.ry * s, cl.lobes, cl.rot),
          fill: mix(pal.ink, pal.light, k / (layers - 1)),
          stroke: k === 0 ? pal.ink : 'none',
          'stroke-width': k === 0 ? sw : undefined,
        });
      }
    }
    return out;
  },
};
