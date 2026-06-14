import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { getFirebaseDb, getFirebaseMessaging } from '../config/firebase';
import { env } from '../config/env';
import type { AppNotification, GeoPoint } from '../types';
import { saveFcmToken } from './authService';
import { haversineDistance } from '../utils/geolocation';

const NOTIFICATIONS = 'notifications';
const USERS = 'users';

export async function createNotification(
  data: Omit<AppNotification, 'id' | 'read' | 'createdAt'>,
): Promise<void> {
  await addDoc(collection(getFirebaseDb(), NOTIFICATIONS), {
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function createRegionalNotifications(params: {
  occurrenceId: string;
  location: GeoPoint;
  title: string;
  body: string;
  excludeUserId?: string;
}): Promise<void> {
  const usersSnap = await getDocs(collection(getFirebaseDb(), USERS));
  const tasks = usersSnap.docs.map(async (userDoc) => {
    const user = userDoc.data() as { uid: string; location?: GeoPoint; notificationRadiusKm?: number };
    if (user.uid === params.excludeUserId) return;
    if (!user.location) return;

    const radius = user.notificationRadiusKm ?? 5;
    const distance = haversineDistance(params.location, user.location);
    if (distance > radius) return;

    await createNotification({
      userId: user.uid,
      title: params.title,
      body: params.body,
      occurrenceId: params.occurrenceId,
    });
  });
  await Promise.all(tasks);
}

export async function listUserNotifications(userId: string): Promise<AppNotification[]> {
  const q = query(
    collection(getFirebaseDb(), NOTIFICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AppNotification);
}

export function subscribeNotifications(
  userId: string,
  callback: (items: AppNotification[]) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), NOTIFICATIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AppNotification));
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), NOTIFICATIONS, id), { read: true });
}

export async function requestPushPermission(userId: string): Promise<string | null> {
  if (!('Notification' in window)) return null;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging || !env.firebase.vapidKey) return null;

  const token = await getToken(messaging, { vapidKey: env.firebase.vapidKey });
  if (token) {
    await saveFcmToken(userId, token);
  }
  return token;
}
