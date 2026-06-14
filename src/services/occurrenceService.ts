import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';
import type { Occurrence, OccurrenceFilters, OccurrenceStatus } from '../types';
import { haversineDistance, isWithinRadius } from '../utils/geolocation';
import { stripUndefined } from '../utils/firestore';
import { createRegionalNotifications } from './notificationService';

const COLLECTION = 'occurrences';

function applyClientFilters(
  items: Occurrence[],
  filters: OccurrenceFilters,
): Occurrence[] {
  return items.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.species && item.species !== filters.species) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${item.petName} ${item.description} ${item.breed ?? ''} ${item.color ?? ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.nearLocation && filters.radiusKm) {
      if (!isWithinRadius(item.location, filters.nearLocation, filters.radiusKm)) {
        return false;
      }
    }
    return true;
  });
}

export async function createOccurrence(
  data: Omit<Occurrence, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await addDoc(
    collection(getFirebaseDb(), COLLECTION),
    stripUndefined({
      ...data,
      status: 'active' as OccurrenceStatus,
      createdAt: now,
      updatedAt: now,
    }),
  );

  await createRegionalNotifications({
    occurrenceId: docRef.id,
    location: data.location,
    title: `Novo alerta: ${data.petName}`,
    body: `${data.type === 'lost' ? 'Pet perdido' : 'Novo avistamento'} na região`,
    excludeUserId: data.reporterId,
  });

  return docRef.id;
}

export async function getOccurrence(id: string): Promise<Occurrence | null> {
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Occurrence;
}

export async function listOccurrences(
  filters: OccurrenceFilters = {},
): Promise<Occurrence[]> {
  const constraints = [];
  if (filters.status) constraints.push(where('status', '==', filters.status));
  if (filters.type) constraints.push(where('type', '==', filters.type));
  if (filters.species) constraints.push(where('species', '==', filters.species));

  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    ...constraints,
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Occurrence);
  return applyClientFilters(items, filters);
}

export function subscribeOccurrences(
  filters: OccurrenceFilters,
  callback: (items: Occurrence[]) => void,
): Unsubscribe {
  const constraints = [];
  if (filters.status) constraints.push(where('status', '==', filters.status));

  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    ...constraints,
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Occurrence);
    callback(applyClientFilters(items, filters));
  });
}

export async function updateOccurrence(
  id: string,
  data: Partial<Occurrence>,
  userId: string,
): Promise<void> {
  const existing = await getOccurrence(id);
  if (!existing) throw new Error('Ocorrência não encontrada.');
  if (existing.reporterId !== userId && existing.temporaryCareContactId !== userId) {
    throw new Error('Sem permissão para atualizar esta ocorrência.');
  }

  const payload: Partial<Occurrence> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.status === 'resolved') {
    payload.resolvedAt = new Date().toISOString();
  }
  await updateDoc(doc(getFirebaseDb(), COLLECTION, id), stripUndefined(payload));
}

export function sortByDistance(
  items: Occurrence[],
  from: { latitude: number; longitude: number },
): Occurrence[] {
  return [...items].sort(
    (a, b) =>
      haversineDistance(from, a.location) - haversineDistance(from, b.location),
  );
}
