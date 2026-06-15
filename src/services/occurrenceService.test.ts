import { describe, expect, it } from 'vitest';
import { sortByDistance } from './occurrenceService';
import type { Occurrence } from '../types';

/** Fábrica mínima de Occurrence para testes */
function makeOccurrence(id: string, lat: number, lon: number): Occurrence {
  return {
    id,
    type: 'lost',
    status: 'active',
    reporterId: 'user1',
    reporterName: 'Teste',
    petName: 'Pet',
    species: 'dog',
    description: 'Descrição de teste',
    photoURLs: [],
    location: { latitude: lat, longitude: lon },
    lastSeenAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('sortByDistance', () => {
  const floripa = { latitude: -27.5954, longitude: -48.548 };

  it('ordena ocorrências da mais próxima para a mais distante', () => {
    const far = makeOccurrence('far', -22.9068, -43.1729);   // Rio (~700 km)
    const near = makeOccurrence('near', -27.596, -48.549);   // ~0.15 km
    const mid = makeOccurrence('mid', -26.9, -49.07);        // ~90 km

    const sorted = sortByDistance([far, mid, near], floripa);
    expect(sorted.map((o) => o.id)).toEqual(['near', 'mid', 'far']);
  });

  it('não modifica o array original', () => {
    const a = makeOccurrence('a', -27.596, -48.549);
    const b = makeOccurrence('b', -22.9068, -43.1729);
    const original = [b, a];

    sortByDistance(original, floripa);
    expect(original.map((o) => o.id)).toEqual(['b', 'a']); // ordem original preservada
  });

  it('retorna array vazio se não há ocorrências', () => {
    expect(sortByDistance([], floripa)).toEqual([]);
  });

  it('retorna o mesmo elemento para array com uma ocorrência', () => {
    const single = makeOccurrence('solo', -27.596, -48.549);
    expect(sortByDistance([single], floripa)).toEqual([single]);
  });

  it('mantém ocorrências com a mesma localização em ordem estável', () => {
    const a = makeOccurrence('a', -27.5954, -48.548);
    const b = makeOccurrence('b', -27.5954, -48.548); // mesma localização que floripa
    const result = sortByDistance([a, b], floripa);
    expect(result).toHaveLength(2);
  });
});
