import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';
import { isFirebaseConfigured } from '../config/env';
import { ensureUserProfile, getUserProfile, logoutUser } from '../services/authService';
import type { UserProfile } from '../types';
import { AuthContext } from './AuthContextDef';

export function AuthProvider({ children }: { children: ReactNode }) {
  const firebaseReady = isFirebaseConfigured();
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Se o Firebase não está configurado, não há nada para aguardar
  const [loading, setLoading] = useState(firebaseReady);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const data = await getUserProfile(user.uid);
    if (data) setProfile(data);
  }, [user]);

  const hydrateProfile = useCallback((nextProfile: UserProfile) => {
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    if (!firebaseReady) return;

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await ensureUserProfile(firebaseUser);
          setProfile(data);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseReady]);

  const signOut = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      firebaseReady,
      setProfile: hydrateProfile,
      refreshProfile,
      signOut,
    }),
    [user, profile, loading, firebaseReady, hydrateProfile, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
