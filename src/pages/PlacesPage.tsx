import { useEffect, useState } from 'react';
import { listNearbyPlaces, listPlaces, SEED_PLACES } from '../services/placeService';
import { OccurrenceMap } from '../components/map/OccurrenceMap';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Place } from '../types';
import { getCurrentPosition } from '../utils/geolocation';

export function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<'all' | 'pet_shop' | 'veterinarian'>('all');
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<{ latitude: number; longitude: number }>();

  useEffect(() => {
    async function load() {
      try {
        const pos = await getCurrentPosition();
        setCenter(pos);
        const nearby = await listNearbyPlaces(pos, 15);
        if (nearby.length > 0) {
          setPlaces(nearby);
        } else {
          const all = await listPlaces();
          setPlaces(all.length > 0 ? all : SEED_PLACES.map((p, i) => ({ ...p, id: `seed-${i}` })));
        }
      } catch {
        const all = await listPlaces();
        setPlaces(all.length > 0 ? all : SEED_PLACES.map((p, i) => ({ ...p, id: `seed-${i}` })));
        setCenter({ latitude: -27.5954, longitude: -48.548 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered =
    filter === 'all' ? places : places.filter((p) => p.type === filter);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Pet Shops & Veterinários</h1>
        <p className="muted">Locais de apoio próximos para emergências e identificação.</p>
      </header>

      <div className="filter-tabs" role="tablist" aria-label="Filtrar locais">
        {(['all', 'pet_shop', 'veterinarian'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={filter === tab}
            className={filter === tab ? 'tab active' : 'tab'}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'Todos' : tab === 'pet_shop' ? 'Pet Shops' : 'Veterinários'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <OccurrenceMap occurrences={[]} places={filtered} center={center} height="400px" />
          <div className="places-list">
            {filtered.map((place) => (
              <Card key={place.id} title={place.name}>
                <p>{place.address}</p>
                {place.phone && <p className="muted">{place.phone}</p>}
                <p className="small muted">{place.type === 'pet_shop' ? 'Pet Shop' : 'Veterinário'}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
