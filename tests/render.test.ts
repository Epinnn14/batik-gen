import { describe, expect, it } from 'vitest';
import { MOTIFS } from '../src/lib/motifs';
import { PALETTES } from '../src/lib/palettes';
import { renderSvg, type RenderOptions } from '../src/lib/render';

const base: RenderOptions = {
  motif: 'kawung', palette: 'sogan', seed: 'test', scale: 100, width: 400, height: 300, crackle: false,
};

/** Very small well-formedness check: every opened tag is closed in order. */
function balanced(svg: string): boolean {
  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    const [, close, tag, self] = m;
    if (self) continue;
    if (close) {
      if (stack.pop() !== tag) return false;
    } else stack.push(tag);
  }
  return stack.length === 0;
}

describe('renderSvg', () => {
  for (const motif of MOTIFS) {
    describe(motif.name, () => {
      it('produces a well-formed SVG of the requested size', () => {
        const svg = renderSvg({ ...base, motif: motif.id });
        expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"')).toBe(true);
        expect(svg.endsWith('</svg>')).toBe(true);
        expect(balanced(svg)).toBe(true);
        expect(svg).not.toMatch(/NaN|undefined|Infinity/);
      });

      it('is deterministic per seed and varies across seeds', () => {
        const a = renderSvg({ ...base, motif: motif.id, seed: 'x1' });
        expect(renderSvg({ ...base, motif: motif.id, seed: 'x1' })).toBe(a);
        const variants = new Set(['x2', 'x3', 'x4', 'x5'].map((seed) => renderSvg({ ...base, motif: motif.id, seed })));
        variants.add(a);
        expect(variants.size).toBeGreaterThan(1);
      });

      it('uses the palette colours', () => {
        for (const pal of PALETTES) {
          const svg = renderSvg({ ...base, motif: motif.id, palette: pal.id });
          expect(svg).toContain(pal.bg);
        }
      });
    });
  }

  it('crackle adds an overlay without changing the motif', () => {
    const plain = renderSvg(base);
    const cracked = renderSvg({ ...base, crackle: true });
    expect(cracked.length).toBeGreaterThan(plain.length);
    expect(cracked.startsWith(plain.slice(0, -'</svg>'.length))).toBe(true);
  });

  it('namespaces pattern ids with uid', () => {
    expect(renderSvg({ ...base, uid: 'thumb3' })).toContain('id="thumb3-kawung"');
  });

  it('falls back to defaults for unknown motif/palette and clamps tiny scale', () => {
    const svg = renderSvg({ ...base, motif: 'nope', palette: 'nope', scale: 1 });
    expect(svg).toContain('Kawung batik, Sogan palette');
    expect(svg).toContain('width="16"');
  });
});
