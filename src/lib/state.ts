import { MOTIFS } from './motifs';
import { PALETTES } from './palettes';

export interface SizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const SIZES: readonly SizePreset[] = [
  { id: 'landscape', label: 'Desktop 1920×1080', width: 1920, height: 1080 },
  { id: 'square', label: 'Square 1080×1080', width: 1080, height: 1080 },
  { id: 'phone', label: 'Phone 1080×1920', width: 1080, height: 1920 },
  { id: 'banner', label: 'GitHub banner 1280×640', width: 1280, height: 640 },
];

export interface AppState {
  motif: string;
  palette: string;
  seed: string;
  scale: number;
  size: string;
  crackle: boolean;
}

export const DEFAULT_STATE: AppState = {
  motif: 'kawung',
  palette: 'sogan',
  seed: 'canting-1945',
  scale: 120,
  size: 'landscape',
  crackle: true,
};

export const SCALE_MIN = 40;
export const SCALE_MAX = 260;

export function encodeState(s: AppState): string {
  const p = new URLSearchParams({
    m: s.motif,
    p: s.palette,
    s: s.seed,
    z: String(s.scale),
    o: s.size,
    c: s.crackle ? '1' : '0',
  });
  return p.toString();
}

/** Parse a URL hash/query; anything invalid falls back to the default. */
export function decodeState(raw: string): AppState {
  const p = new URLSearchParams(raw.replace(/^[#?]/, ''));
  const pickId = (v: string | null, ids: string[], d: string) => (v && ids.includes(v) ? v : d);
  const z = Number(p.get('z'));
  const seed = (p.get('s') ?? '').trim().slice(0, 64);
  return {
    motif: pickId(p.get('m'), MOTIFS.map((m) => m.id), DEFAULT_STATE.motif),
    palette: pickId(p.get('p'), PALETTES.map((x) => x.id), DEFAULT_STATE.palette),
    seed: seed || DEFAULT_STATE.seed,
    scale: Number.isFinite(z) && z > 0 ? Math.min(SCALE_MAX, Math.max(SCALE_MIN, Math.round(z))) : DEFAULT_STATE.scale,
    size: pickId(p.get('o'), SIZES.map((x) => x.id), DEFAULT_STATE.size),
    crackle: p.has('c') ? p.get('c') === '1' : DEFAULT_STATE.crackle,
  };
}

export function getSize(id: string): SizePreset {
  return SIZES.find((s) => s.id === id) ?? SIZES[0];
}
