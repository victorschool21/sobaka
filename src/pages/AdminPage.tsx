import { useEffect, useState } from 'react';
import { getAdminMetrics, listPendingReports, reviewReport } from '../services/adminService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Report } from '../types';
import { formatRelativeDate } from '../utils/formatters';

export function AdminPage() {
  const [metrics, setMetrics] = useState<{ totalOccurrences: number; resolvedOccurrences: number; reunionRate: number } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [m, r] = await Promise.all([getAdminMetrics(), listPendingReports()]);
    setMetrics(m);
    setReports(r);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleReview = async (id: string, status: 'reviewed' | 'dismissed') => {
    await reviewReport(id, status);
    await load();
  };

  if (loading) return <LoadingSpinner label="Carregando painel admin..." />;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Administração</h1>
        <p className="muted">Moderação, denúncias e métricas de reencontro.</p>
      </header>

      <section className="stats-grid" aria-label="Métricas">
        <Card title="Total de ocorrências">
          <p className="stat-value">{metrics?.totalOccurrences ?? 0}</p>
        </Card>
        <Card title="Reencontros">
          <p className="stat-value">{metrics?.resolvedOccurrences ?? 0}</p>
        </Card>
        <Card title="Taxa de sucesso">
          <p className="stat-value">{metrics?.reunionRate ?? 0}%</p>
        </Card>
      </section>

      <section aria-labelledby="reports-title">
        <h2 id="reports-title">Denúncias pendentes</h2>
        {reports.length === 0 ? (
          <p className="muted">Nenhuma denúncia pendente.</p>
        ) : (
          <ul className="reports-list">
            {reports.map((report) => (
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
