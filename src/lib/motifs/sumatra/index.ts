import type { Motif } from '../types';
import { besurek } from './besurek';
import { pintuAceh } from './pintu-aceh';
import { pucukRebung } from './pucuk-rebung';

/** Sumatra — Aceh in the north to Bengkulu in the south. */
export const SUMATRA: readonly Motif[] = [pintuAceh, pucukRebung, besurek];
