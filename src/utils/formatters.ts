import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { OccurrenceStatus, OccurrenceType, PetSpecies, UserRole } from '../types';

const occurrenceTypeLabels: Record<OccurrenceType, string> = {
  lost: 'Perdido',
  found: 'Encontrado',
  sighted: 'Avistado',
  temporary_care: 'Lar temporário',
};

const occurrenceStatusLabels: Record<OccurrenceStatus, string> = {
  active: 'Ativo',
  resolved: 'Resolvido',
  archived: 'Arquivado',
};

const speciesLabels: Record<PetSpecies, string> = {
  dog: 'Cachorro',
  cat: 'Gato',
  other: 'Outro',
};

const roleLabels: Record<UserRole, string> = {
  tutor: 'Tutor',
  protector: 'Protetor / Solidário',
  temporary_home: 'Lar temporário',
  admin: 'Administrador',
};

export function formatOccurrenceType(type: OccurrenceType): string {
  return occurrenceTypeLabels[type];
}

export function formatOccurrenceStatus(status: OccurrenceStatus): string {
  return occurrenceStatusLabels[status];
}

export function formatSpecies(species: PetSpecies): string {
  return speciesLabels[species];
}

export function formatRole(role: UserRole): string {
  return roleLabels[role];
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelativeDate(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
}
