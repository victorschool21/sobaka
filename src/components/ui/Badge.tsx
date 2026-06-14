import type { OccurrenceStatus, OccurrenceType } from '../../types';

const typeColors: Record<OccurrenceType, string> = {
  lost: 'badge-lost',
  found: 'badge-found',
  sighted: 'badge-sighted',
  temporary_care: 'badge-care',
};

const statusColors: Record<OccurrenceStatus, string> = {
  active: 'badge-active',
  resolved: 'badge-resolved',
  archived: 'badge-archived',
};

export function Badge({
  label,
  kind,
}: {
  label: string;
  kind: OccurrenceType | OccurrenceStatus | 'default';
}) {
  const cls =
    kind in typeColors
      ? typeColors[kind as OccurrenceType]
      : kind in statusColors
        ? statusColors[kind as OccurrenceStatus]
        : 'badge-default';
  return <span className={`badge ${cls}`}>{label}</span>;
}
