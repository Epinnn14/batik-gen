/** Deterministic PRNG so every seed always produces the same cloth. */

/** FNV-1a 32-bit hash: turns any seed string into a 32-bit integer. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export class Rng {
  private state: number;

  constructor(seed: string | number) {
    this.state = typeof seed === 'number' ? seed >>> 0 : hashString(seed);
  }

  /** mulberry32 — returns a float in [0, 1). */
  next(): number {
    let t = (this.state = (this.state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('pick() on empty list');
    return items[Math.floor(this.next() * items.length)];
  }

  chance(p: number): boolean {
    return this.next() < p;
  }
}

const WORDS = [
  'kawung', 'lilin', 'canting', 'malam', 'sogan', 'nila', 'soga', 'mori',
  'cecek', 'isen', 'klowong', 'tembok', 'wedel', 'lorod', 'pesisir', 'keraton',
];

/** Human-friendly random seed, e.g. "canting-4821". */
export function randomSeed(source: () => number = Math.random): string {
  const word = WORDS[Math.floor(source() * WORDS.length)];
  return `${word}-${Math.floor(source() * 9000 + 1000)}`;
}
