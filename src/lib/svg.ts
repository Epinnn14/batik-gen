/** Small helpers for writing compact, valid SVG markup. */

/** Round to 2 decimals to keep output small and stable. */
export const f = (n: number): string => String(Math.round(n * 100) / 100);

export function attrs(a: Record<string, string | number | undefined>): string {
  return Object.entries(a)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${typeof v === 'number' ? f(v) : escapeAttr(v as string)}"`)
    .join(' ');
}

export function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export const el = (tag: string, a: Record<string, string | number | undefined>, inner = ''): string =>
  inner ? `<${tag} ${attrs(a)}>${inner}</${tag}>` : `<${tag} ${attrs(a)}/>`;

/** Points on a regular ring, useful for petals and dots. */
export function ring(cx: number, cy: number, r: number, n: number, offset = 0): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = offset + (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}
