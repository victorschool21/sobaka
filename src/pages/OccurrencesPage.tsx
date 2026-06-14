import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { listOccurrences } from '../services/occurrenceService';
import { OccurrenceCard } from '../components/occurrence/OccurrenceCard';
import { OccurrenceFiltersBar } from '../components/occurrence/OccurrenceFilters';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Occurrence, OccurrenceFilters } from '../types';
import { getCurrentPosition } from '../utils/geolocation';
import { sortByDistance } from '../services/occurrenceService';

export function OccurrencesPage() {
  const [filters, setFilters] = useState<OccurrenceFilters>({ status: 'active' });
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listOccurrences(filters)
      .then(async (items) => {
        try {
          const pos = await getCurrentPosition();
          return sortByDistance(items, pos);
        } catch {
          return items;
        }
      })
      .then(setOccurrences)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Ocorrências</h1>
          <p className="muted">Busque e filtre alertas de pets perdidos e encontrados.</p>
        </div>
        <Link to="/ocorrencias/nova">
          <Button>
            <Plus size={16} aria-hidden="true" /> Reportar
          </Button>
        </Link>
      </header>

      <OccurrenceFiltersBar filters={filters} onChange={setFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : occurrences.length === 0 ? (
        <p className="muted">Nenhuma ocorrência encontrada com os filtros selecionados.</p>
      ) : (
        <div className="occurrence-grid">
          {occurrences.map((occ) => (
            <OccurrenceCard key={occ.id} occurrence={occ} />
          ))}
        </div>
      )}
    </div>
  );
}
