import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';
import type { ChatMessage } from '../types';

const COLLECTION = 'messages';

export async function sendMessage(
  data: Omit<ChatMessage, 'id' | 'createdAt'>,
): Promise<void> {
  await addDoc(collection(getFirebaseDb(), COLLECTION), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export function subscribeMessages(
  occurrenceId: string,
  callback: (messages: ChatMessage[]) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    where('occurrenceId', '==', occurrenceId),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage));
  });
}
