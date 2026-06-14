import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';
import type { Place, PlaceType } from '../types';
import { isWithinRadius } from '../utils/geolocation';

const COLLECTION = 'places';

export async function listPlaces(type?: PlaceType): Promise<Place[]> {
  const constraints = type ? [where('type', '==', type)] : [];
  const q = query(collection(getFirebaseDb(), COLLECTION), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Place);
}

export async function listNearbyPlaces(
  location: { latitude: number; longitude: number },
  radiusKm = 10,
  type?: PlaceType,
): Promise<Place[]> {
  const places = await listPlaces(type);
  return places.filter((p) => isWithinRadius(p.location, location, radiusKm));
}

export const SEED_PLACES: Omit<Place, 'id'>[] = [
  {
    name: 'Pet Shop Amigo Fiel',
    type: 'pet_shop',
    address: 'Rua das Palmeiras, 120 - Centro, Florianópolis/SC',
    phone: '(48) 3222-1000',
    location: { latitude: -27.5954, longitude: -48.5480 },
    verified: true,
  },
  {
    name: 'Clínica Veterinária Sobaka Care',
    type: 'veterinarian',
    address: 'Av. Beira Mar Norte, 500 - Trindade, Florianópolis/SC',
    phone: '(48) 3333-2000',
    location: { latitude: -27.5864, longitude: -48.5206 },
    verified: true,
  },
  {
    name: 'Pet Center Ilha',
    type: 'pet_shop',
    address: 'Rua Deputado Antônio Edu Vieira, 800 - Pantanal, Florianópolis/SC',
    phone: '(48) 3444-3000',
    location: { latitude: -27.6012, longitude: -48.5123 },
    verified: true,
  },
  {
    name: 'Hospital Veterinário 24h Floripa',
    type: 'veterinarian',
    address: 'Rua Lauro Linhares, 2000 - Trindade, Florianópolis/SC',
    phone: '(48) 3555-4000',
    location: { latitude: -27.5890, longitude: -48.5150 },
    verified: true,
  },
];
