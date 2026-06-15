import { useCallback, useEffect, useReducer } from 'react';
import { getAdminMetrics, listPendingReports, reviewReport } from '../services/adminService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Report } from '../types';
import { formatRelativeDate } from '../utils/formatters';

type Metrics = { totalOccurrences: number; resolvedOccurrences: number; reunionRate: number };
type State = { loading: boolean; metrics: Metrics | null; reports: Report[] };
type Action =
  | { type: 'loaded'; metrics: Metrics; reports: Report[] }
  | { type: 'error' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { loading: false, metrics: action.metrics, reports: action.reports };
    case 'error':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AdminPage() {
  const [state, dispatch] = useReducer(reducer, { loading: true, metrics: null, reports: [] });

  const load = useCallback(() => {
    Promise.all([getAdminMetrics(), listPendingReports()])
      .then(([m, r]) => dispatch({ type: 'loaded', metrics: m, reports: r }))
      .catch(() => dispatch({ type: 'error' }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async (id: string, status: 'reviewed' | 'dismissed') => {
    await reviewReport(id, status);
    load();
  };

  if (state.loading) return <LoadingSpinner label="Carregando painel admin..." />;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Administração</h1>
        <p className="muted">Moderação, denúncias e métricas de reencontro.</p>
      </header>

      <section className="stats-grid" aria-label="Métricas">
        <Card title="Total de ocorrências">
          <p className="stat-value">{state.metrics?.totalOccurrences ?? 0}</p>
        </Card>
        <Card title="Reencontros">
          <p className="stat-value">{state.metrics?.resolvedOccurrences ?? 0}</p>
        </Card>
        <Card title="Taxa de sucesso">
          <p className="stat-value">{state.metrics?.reunionRate ?? 0}%</p>
        </Card>
      </section>

      <section aria-labelledby="reports-title">
        <h2 id="reports-title">Denúncias pendentes</h2>
        {state.reports.length === 0 ? (
          <p className="muted">Nenhuma denúncia pendente.</p>
        ) : (
          <ul className="reports-list">
            {state.reports.map((report) => (
              <li key={report.id}>
                <Card title={`${report.targetType} · ${report.targetId}`}>
                  <p>{report.reason}</p>
                  <p className="muted small">{formatRelativeDate(report.createdAt)}</p>
                  <div className="header-actions">
                    <Button size="sm" onClick={() => handleReview(report.id, 'reviewed')}>
                      Revisado
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleReview(report.id, 'dismissed')}>
                      Descartar
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
