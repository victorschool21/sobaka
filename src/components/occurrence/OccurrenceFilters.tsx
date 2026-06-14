import type { OccurrenceFilters, OccurrenceStatus, OccurrenceType, PetSpecies } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface OccurrenceFiltersBarProps {
  filters: OccurrenceFilters;
  onChange: (filters: OccurrenceFilters) => void;
}

const typeOptions = [
  { value: '', label: 'Todos os tipos' },
  { value: 'lost', label: 'Perdido' },
  { value: 'found', label: 'Encontrado' },
  { value: 'sighted', label: 'Avistado' },
  { value: 'temporary_care', label: 'Lar temporário' },
];

const statusOptions = [
  { value: 'active', label: 'Ativos' },
  { value: 'resolved', label: 'Resolvidos' },
  { value: 'archived', label: 'Arquivados' },
  { value: '', label: 'Todos' },
];

const speciesOptions = [
  { value: '', label: 'Todas espécies' },
  { value: 'dog', label: 'Cachorro' },
  { value: 'cat', label: 'Gato' },
  { value: 'other', label: 'Outro' },
];

export function OccurrenceFiltersBar({ filters, onChange }: OccurrenceFiltersBarProps) {
  return (
    <section className="filters-bar" aria-label="Filtros de ocorrências">
      <Input
        label="Buscar"
        name="query"
        placeholder="Nome, cor, raça..."
        value={filters.query ?? ''}
        onChange={(e) => onChange({ ...filters, query: e.target.value || undefined })}
      />
      <Select
        label="Tipo"
        name="type"
        value={filters.type ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            type: (e.target.value || undefined) as OccurrenceType | undefined,
          })
        }
        options={typeOptions}
      />
      <Select
        label="Status"
        name="status"
        value={filters.status ?? 'active'}
        onChange={(e) =>
          onChange({
            ...filters,
            status: (e.target.value || undefined) as OccurrenceStatus | undefined,
          })
        }
        options={statusOptions}
      />
      <Select
        label="Espécie"
        name="species"
        value={filters.species ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            species: (e.target.value || undefined) as PetSpecies | undefined,
          })
        }
        options={speciesOptions}
      />
    </section>
  );
}
