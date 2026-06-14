import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeOccurrences } from '../services/occurrenceService';
import { listPlaces, SEED_PLACES } from '../services/placeService';
import { OccurrenceMap } from '../components/map/OccurrenceMap';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Occurrence, Place } from '../types';
import { getCurrentPosition } from '../utils/geolocation';

export function MapPage() {
  const navigate = useNavigate();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [center, setCenter] = useState<{ latitude: number; longitude: number }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentPosition()
      .then(setCenter)
      .catch(() => setCenter({ latitude: -27.5954, longitude: -48.548 }));

    const unsubscribe = subscribeOccurrences({ status: 'active' }, setOccurrences);
    listPlaces()
      .then((data) => setPlaces(data.length > 0 ? data : SEED_PLACES.map((p, i) => ({ ...p, id: `seed-${i}` }))))
      .finally(() => setLoading(false));

    return unsubscribe;
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Mapa de ocorrências</h1>
          <p className="muted">Visualize pets perdidos, avistamentos e locais de apoio em tempo real.</p>
        </div>
      </header>
      {loading ? (
        <LoadingSpinner label="Carregando mapa..." />
      ) : (
        <OccurrenceMap
          occurrences={occurrences}
          places={places}
          center={center}
          onOccurrenceClick={(occ) => navigate(`/ocorrencias/${occ.id}`)}
          height="70vh"
        />
      )}
      <div className="map-legend" aria-label="Legenda do mapa">
        <span><i className="legend-dot lost" /> Perdido</span>
        <span><i className="legend-dot found" /> Encontrado</span>
        <span><i className="legend-dot sighted" /> Avistado</span>
        <span><i className="legend-dot care" /> Lar temporário</span>
      </div>
    </div>
  );
}
