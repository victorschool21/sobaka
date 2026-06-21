import type { GeoPoint } from '../types';

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function isWithinRadius(
  point: GeoPoint,
  center: GeoPoint,
  radiusKm: number,
): boolean {
  return haversineDistance(point, center) <= radiusKm;
}

export async function getCurrentPosition(): Promise<GeoPoint> {
  if (!navigator.geolocation) {
    throw new Error('Geolocalização não suportada neste dispositivo.');
  }

  const getPosition = (highAccuracy: boolean, timeout: number): Promise<GeoPoint> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => reject(new Error(err.message)),
        { enableHighAccuracy: highAccuracy, timeout, maximumAge: 60000 },
      );
    });

  try {
    // Tenta GPS de alta precisão primeiro (5s)
    return await getPosition(true, 5000);
  } catch {
    // Fallback: precisão baixa via IP/WiFi (10s)
    return await getPosition(false, 10000);
  }
}
