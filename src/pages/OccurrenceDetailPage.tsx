import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Flag } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { getOccurrence, updateOccurrence } from '../services/occurrenceService';
import { createReport } from '../services/adminService';
import { ChatPanel } from '../components/chat/ChatPanel';
import { OccurrenceMap } from '../components/map/OccurrenceMap';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Occurrence } from '../types';
import {
  formatDate,
  formatOccurrenceStatus,
  formatOccurrenceType,
  formatSpecies,
} from '../utils/formatters';

export function OccurrenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOccurrence(id)
      .then(setOccurrence)
      .finally(() => setLoading(false));
  }, [id]);

  const canEdit =
    profile &&
    occurrence &&
    (occurrence.reporterId === profile.uid ||
      occurrence.temporaryCareContactId === profile.uid ||
      profile.role === 'admin');

  const handleResolve = async () => {
    if (!occurrence || !profile) return;
    setUpdating(true);
    try {
      await updateOccurrence(occurrence.id, { status: 'resolved' }, profile.uid);
      setOccurrence({ ...occurrence, status: 'resolved' });
      setMessage('Ocorrência marcada como resolvida. Reencontro registrado!');
    } finally {
      setUpdating(false);
    }
  };

  const handleReport = async () => {
    if (!occurrence || !profile) return;
    const reason = window.prompt('Motivo da denúncia:');
    if (!reason) return;
    await createReport({
      reporterId: profile.uid,
      targetType: 'occurrence',
      targetId: occurrence.id,
      reason,
    });
    setMessage('Denúncia enviada à moderação.');
  };

  if (loading) return <LoadingSpinner label="Carregando ocorrência..." />;
  if (!occurrence) {
    return (
      <div className="page">
        <p role="alert">Ocorrência não encontrada.</p>
        <Button variant="secondary" onClick={() => navigate('/ocorrencias')}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{occurrence.petName}</h1>
          <p className="muted">
            {formatSpecies(occurrence.species)}
            {occurrence.breed ? ` · ${occurrence.breed}` : ''}
            {occurrence.color ? ` · ${occurrence.color}` : ''}
          </p>
          <div className="badge-group">
            <Badge label={formatOccurrenceType(occurrence.type)} kind={occurrence.type} />
            <Badge label={formatOccurrenceStatus(occurrence.status)} kind={occurrence.status} />
          </div>
        </div>
        <div className="header-actions">
          {canEdit && occurrence.status === 'active' && (
            <Button onClick={handleResolve} loading={updating}>
              <CheckCircle size={16} aria-hidden="true" /> Marcar resolvido
            </Button>
          )}
          <Button variant="ghost" onClick={handleReport} aria-label="Denunciar ocorrência">
            <Flag size={16} aria-hidden="true" />
          </Button>
        </div>
      </header>

      {message && (
        <p className="success-banner" role="status">
          {message}
        </p>
      )}

      <div className="detail-grid">
        <section>
          <p>{occurrence.description}</p>
          <p className="muted small">Último avistamento: {formatDate(occurrence.lastSeenAt)}</p>
          {occurrence.address && <p className="muted">{occurrence.address}</p>}
          {occurrence.photoURLs.length > 0 && (
            <div className="photo-gallery">
              {occurrence.photoURLs.map((url) => (
                <img key={url} src={url} alt={`Foto de ${occurrence.petName}`} loading="lazy" />
              ))}
            </div>
          )}
          <OccurrenceMap occurrences={[occurrence]} height="320px" />
        </section>
        <section>
          <h2>Chat da ocorrência</h2>
          <ChatPanel occurrenceId={occurrence.id} />
        </section>
      </div>
    </div>
  );
}
