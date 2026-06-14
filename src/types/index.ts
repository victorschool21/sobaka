export type UserRole = 'tutor' | 'protector' | 'temporary_home' | 'admin';

export type OccurrenceType = 'lost' | 'found' | 'sighted' | 'temporary_care';

export type OccurrenceStatus = 'active' | 'resolved' | 'archived';

export type PetSpecies = 'dog' | 'cat' | 'other';

export type PlaceType = 'pet_shop' | 'veterinarian';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  location?: GeoPoint;
  notificationRadiusKm: number;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  color?: string;
  description?: string;
  photoURLs: string[];
  microchipId?: string;
  createdAt: string;
}

export interface Occurrence {
  id: string;
  type: OccurrenceType;
  status: OccurrenceStatus;
  reporterId: string;
  reporterName: string;
  petId?: string;
  petName: string;
  species: PetSpecies;
  breed?: string;
  color?: string;
  description: string;
  photoURLs: string[];
  location: GeoPoint;
  address?: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  temporaryCareContactId?: string;
}

export interface ChatMessage {
  id: string;
  occurrenceId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  occurrenceId?: string;
  read: boolean;
  createdAt: string;
}

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  address: string;
  phone?: string;
  location: GeoPoint;
  verified: boolean;
}

export interface OccurrenceFilters {
  type?: OccurrenceType;
  status?: OccurrenceStatus;
  species?: PetSpecies;
  query?: string;
  nearLocation?: GeoPoint;
  radiusKm?: number;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'user' | 'occurrence' | 'message';
  targetId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}
