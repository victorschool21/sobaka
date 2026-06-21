import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { env, isMapboxConfigured } from '../../config/env';
import type { GeoPoint } from '../../types';

interface LocationPickerProps {
  value?: GeoPoint | null;
  onChange: (location: GeoPoint) => void;
  height?: string;
}

/**
 * Mapa interativo para selecionar localização clicando.
 * Exibe um pin no local selecionado.
 */
export function LocationPicker({
  value,
  onChange,
  height = '320px',
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [instruction, setInstruction] = useState('Clique no mapa para definir a localização');

  useEffect(() => {
    if (!containerRef.current || !isMapboxConfigured()) return;

    mapboxgl.accessToken = env.mapboxToken;

    // Centro padrão: Florianópolis, ou a localização já selecionada
    const defaultCenter: [number, number] = value
      ? [value.longitude, value.latitude]
      : [-48.548, -27.595];

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: defaultCenter,
        zoom: 13,
        attributionControl: true,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Listener de clique para selecionar localização
      mapRef.current.on('click', (e) => {
        const location: GeoPoint = {
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        };

        // Atualizar/criar o marker
        if (markerRef.current) {
          markerRef.current.setLngLat([location.longitude, location.latitude]);
        } else {
          markerRef.current = new mapboxgl.Marker({ color: '#e74c3c' })
            .setLngLat([location.longitude, location.latitude])
            .addTo(mapRef.current!);
        }

        setInstruction('📍 Localização selecionada! Clique novamente para alterar.');
        onChange(location);
      });
    }

    // Se já tem valor, colocar o marker
    if (value && !markerRef.current) {
      markerRef.current = new mapboxgl.Marker({ color: '#e74c3c' })
        .setLngLat([value.longitude, value.latitude])
        .addTo(mapRef.current);
      setInstruction('📍 Localização selecionada! Clique novamente para alterar.');
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
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
    <div className="location-picker">
      <p className="location-picker-hint">{instruction}</p>
      <div
        ref={containerRef}
        className="location-picker-map"
        style={{ height, borderRadius: '8px', overflow: 'hidden' }}
        role="application"
        aria-label="Mapa para selecionar localização"
      />
    </div>
  );
}
