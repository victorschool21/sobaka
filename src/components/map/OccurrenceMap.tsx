import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { env, isMapboxConfigured } from '../../config/env';
import type { GeoPoint, Occurrence, Place } from '../../types';

interface OccurrenceMapProps {
  occurrences: Occurrence[];
  places?: Place[];
  center?: GeoPoint;
  onOccurrenceClick?: (occurrence: Occurrence) => void;
  height?: string;
}

const typeColors: Record<Occurrence['type'], string> = {
  lost: '#e74c3c',
  found: '#27ae60',
  sighted: '#f39c12',
  temporary_care: '#3498db',
};

export function OccurrenceMap({
  occurrences,
  places = [],
  center,
  onOccurrenceClick,
  height = '480px',
}: OccurrenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || !isMapboxConfigured()) return;

    mapboxgl.accessToken = env.mapboxToken;
    const defaultCenter: [number, number] = center
      ? [center.longitude, center.latitude]
      : [-48.548, -27.595];

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: defaultCenter,
        zoom: 12,
        attributionControl: true,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    occurrences.forEach((occ) => {
      const el = document.createElement('button');
      el.className = 'map-marker';
      el.type = 'button';
      el.style.backgroundColor = typeColors[occ.type];
      el.setAttribute('aria-label', `Ocorrência: ${occ.petName}`);
      el.title = occ.petName;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([occ.location.longitude, occ.location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 24 }).setHTML(
            `<strong>${occ.petName}</strong><br/>${occ.description.slice(0, 80)}...`,
          ),
        )
        .addTo(mapRef.current!);

      if (onOccurrenceClick) {
        el.addEventListener('click', () => onOccurrenceClick(occ));
      }
      markersRef.current.push(marker);
    });

    places.forEach((place) => {
      const el = document.createElement('div');
      el.className = 'map-place-marker';
      el.textContent = place.type === 'pet_shop' ? '🏪' : '🏥';
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([place.location.longitude, place.location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 24 }).setHTML(
            `<strong>${place.name}</strong><br/>${place.address}`,
          ),
        )
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
    };
  }, [occurrences, places, center, onOccurrenceClick]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (!isMapboxConfigured()) {
    return (
      <div className="map-fallback" style={{ height }} role="alert">
        <p>Configure <code>VITE_MAPBOX_TOKEN</code> no arquivo <code>.env</code> para exibir o mapa.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="occurrence-map"
      style={{ height }}
      role="application"
      aria-label="Mapa de ocorrências de pets"
    />
  );
}
