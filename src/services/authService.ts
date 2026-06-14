import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../config/firebase';
import type { UserProfile, UserRole } from '../types';
import { stripUndefined } from '../utils/firestore';

const USERS = 'users';

function buildProfile(user: User, role: UserRole, phone?: string): UserProfile {
  const now = new Date().toISOString();
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? 'Usuário',
    role,
    notificationRadiusKm: 5,
    createdAt: now,
    updatedAt: now,
  };
  if (phone) profile.phone = phone;
  if (user.photoURL) profile.photoURL = user.photoURL;
  return profile;
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  phone?: string,
): Promise<UserProfile> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  const profile = buildProfile(credential.user, role, phone);
  await setDoc(doc(getFirebaseDb(), USERS, credential.user.uid), stripUndefined(profile));
  return profile;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return ensureUserProfile(credential.user);
}

export async function logoutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), USERS, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function ensureUserProfile(
  user: User,
  defaults?: { role?: UserRole; phone?: string },
): Promise<UserProfile> {
  const existing = await getUserProfile(user.uid);
  if (existing) return existing;

  const profile = buildProfile(user, defaults?.role ?? 'protector', defaults?.phone);
  await setDoc(doc(getFirebaseDb(), USERS, user.uid), stripUndefined(profile));
  return profile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>,
): Promise<void> {
  await updateDoc(
    doc(getFirebaseDb(), USERS, uid),
    stripUndefined({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export async function saveFcmToken(uid: string, token: string): Promise<void> {
  await updateUserProfile(uid, { fcmToken: token });
}
