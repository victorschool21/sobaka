import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';
import type { Pet } from '../types';

const COLLECTION = 'pets';

export async function createPet(data: Omit<Pet, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function listUserPets(ownerId: string): Promise<Pet[]> {
  const q = query(collection(getFirebaseDb(), COLLECTION), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Pet);
}
