import { ceplok } from './ceplok';
import { kawung } from './kawung';
import { megaMendung } from './megamendung';
import { parang } from './parang';
import { truntum } from './truntum';
import type { Motif } from './types';

export type { Motif, MotifContext } from './types';

export const MOTIFS: readonly Motif[] = [kawung, parang, truntum, ceplok, megaMendung];

export function getMotif(id: string): Motif {
  return MOTIFS.find((m) => m.id === id) ?? MOTIFS[0];
}
