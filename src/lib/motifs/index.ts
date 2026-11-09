import { BALI_NUSA_TENGGARA } from './bali-nusa-tenggara';
import { ISLANDS, type IslandId } from './islands';
import { JAWA } from './jawa';
import { KALIMANTAN } from './kalimantan';
import { MALUKU } from './maluku';
import { PAPUA } from './papua';
import { SULAWESI } from './sulawesi';
import { SUMATRA } from './sumatra';
import type { Motif } from './types';

export type { Motif, MotifContext } from './types';
export { getIsland, ISLANDS, type Island, type IslandId } from './islands';

/** Motifs per island, one folder each. */
export const MOTIFS_BY_ISLAND: Readonly<Record<IslandId, readonly Motif[]>> = {
  sumatra: SUMATRA,
  jawa: JAWA,
  kalimantan: KALIMANTAN,
  sulawesi: SULAWESI,
  'bali-nusa-tenggara': BALI_NUSA_TENGGARA,
  maluku: MALUKU,
  papua: PAPUA,
};

/** Every motif, west to east. */
export const MOTIFS: readonly Motif[] = ISLANDS.flatMap((i) => MOTIFS_BY_ISLAND[i.id]);

/** Default motif (and fallback for unknown ids): Kawung. */
export const DEFAULT_MOTIF = 'kawung';

export function getMotif(id: string): Motif {
  return (
    MOTIFS.find((m) => m.id === id) ?? (MOTIFS.find((m) => m.id === DEFAULT_MOTIF) as Motif)
  );
}
