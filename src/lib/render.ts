import { crackle } from './crackle';
import { getMotif } from './motifs';
import { getPalette } from './palettes';
import { Rng } from './rng';
import { f } from './svg';

export interface RenderOptions {
  motif: string;
  palette: string;
  seed: string;
  /** repeat size in px */
  scale: number;
  width: number;
  height: number;
  /** add wax-crack veins */
  crackle: boolean;
  /** id prefix for <defs>, must be unique per page */
  uid?: string;
}

/** Render a complete, standalone SVG document string. */
export function renderSvg(o: RenderOptions): string {
  const motif = getMotif(o.motif);
  const pal = getPalette(o.palette);
  const scale = Math.max(16, o.scale);
  const uid = o.uid ?? 'bg';
  const body = motif.render({
    rng: new Rng(`${o.seed}|${motif.id}`),
    pal,
    scale,
    width: o.width,
    height: o.height,
    uid,
  });
  // separate stream so toggling cracks never changes the motif itself
  const cracks = o.crackle ? crackle(new Rng(`${o.seed}|crackle`), pal, o.width, o.height) : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${f(o.width)}" height="${f(o.height)}" ` +
    `viewBox="0 0 ${f(o.width)} ${f(o.height)}" role="img" aria-label="${motif.name} batik, ${pal.name} palette">` +
    body + cracks + '</svg>'
  );
}
