import { describe, expect, it } from 'vitest';
import { hashString, randomSeed, Rng } from '../src/lib/rng';

describe('Rng', () => {
  it('is deterministic for the same seed', () => {
    const a = new Rng('kawung');
    const b = new Rng('kawung');
    expect(Array.from({ length: 20 }, () => a.next())).toEqual(Array.from({ length: 20 }, () => b.next()));
  });

  it('differs for different seeds', () => {
    expect(new Rng('a').next()).not.toEqual(new Rng('b').next());
  });

  it('keeps next() in [0,1) and int() inclusive', () => {
    const r = new Rng(42);
    const seen = new Set<number>();
    for (let i = 0; i < 5000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      seen.add(r.int(1, 3));
    }
    expect([...seen].sort()).toEqual([1, 2, 3]);
  });

  it('pick() throws on empty list', () => {
    expect(() => new Rng(1).pick([])).toThrow();
  });

  it('hashString is stable (FNV-1a)', () => {
    expect(hashString('')).toBe(0x811c9dc5);
    expect(hashString('a')).toBe(0xe40c292c);
  });

  it('randomSeed produces word-number seeds', () => {
    expect(randomSeed(() => 0)).toBe('kawung-1000');
    expect(randomSeed()).toMatch(/^[a-z]+-\d{4}$/);
  });
});
