import { createContext } from 'react';
import type { UserProfile } from '../types';
import type { User } from 'firebase/auth';

export interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
  setProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
