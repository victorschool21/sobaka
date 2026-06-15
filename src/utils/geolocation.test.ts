import { describe, expect, it } from 'vitest';
import { haversineDistance, isWithinRadius } from '../utils/geolocation';

describe('haversineDistance', () => {
  const floripa = { latitude: -27.5954, longitude: -48.548 };
  const nearby = { latitude: -27.596, longitude: -48.549 };
  const rio = { latitude: -22.9068, longitude: -43.1729 };

  it('retorna distância positiva entre dois pontos diferentes', () => {
    const d = haversineDistance(floripa, nearby);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(2);
  });

  it('retorna 0 para o mesmo ponto', () => {
    const d = haversineDistance(floripa, floripa);
    expect(d).toBeCloseTo(0, 5);
  });

  it('calcula distância longa entre cidades (Floripa–Rio ~700 km)', () => {
    const d = haversineDistance(floripa, rio);
    expect(d).toBeGreaterThan(600);
    expect(d).toBeLessThan(800);
  });

  it('é simétrica: dist(A,B) === dist(B,A)', () => {
    const ab = haversineDistance(floripa, rio);
    const ba = haversineDistance(rio, floripa);
    expect(ab).toBeCloseTo(ba, 8);
  });
});

describe('isWithinRadius', () => {
  const center = { latitude: -27.5954, longitude: -48.548 };
  const close = { latitude: -27.596, longitude: -48.549 }; // ~0.15 km
  const farAway = { latitude: -22.9068, longitude: -43.1729 }; // ~700 km

  it('retorna true para ponto dentro do raio', () => {
    expect(isWithinRadius(close, center, 5)).toBe(true);
  });

  it('retorna false para ponto fora do raio', () => {
    expect(isWithinRadius(farAway, center, 5)).toBe(false);
  });

  it('retorna true para ponto exatamente no centro (distância 0)', () => {
    expect(isWithinRadius(center, center, 0)).toBe(true);
  });

  it('retorna false quando raio é 0 e ponto é diferente', () => {
    expect(isWithinRadius(close, center, 0)).toBe(false);
  });

  it('aceita raio grande o suficiente para cobrir cidades distantes', () => {
    expect(isWithinRadius(farAway, center, 1000)).toBe(true);
  });
});
