/** Island groups of Indonesia, west to east. Each has a folder of motifs next to this file. */
export const ISLANDS = [
  { id: 'sumatra', name: 'Sumatra' },
  { id: 'jawa', name: 'Jawa' },
  { id: 'kalimantan', name: 'Kalimantan' },
  { id: 'sulawesi', name: 'Sulawesi' },
  { id: 'bali-nusa-tenggara', name: 'Bali & Nusa Tenggara' },
  { id: 'maluku', name: 'Maluku' },
  { id: 'papua', name: 'Papua' },
] as const;

export type IslandId = (typeof ISLANDS)[number]['id'];
export type Island = (typeof ISLANDS)[number];

export function getIsland(id: string): Island | undefined {
  return ISLANDS.find((i) => i.id === id);
}
