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

/**
 * Wrap tile markup in a <pattern> and fill the whole canvas with it.
 * `body` is drawn on top of a background rect of the tile size.
 */
export function tile(
  id: string,
  w: number,
  h: number,
  bg: string,
  body: string,
  patternTransform?: string,
): string {
  const t = patternTransform ? ` patternTransform="${patternTransform}"` : '';
  return (
    `<defs><pattern id="${id}" width="${f(w)}" height="${f(h)}" patternUnits="userSpaceOnUse"${t}>` +
    el('rect', { width: w, height: h, fill: bg }) +
    body +
    `</pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/>`
  );
}

/** Path data of an Archimedean spiral from the centre outwards. */
export function spiral(
  cx: number,
  cy: number,
  r: number,
  turns: number,
  start = 0,
  dir: 1 | -1 = 1,
): string {
  const steps = Math.max(12, Math.round(turns * 24));
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const a = start + dir * k * turns * Math.PI * 2;
    const rr = r * k;
    d += `${i ? ' L' : 'M'} ${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
  }
  return d;
}

/** Points string for a polygon. */
export const pts = (list: readonly (readonly [number, number])[]): string =>
  list.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');

/** Outline of a diamond built from horizontal steps, like a stepped gable. */
export function steppedDiamond(
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  steps: number,
): [number, number][] {
  const bars = steps * 2 + 1;
  const bh = (2 * hh) / bars;
  const right: [number, number][] = [];
  for (let b = 0; b < bars; b++) {
    const y0 = cy - hh + b * bh;
    const half = hw * ((steps + 1 - Math.abs(b - steps)) / (steps + 1));
    right.push([cx + half, y0], [cx + half, y0 + bh]);
  }
  const left = right.map(([x, y]) => [2 * cx - x, y] as [number, number]).reverse();
  return [...right, ...left];
}
