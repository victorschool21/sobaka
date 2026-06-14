import { describe, expect, it } from 'vitest';
import { haversineDistance, isWithinRadius } from '../utils/geolocation';

describe('geolocation utils', () => {
  const floripa = { latitude: -27.5954, longitude: -48.548 };
  const nearby = { latitude: -27.596, longitude: -48.549 };

  it('calculates distance between two points', () => {
    const distance = haversineDistance(floripa, nearby);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2);
  });

  it('checks if point is within radius', () => {
    expect(isWithinRadius(nearby, floripa, 5)).toBe(true);
    expect(isWithinRadius({ latitude: -22.9, longitude: -43.2 }, floripa, 5)).toBe(false);
  });
});
