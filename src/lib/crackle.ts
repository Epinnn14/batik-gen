import type { Palette } from './palettes';
import type { Rng } from './rng';
import { f } from './svg';

/**
 * "Remukan" — the fine veins left when wax cracks and dye seeps in.
 * Random walks with gentle turns, drawn thin and translucent on top.
 */
export function crackle(rng: Rng, pal: Palette, width: number, height: number): string {
  const count = Math.round((width * height) / 26000);
  const step = Math.max(6, Math.min(width, height) / 70);
  let d = '';
  for (let i = 0; i < count; i++) {
    let x = rng.range(0, width);
    let y = rng.range(0, height);
    let a = rng.range(0, Math.PI * 2);
    d += `M${f(x)} ${f(y)}`;
    const len = rng.int(5, 16);
    for (let s = 0; s < len; s++) {
      a += rng.range(-0.7, 0.7);
      x += Math.cos(a) * step * rng.range(0.5, 1.4);
      y += Math.sin(a) * step * rng.range(0.5, 1.4);
      d += `L${f(x)} ${f(y)}`;
    }
  }
  return `<path d="${d}" fill="none" stroke="${pal.ink}" stroke-width="0.8" opacity="0.45" stroke-linejoin="round"/>`;
}
