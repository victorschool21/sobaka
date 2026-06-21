import { useState } from 'react';
import { Search } from 'lucide-react';
import type { OccurrenceFilters, OccurrenceStatus, OccurrenceType, PetSpecies } from '../../types';
import { Button } from '../ui/Button';
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
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'resolved', label: 'Resolvidos' },
  { value: 'archived', label: 'Arquivados' },
];

const speciesOptions = [
  { value: '', label: 'Todas espécies' },
  { value: 'dog', label: 'Cachorro' },
  { value: 'cat', label: 'Gato' },
  { value: 'other', label: 'Outro' },
];

export function OccurrenceFiltersBar({ filters, onChange }: OccurrenceFiltersBarProps) {
  const [draft, setDraft] = useState<OccurrenceFilters>(filters);

  const handleApply = () => {
    onChange(draft);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <section className="filters-bar" aria-label="Filtros de ocorrências" onKeyDown={handleKeyDown}>
      <Input
        label="Buscar"
        name="query"
        placeholder="Nome, cor, raça..."
        value={draft.query ?? ''}
        onChange={(e) => setDraft({ ...draft, query: e.target.value || undefined })}
      />
      <Select
        label="Tipo"
        name="type"
        value={draft.type ?? ''}
        onChange={(e) =>
          setDraft({
            ...draft,
            type: (e.target.value || undefined) as OccurrenceType | undefined,
          })
        }
        options={typeOptions}
      />
      <Select
        label="Status"
        name="status"
        value={draft.status ?? ''}
        onChange={(e) =>
          setDraft({
            ...draft,
            status: (e.target.value || undefined) as OccurrenceStatus | undefined,
          })
        }
        options={statusOptions}
      />
      <Select
        label="Espécie"
        name="species"
        value={draft.species ?? ''}
        onChange={(e) =>
          setDraft({
            ...draft,
            species: (e.target.value || undefined) as PetSpecies | undefined,
          })
        }
        options={speciesOptions}
      />
      <div className="filters-bar-action">
        <Button type="button" onClick={handleApply}>
          <Search size={16} aria-hidden="true" /> Filtrar
        </Button>
      </div>
    </section>
  );
}
