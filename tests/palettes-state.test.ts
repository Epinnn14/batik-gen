import { describe, expect, it } from 'vitest';
import { contrast, mix, onBg, PALETTES } from '../src/lib/palettes';
import { DEFAULT_STATE, decodeState, encodeState, SCALE_MAX, SCALE_MIN } from '../src/lib/state';

describe('palettes', () => {
  it('mix interpolates and clamps', () => {
    expect(mix('#000000', '#ffffff', 0)).toBe('#000000');
    expect(mix('#000000', '#ffffff', 1)).toBe('#ffffff');
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mix('#000000', '#ffffff', 2)).toBe('#ffffff');
  });

  it('every palette keeps its highlight readable on the cloth', () => {
    for (const p of PALETTES) {
      expect(contrast(p.light, p.bg), p.id).toBeGreaterThanOrEqual(1.05);
      expect(contrast(p.light, p.ink), p.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('onBg always picks a line colour that reads on the cloth', () => {
    for (const p of PALETTES) expect(contrast(onBg(p), p.bg), p.id).toBeGreaterThanOrEqual(2);
  });

  it('palette ids are unique hex colours', () => {
    expect(new Set(PALETTES.map((p) => p.id)).size).toBe(PALETTES.length);
    for (const p of PALETTES) for (const c of [p.bg, p.ink, p.light, p.accent]) expect(c).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('url state', () => {
  it('round-trips', () => {
    const s = { motif: 'parang', palette: 'nila', seed: 'lorod-77', scale: 90, size: 'phone', crackle: false };
    expect(decodeState('#' + encodeState(s))).toEqual(s);
  });

  it('falls back on garbage', () => {
    expect(decodeState('#m=evil&p=<x>&z=abc&o=huge')).toEqual(DEFAULT_STATE);
    expect(decodeState('')).toEqual(DEFAULT_STATE);
  });

  it('clamps scale and trims seed', () => {
    expect(decodeState('z=5').scale).toBe(SCALE_MIN);
    expect(decodeState('z=99999').scale).toBe(SCALE_MAX);
    expect(decodeState('s=' + 'a'.repeat(200)).seed).toHaveLength(64);
  });
});
