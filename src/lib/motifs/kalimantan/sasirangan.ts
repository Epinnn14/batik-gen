import { mix } from '../../palettes';
import { el, f } from '../../svg';
import type { Motif } from '../types';

/**
 * Sasirangan — Banjar cloth made by stitching ("menyirang") lines and pulling
 * them tight before dyeing. Vertical bands with "gigi haruan" (snakehead-fish
 * teeth) zigzag edges; a turbulence filter makes the dye bleed like the real thing.
 * Drawn over the whole canvas because the bleed would show seams on a tile.
 */
export const sasirangan: Motif = {
  id: 'sasirangan',
  name: 'Sasirangan',
  island: 'kalimantan',
  region: 'Banjarmasin, South Kalimantan',
  origin: 'Banjar people of South Kalimantan; once a healing cloth (kain pamintan)',
  meaning:
    'Made on request for healing and protection; the zigzag "gigi haruan" stands for sharpness and strength.',
  palette: 'sasirangan',
  render({ rng, pal, scale, width, height, uid }) {
    const band = scale * rng.range(0.55, 0.8);
    const amp = band * rng.range(0.12, 0.2);
    const period = scale * rng.range(0.22, 0.32);
    const colours = [pal.ink, pal.accent, mix(pal.ink, pal.light, 0.45)];
    const stitches = rng.chance(0.7);
    const flowers = rng.chance(0.5);
    const sw = Math.max(1, scale * 0.012);
    const cols = Math.ceil(width / (band * 2)) + 1;
    const fid = `${uid}-sasirangan-bleed`;

    const zigzag = (x: number, phase: number) => {
      const p: string[] = [];
      for (let y = -period, k = 0; y <= height + period; y += period / 2, k++) {
        p.push(`${f(x + ((k + phase) % 2 ? amp : -amp))},${f(y)}`);
      }
      return p;
    };

    let shapes = '';
    let details = '';
    for (let i = 0; i < cols; i++) {
      const x0 = i * band * 2 - band * 0.5;
      const x1 = x0 + band;
      const left = zigzag(x0, 0);
      const right = zigzag(x1, 1).reverse();
      shapes += el('polygon', {
        points: [...left, ...right].join(' '),
        fill: colours[i % colours.length],
      });
      const mid = (x0 + x1) / 2;
      if (stitches) {
        details += el('line', {
          x1: mid,
          y1: 0,
          x2: mid,
          y2: height,
          stroke: pal.light,
          'stroke-width': sw,
          'stroke-dasharray': `${f(sw * 4)} ${f(sw * 3)}`,
          opacity: 0.85,
        });
      }
      if (flowers) {
        for (let y = period * rng.range(0.5, 1.5); y < height; y += period * rng.range(2.5, 4)) {
          details += el('circle', {
            cx: mid,
            cy: y,
            r: band * 0.18,
            fill: 'none',
            stroke: pal.light,
            'stroke-width': sw,
          });
          details += el('circle', { cx: mid, cy: y, r: band * 0.06, fill: pal.light });
        }
      }
    }

    return (
      `<defs><filter id="${fid}" x="-5%" y="-5%" width="110%" height="110%">` +
      `<feTurbulence type="fractalNoise" baseFrequency="${f(4 / scale)}" numOctaves="2" seed="${rng.int(1, 999)}"/>` +
      `<feDisplacementMap in="SourceGraphic" scale="${f(band * 0.12)}"/>` +
      `<feGaussianBlur stdDeviation="${f(sw * 0.8)}"/></filter></defs>` +
      el('rect', { width: '100%', height: '100%', fill: pal.bg }) +
      `<g filter="url(#${fid})">${shapes}</g>` +
      details
    );
  },
};
