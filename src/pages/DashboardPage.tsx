import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { listOccurrences } from '../services/occurrenceService';
import { OccurrenceCard } from '../components/occurrence/OccurrenceCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Occurrence } from '../types';
import { formatRole } from '../utils/formatters';

export function DashboardPage() {
  const { profile } = useAuth();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOccurrences({ status: 'active' })
      .then(setOccurrences)
      .finally(() => setLoading(false));
  }, []);

  const recent = occurrences.slice(0, 4);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Olá, {profile?.displayName}</h1>
          <p className="muted">
            {profile ? formatRole(profile.role) : ''} · Acompanhe alertas ativos na sua região
          </p>
        </div>
        <Link to="/ocorrencias/nova">
          <Button>
            <Plus size={16} aria-hidden="true" /> Nova ocorrência
          </Button>
        </Link>
      </header>

      <section className="stats-grid" aria-label="Resumo">
        <Card title="Alertas ativos">
          <p className="stat-value">{occurrences.length}</p>
        </Card>
        <Card title="Raio de notificação">
          <p className="stat-value">{profile?.notificationRadiusKm ?? 5} km</p>
        </Card>
        <Card title="Ação rápida">
          <Link to="/mapa">
            <Button variant="secondary" className="full-width">
              <TrendingUp size={16} aria-hidden="true" /> Ver mapa
            </Button>
          </Link>
        </Card>
      </section>

      <section aria-labelledby="recent-title">
        <h2 id="recent-title">Ocorrências recentes</h2>
        {loading ? (
          <LoadingSpinner />
        ) : recent.length === 0 ? (
          <p className="muted">Nenhuma ocorrência ativa no momento.</p>
        ) : (
          <div className="occurrence-grid">
            {recent.map((occ) => (
              <OccurrenceCard key={occ.id} occurrence={occ} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
