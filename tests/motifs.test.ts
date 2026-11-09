import { describe, expect, it } from 'vitest';
import { getMotif, ISLANDS, MOTIFS, MOTIFS_BY_ISLAND } from '../src/lib/motifs';
import { PALETTES } from '../src/lib/palettes';
import { spiral, steppedDiamond } from '../src/lib/svg';

describe('motifs per island', () => {
  it('every island has at least one motif, and each motif sits in its own island folder', () => {
    for (const island of ISLANDS) {
      const list = MOTIFS_BY_ISLAND[island.id];
      expect(list.length, island.id).toBeGreaterThan(0);
      for (const m of list) expect(m.island, m.id).toBe(island.id);
    }
  });

  it('lists motifs west to east with unique kebab-case ids', () => {
    const order = MOTIFS.map((m) => ISLANDS.findIndex((i) => i.id === m.island));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(MOTIFS.map((m) => m.id)).size).toBe(MOTIFS.length);
    for (const m of MOTIFS) expect(m.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    expect(MOTIFS.length).toBe(
      ISLANDS.reduce((n, i) => n + MOTIFS_BY_ISLAND[i.id].length, 0),
    );
  });

  it('has the story fields filled in and suggests palettes that exist', () => {
    const ids = PALETTES.map((p) => p.id);
    for (const m of MOTIFS) {
      for (const field of [m.name, m.region, m.origin, m.meaning]) expect(field.length).toBeGreaterThan(3);
      if (m.palette) expect(ids, m.id).toContain(m.palette);
    }
  });

  it('falls back to Kawung for unknown ids', () => {
    expect(getMotif('nope').id).toBe('kawung');
    expect(getMotif('tifa').island).toBe('papua');
  });
});

describe('svg helpers', () => {
  it('steppedDiamond is symmetric and spans the requested box', () => {
    const p = steppedDiamond(50, 40, 30, 20, 3);
    const xs = p.map(([x]) => x);
    const ys = p.map(([, y]) => y);
    expect(Math.max(...xs)).toBeCloseTo(80);
    expect(Math.min(...xs)).toBeCloseTo(20);
    expect(Math.min(...ys)).toBeCloseTo(20);
    expect(Math.max(...ys)).toBeCloseTo(60);
    for (const [x, y] of p) expect(p.some(([x2, y2]) => Math.abs(x2 - (100 - x)) < 1e-9 && y2 === y)).toBe(true);
  });

  it('spiral starts at the centre and ends on the radius at the requested angle', () => {
    const d = spiral(10, 10, 5, 2, Math.PI / 2);
    const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    expect(nums.slice(0, 2)).toEqual([10, 10]);
    const [ex, ey] = nums.slice(-2);
    expect(ex).toBeCloseTo(10, 1);
    expect(ey).toBeCloseTo(15, 1);
  });
});
