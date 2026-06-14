function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não configurada. Veja .env.example`);
  }
  return value;
}

export const env = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY ?? '',
  },
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN ?? '',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    env.firebase.apiKey &&
      env.firebase.projectId &&
      env.firebase.authDomain,
  );
}

export function isMapboxConfigured(): boolean {
  return Boolean(env.mapboxToken);
}

export function getMapboxToken(): string {
  return requireEnv('VITE_MAPBOX_TOKEN');
}
