import { onBg } from '../palettes';
import { el, f } from '../svg';
import type { Motif } from './types';

/**
 * Parang — diagonal "knife" bands with wavy edges and curls, separated by
 * small rhombus "mlinjon" ornaments. Drawn horizontally in the tile, then the
 * whole pattern is rotated 45°.
 */
export const parang: Motif = {
  id: 'parang',
  name: 'Parang',
  origin: 'Mataram kingdom, Central Java — once reserved for royalty',
  meaning: 'Waves that never stop hitting the rock: perseverance and continuous struggle.',
  render({ rng, pal, scale, uid }) {
    const w = scale;
    const h = scale * rng.range(0.7, 0.9);
    const bandH = h * rng.range(0.52, 0.62);
    const y0 = (h - bandH) / 2;
    const amp = h * rng.range(0.06, 0.12);
    const lines = rng.int(1, 3);
    const curlDir = rng.chance(0.5) ? 1 : -1;
    const sw = Math.max(1, scale * 0.016);

    // Smooth wavy edge whose start/end tangents match, so tiles join seamlessly.
    const wave = (y: number, a: number) =>
      `C ${f(w / 3)} ${f(y - a)} ${f((2 * w) / 3)} ${f(y + a)} ${f(w)} ${f(y)}`;
    const waveBack = (y: number, a: number) =>
      `C ${f((2 * w) / 3)} ${f(y + a)} ${f(w / 3)} ${f(y - a)} 0 ${f(y)}`;

    const band = `M 0 ${f(y0)} ${wave(y0, amp)} L ${f(w)} ${f(y0 + bandH)} ${waveBack(y0 + bandH, amp)} Z`;
    let out = el('path', { d: band, fill: pal.ink });

    // Parallel highlight lines following the edges (the "klowong" outline).
    for (let i = 1; i <= lines; i++) {
      const off = i * sw * 2.2;
      out += el('path', { d: `M 0 ${f(y0 + off)} ${wave(y0 + off, amp)}`, fill: 'none', stroke: pal.light, 'stroke-width': sw * 0.7 });
      out += el('path', { d: `M 0 ${f(y0 + bandH - off)} ${wave(y0 + bandH - off, amp)}`, fill: 'none', stroke: pal.light, 'stroke-width': sw * 0.7 });
    }

    // Curl ("mata gareng" swirl) in the middle of the band.
    const cx = w / 2;
    const cy = y0 + bandH / 2;
    const r = bandH * 0.28;
    out += el('path', {
      d: `M ${f(cx - r)} ${f(cy)} a ${f(r)} ${f(r)} 0 1 ${curlDir > 0 ? 1 : 0} ${f(2 * r)} 0 a ${f(r * 0.6)} ${f(r * 0.6)} 0 1 ${curlDir > 0 ? 1 : 0} ${f(-r * 1.2)} 0 a ${f(r * 0.3)} ${f(r * 0.3)} 0 1 ${curlDir > 0 ? 1 : 0} ${f(r * 0.5)} 0`,
      fill: 'none', stroke: pal.light, 'stroke-width': sw * 1.3, 'stroke-linecap': 'round',
    });
    out += el('circle', { cx: cx - r * 1.6, cy, r: sw * 1.4, fill: pal.accent });
    out += el('circle', { cx: cx + r * 1.6, cy, r: sw * 1.4, fill: pal.accent });

    // Mlinjon rhombus in the gap between bands.
    const gy = h - (h - bandH) / 4;
    const mw = w * 0.09;
    const mh = (h - bandH) * 0.22;
    for (const mx of [0, w]) {
      out += el('polygon', {
        points: `${f(mx - mw)},${f(gy)} ${f(mx)},${f(gy - mh)} ${f(mx + mw)},${f(gy)} ${f(mx)},${f(gy + mh)}`,
        fill: pal.accent, stroke: onBg(pal), 'stroke-width': sw * 0.6,
      });
      out += el('polygon', {
        points: `${f(mx - mw)},${f(gy - h)} ${f(mx)},${f(gy - h - mh)} ${f(mx + mw)},${f(gy - h)} ${f(mx)},${f(gy - h + mh)}`,
        fill: pal.accent, stroke: onBg(pal), 'stroke-width': sw * 0.6,
      });
    }

    const id = `${uid}-parang`;
    return (
      `<defs><pattern id="${id}" width="${f(w)}" height="${f(h)}" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">` +
      el('rect', { width: w, height: h, fill: pal.bg }) + out +
      `</pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/>`
    );
  },
};
