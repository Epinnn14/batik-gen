import { mix } from '../../palettes';
import { el, f, tile } from '../../svg';
import type { Motif } from '../types';

/**
 * Poleng — the black-and-white chequered cloth wrapped around shrines, statues
 * and trees in Bali. "Sudhamala" adds grey squares where the colours meet.
 */
export const poleng: Motif = {
  id: 'poleng',
  name: 'Poleng',
  island: 'bali-nusa-tenggara',
  region: 'Bali',
  origin: 'Bali — worn by temple guardians and wrapped around sacred trees and statues',
  meaning:
    'Rwa Bhineda: good and evil, light and dark always exist side by side and must be kept in balance.',
  palette: 'poleng',
  render({ rng, pal, scale: t, uid }) {
    const cell = t / 2;
    const variant = rng.pick(['rwa-bhineda', 'sudhamala'] as const);
    const weave = rng.int(6, 10);
    const dark = pal.ink;
    const light = pal.light;
    let out = '';

    out += el('rect', { x: 0, y: 0, width: cell, height: cell, fill: dark });
    out += el('rect', { x: cell, y: 0, width: cell, height: cell, fill: light });
    out += el('rect', { x: 0, y: cell, width: cell, height: cell, fill: light });
    out += el('rect', { x: cell, y: cell, width: cell, height: cell, fill: dark });

    if (variant === 'sudhamala') {
      const g = cell * 0.5;
      const grey = mix(dark, light, 0.5);
      for (const x of [0, cell, t]) {
        for (const y of [0, cell, t]) {
          out += el('rect', { x: x - g / 2, y: y - g / 2, width: g, height: g, fill: grey });
        }
      }
    }

    // woven texture: faint threads in both directions
    let threads = '';
    for (let i = 0; i < weave * 2; i++) {
      const p = ((i + 0.5) * t) / (weave * 2);
      threads += `M0 ${f(p)}H${f(t)}M${f(p)} 0V${f(t)}`;
    }
    out += el('path', {
      d: threads,
      stroke: pal.bg,
      'stroke-width': Math.max(0.6, t * 0.006),
      opacity: 0.35,
    });

    return tile(`${uid}-poleng`, t, t, pal.bg, out);
  },
};
