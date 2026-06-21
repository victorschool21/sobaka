import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { listOccurrences } from '../services/occurrenceService';
import { OccurrenceCard } from '../components/occurrence/OccurrenceCard';
import { OccurrenceFiltersBar } from '../components/occurrence/OccurrenceFilters';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Occurrence, OccurrenceFilters } from '../types';

type State = { loading: boolean; occurrences: Occurrence[] };
type Action =
  | { type: 'loading' }
  | { type: 'loaded'; occurrences: Occurrence[] }
  | { type: 'error' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true };
    case 'loaded':
      return { loading: false, occurrences: action.occurrences };
    case 'error':
      return { loading: false, occurrences: [] };
    default:
      return state;
  }
}

export function OccurrencesPage() {
  const [filters, setFilters] = useReducer(
    (_: OccurrenceFilters, next: OccurrenceFilters) => next,
    {} as OccurrenceFilters,
  );
  const [{ loading, occurrences }, dispatch] = useReducer(reducer, {
    loading: true,
    occurrences: [],
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'loading' });
    listOccurrences(filters)
      .then((items) => {
        if (!cancelled) dispatch({ type: 'loaded', occurrences: items });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'error' });
      });
    return () => {
      cancelled = true;
    };
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
