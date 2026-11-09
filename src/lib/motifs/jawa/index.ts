import type { Motif } from '../types';
import { ceplok } from './ceplok';
import { kawung } from './kawung';
import { megaMendung } from './megamendung';
import { parang } from './parang';
import { truntum } from './truntum';

/** Jawa — the court batik of Yogyakarta & Surakarta and the coastal batik of Cirebon. */
export const JAWA: readonly Motif[] = [kawung, parang, truntum, ceplok, megaMendung];
