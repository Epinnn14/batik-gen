import type { Palette } from '../palettes';
import type { Rng } from '../rng';

export interface MotifContext {
  rng: Rng;
  pal: Palette;
  /** size of one repeat in px */
  scale: number;
  width: number;
  height: number;
  /** unique prefix for <defs> ids so several SVGs can live on one page */
  uid: string;
}

export interface Motif {
  id: string;
  name: string;
  origin: string;
  meaning: string;
  /** returns the inner markup of the <svg> (defs + shapes) */
  render(ctx: MotifContext): string;
}
