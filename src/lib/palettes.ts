export interface Palette {
  id: string;
  name: string;
  note: string;
  /** cloth / background */
  bg: string;
  /** main dye of the motif */
  ink: string;
  /** outlines and highlights (the colour the wax kept) */
  light: string;
  /** small details: dots, centres */
  accent: string;
}

export const PALETTES: readonly Palette[] = [
  { id: 'sogan', name: 'Sogan', note: 'Brown soga dye of the Solo & Yogyakarta courts',
    bg: '#2a1a10', ink: '#8a5a2b', light: '#ecd9b0', accent: '#c9822f' },
  { id: 'nila', name: 'Nila', note: 'Deep indigo from the tarum plant',
    bg: '#0e1a33', ink: '#2c4f8c', light: '#e6ecf5', accent: '#8fb3e8' },
  { id: 'pesisir', name: 'Pesisir', note: 'Bright coastal batik of Pekalongan',
    bg: '#f3e6c8', ink: '#a32626', light: '#fff8e8', accent: '#2f6f5e' },
  { id: 'cirebon', name: 'Cirebon', note: 'Sky blues of Trusmi, home of Mega Mendung',
    bg: '#e9f2fb', ink: '#0b2e59', light: '#f7fbff', accent: '#3d7cc9' },
  { id: 'lasem', name: 'Lasem', note: '"Abang getih pitik" — chicken-blood red of Lasem',
    bg: '#5e0f12', ink: '#b3262b', light: '#f5e3c3', accent: '#1f1a17' },
  { id: 'malam', name: 'Malam', note: 'Night cloth with golden prada leaf',
    bg: '#121212', ink: '#3a332a', light: '#e0c27a', accent: '#b8862b' },
];

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Linear mix of two hex colours, t in [0,1]. */
export function mix(a: string, b: string, t: number): string {
  const ca = toRgb(a);
  const cb = toRgb(b);
  const out = ca.map((v, i) => Math.round(v + (cb[i] - v) * Math.min(1, Math.max(0, t))));
  return '#' + out.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Colour for lines drawn directly on the cloth: light if it reads, else the dye. */
export function onBg(p: Palette): string {
  return contrast(p.light, p.bg) >= 2 ? p.light : p.ink;
}
