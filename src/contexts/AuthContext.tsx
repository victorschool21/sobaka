import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';
import { isFirebaseConfigured } from '../config/env';
import { ensureUserProfile, getUserProfile, logoutUser } from '../services/authService';
import type { UserProfile } from '../types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
  setProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const data = await getUserProfile(user.uid);
    if (data) setProfile(data);
  }, [user]);

  const hydrateProfile = useCallback((nextProfile: UserProfile) => {
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
