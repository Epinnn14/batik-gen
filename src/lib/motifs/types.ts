import type { Palette } from '../palettes';
import type { Rng } from '../rng';
import type { IslandId } from './islands';

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
  /** island group the motif comes from; motifs live in a folder of the same name */
  island: IslandId;
  /** province / city, shown under the motif name */
  region: string;
  origin: string;
  meaning: string;
  /** palette that suits the motif best, offered as a one-click suggestion */
  palette?: string;
  /** returns the inner markup of the <svg> (defs + shapes) */
  render(ctx: MotifContext): string;
}
