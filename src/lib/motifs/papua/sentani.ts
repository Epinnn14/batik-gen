import { onBg } from '../../palettes';
import { el, f, spiral, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Sentani — the "fouw" double spiral painted on bark cloth (kapuo) and carved
 * on canoes around Lake Sentani. Rows of linked S-spirals, every other row shifted.
 */
export const sentani: Motif = {
  id: 'sentani',
  name: 'Sentani',
  island: 'papua',
  region: 'Lake Sentani, Jayapura',
  origin: 'Sentani people of Lake Sentani, from bark-cloth painting and carving',
  meaning:
    'Fouw, the linked spiral: unity and togetherness, and life that keeps turning like the lake water.',
  palette: 'tanah',
  render({ rng, pal, scale: w, uid }) {
    const h = w * rng.range(0.5, 0.62);
    const sw = Math.max(1.2, w * 0.03);
    const turns = rng.range(1.6, 2.4);
    const bands = rng.chance(0.6);
    const line = onBg(pal);
    let out = '';

    const r = h * 0.36;
    const fouw = (ox: number, oy: number) => {
      const cy = oy + h / 2;
      const x1 = ox + w * 0.27;
      const x2 = ox + w * 0.73;
      const tau = Math.PI * 2;
      // left spiral ends at its top, right spiral at its bottom; an S joins them
      const left = spiral(x1, cy, r, turns, -Math.PI / 2 - turns * tau, 1);
      const right = spiral(x2, cy, r, turns, Math.PI / 2 - turns * tau, 1);
      const join = `M ${f(x1)} ${f(cy - r)} C ${f(x1 + r * 1.3)} ${f(cy - r)} ${f(x2 - r * 1.3)} ${f(cy + r)} ${f(x2)} ${f(cy + r)}`;
      const stroke = { fill: 'none', 'stroke-width': sw, 'stroke-linecap': 'round' as const };
      return (
        el('path', { d: `${left} ${join} ${right}`, stroke: pal.ink, ...stroke }) +
        el('circle', { cx: ox + w * 0.5, cy: oy + h * 0.14, r: sw * 0.75, fill: pal.accent }) +
        el('circle', { cx: ox + w * 0.5, cy: oy + h * 0.86, r: sw * 0.75, fill: pal.accent }) +
        el('circle', { cx: ox, cy: cy, r: sw * 0.9, fill: line })
      );
    };

    out += fouw(0, 0);
    // second row, shifted by half a repeat (drawn twice so it wraps)
    out += fouw(-w / 2, h) + fouw(w / 2, h);
    if (bands) {
      for (const y of [0, h, 2 * h]) {
        out += el('line', { x1: 0, y1: y, x2: w, y2: y, stroke: pal.accent, 'stroke-width': sw * 0.35 });
      }
    }

    return tile(`${uid}-sentani`, w, h * 2, pal.bg, out);
  },
};
