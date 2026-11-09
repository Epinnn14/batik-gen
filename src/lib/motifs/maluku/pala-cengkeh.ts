import { mix } from '../../palettes';
import { el, f, ring, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Pala & Cengkeh — the nutmeg of Banda and the clove of Ternate and Ambon, the
 * spices that brought the world to Maluku. A split nutmeg fruit shows the seed
 * wrapped in its red mace; clove sprigs sit on the tile corners.
 */
export const palaCengkeh: Motif = {
  id: 'pala-cengkeh',
  name: 'Pala & Cengkeh',
  island: 'maluku',
  region: 'Banda, Ambon & Ternate',
  origin: 'Maluku, the Spice Islands; a favourite motif of Ambon batik',
  meaning: 'Nutmeg and clove, the islands’ wealth: prosperity and pride in their history.',
  palette: 'laut',
  render({ rng, pal, scale: t, uid }) {
    const c = t / 2;
    const sw = Math.max(1, t * 0.012);
    const leaves = rng.int(2, 3);
    const buds = rng.int(3, 5);
    const leaf = mix(pal.bg, pal.light, 0.35);
    const seed = mix(pal.bg, '#000000', 0.45);
    let out = '';

    // a fan of leaves behind the fruit, on its upper-left
    for (let i = 0; i < leaves; i++) {
      const a = -125 + (i - (leaves - 1) / 2) * 38 + rng.range(-6, 6);
      const len = t * rng.range(0.36, 0.42);
      const wid = t * 0.1;
      out +=
        `<g transform="rotate(${f(a)} ${f(c)} ${f(c)})">` +
        el('path', {
          d: `M ${f(c)} ${f(c)} C ${f(c + len * 0.3)} ${f(c - wid)} ${f(c + len * 0.75)} ${f(c - wid * 0.8)} ${f(c + len)} ${f(c)} C ${f(c + len * 0.75)} ${f(c + wid * 0.8)} ${f(c + len * 0.3)} ${f(c + wid)} ${f(c)} ${f(c)} Z`,
          fill: leaf,
          stroke: pal.light,
          'stroke-width': sw * 0.7,
        }) +
        el('line', { x1: c, y1: c, x2: c + len * 0.95, y2: c, stroke: pal.light, 'stroke-width': sw * 0.5 }) +
        '</g>';
    }
    // stem
    out += el('path', {
      d: `M ${f(c)} ${f(c - t * 0.19)} q ${f(t * 0.02)} ${f(-t * 0.05)} ${f(t * 0.07)} ${f(-t * 0.08)}`,
      fill: 'none',
      stroke: pal.light,
      'stroke-width': sw * 1.4,
      'stroke-linecap': 'round',
    });

    // the split fruit
    const R = t * 0.2;
    out += el('circle', { cx: c, cy: c, r: R, fill: pal.accent, stroke: pal.light, 'stroke-width': sw });
    out += el('ellipse', { cx: c, cy: c, rx: R * 0.5, ry: R * 0.66, fill: seed });
    // mace: a red net over the seed
    let mace = '';
    for (let i = 0; i < 5; i++) {
      const x = c - R * 0.4 + (i * R * 0.8) / 4;
      const bend = rng.range(-0.18, 0.18) * R;
      mace += `M ${f(x)} ${f(c - R * 0.6)} Q ${f(x + bend)} ${f(c)} ${f(x - bend * 0.5)} ${f(c + R * 0.6)} `;
    }
    out += el('path', { d: mace, fill: 'none', stroke: pal.ink, 'stroke-width': sw * 1.5, 'stroke-linecap': 'round' });
    // the split in the husk
    out += el('path', {
      d: `M ${f(c)} ${f(c - R)} Q ${f(c + R * 0.62)} ${f(c)} ${f(c)} ${f(c + R)} Q ${f(c - R * 0.62)} ${f(c)} ${f(c)} ${f(c - R)}`,
      fill: 'none',
      stroke: pal.light,
      'stroke-width': sw,
    });

    // clove sprigs on the corners
    const sprig = (x: number, y: number, rot: number) => {
      let g = '';
      for (const [bx, by] of ring(x, y, t * 0.13, buds, rot)) {
        g += el('line', { x1: x, y1: y, x2: bx, y2: by, stroke: pal.ink, 'stroke-width': sw * 1.2 });
        g += el('circle', { cx: bx, cy: by, r: t * 0.022, fill: pal.ink, stroke: pal.accent, 'stroke-width': sw * 0.7 });
        g += el('circle', { cx: bx, cy: by, r: t * 0.008, fill: pal.accent });
      }
      return g + el('circle', { cx: x, cy: y, r: sw * 1.6, fill: pal.light });
    };
    const rot = rng.range(0, Math.PI);
    for (const [x, y] of [
      [0, 0],
      [t, 0],
      [0, t],
      [t, t],
    ]) {
      out += sprig(x, y, rot);
    }

    return tile(`${uid}-pala-cengkeh`, t, t, pal.bg, out);
  },
};
