import { Link } from 'react-router-dom';
import type { Occurrence } from '../../types';
import {
  formatOccurrenceStatus,
  formatOccurrenceType,
  formatRelativeDate,
  formatSpecies,
} from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function OccurrenceCard({ occurrence }: { occurrence: Occurrence }) {
  return (
    <Card className="occurrence-card">
      <Link to={`/ocorrencias/${occurrence.id}`} className="occurrence-link">
        <div className="occurrence-card-top">
          <div>
            <h3>{occurrence.petName}</h3>
            <p className="muted">
              {formatSpecies(occurrence.species)}
              {occurrence.breed ? ` · ${occurrence.breed}` : ''}
            </p>
          </div>
          <div className="badge-group">
            <Badge label={formatOccurrenceType(occurrence.type)} kind={occurrence.type} />
            <Badge label={formatOccurrenceStatus(occurrence.status)} kind={occurrence.status} />
          </div>
        </div>
        <p className="occurrence-desc">{occurrence.description}</p>
        <p className="muted small">{formatRelativeDate(occurrence.createdAt)}</p>
        {occurrence.photoURLs[0] && (
          <img
            src={occurrence.photoURLs[0]}
            alt={`Foto de ${occurrence.petName}`}
            className="occurrence-thumb"
            loading="lazy"
          />
        )}
      </Link>
    </Card>
  );
}
