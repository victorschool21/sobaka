import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
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

/**
 * Carrega todas as mensagens de uma ocorrência (one-shot).
 */
export async function loadMessages(
  occurrenceId: string,
): Promise<ChatMessage[]> {
  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    where('occurrenceId', '==', occurrenceId),
  );
  const snap = await getDocs(q);
  const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage);
  // Ordenar client-side para evitar índice composto
  return messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * Escuta mensagens em tempo real de uma ocorrência.
 * Filtra e ordena client-side para evitar índice composto no Firestore.
 */
export function subscribeMessages(
  occurrenceId: string,
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  // Usa apenas where SEM orderBy para evitar exigir índice composto
  const q = query(
    collection(getFirebaseDb(), COLLECTION),
    where('occurrenceId', '==', occurrenceId),
  );
  return onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage);
      // Ordenar client-side
      messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      callback(messages);
    },
    (error) => {
      console.error('Erro ao escutar mensagens:', error);
      onError?.(error);
    },
  );
}
