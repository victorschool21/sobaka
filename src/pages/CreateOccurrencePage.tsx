import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createOccurrence, updateOccurrence } from '../services/occurrenceService';
import { uploadOccurrencePhotos } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { TextArea } from '../components/ui/TextArea';
import { occurrenceSchema } from '../utils/validators';
import { getCurrentPosition } from '../utils/geolocation';
import type { OccurrenceType, PetSpecies } from '../types';

const typeOptions = [
  { value: 'lost', label: 'Pet perdido' },
  { value: 'found', label: 'Pet encontrado' },
  { value: 'sighted', label: 'Avistamento' },
  { value: 'temporary_care', label: 'Lar temporário' },
];

const speciesOptions = [
  { value: 'dog', label: 'Cachorro' },
  { value: 'cat', label: 'Gato' },
  { value: 'other', label: 'Outro' },
];

export function CreateOccurrencePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState<OccurrenceType>('sighted');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);

    const parsed = occurrenceSchema.safeParse({
      type,
      petName,
      species,
      breed: breed || undefined,
      color: color || undefined,
      description,
      address: address || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }

    setLoading(true);
    try {
      const location = await getCurrentPosition();
      const id = await createOccurrence({
        type: parsed.data.type,
        reporterId: profile.uid,
        reporterName: profile.displayName,
        petName: parsed.data.petName,
        species: parsed.data.species,
        breed: parsed.data.breed,
        color: parsed.data.color,
        description: parsed.data.description,
        photoURLs: [],
        location,
        address: parsed.data.address,
        lastSeenAt: new Date().toISOString(),
        temporaryCareContactId:
          parsed.data.type === 'temporary_care' ? profile.uid : undefined,
      });

      if (photos.length > 0) {
        const urls = await uploadOccurrencePhotos(photos, id);
        await updateOccurrence(id, { photoURLs: urls }, profile.uid);
      }

      navigate(`/ocorrencias/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar ocorrência.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1>Registrar ocorrência</h1>
        <p className="muted">Informe localização, fotos e detalhes do pet em poucos passos.</p>
      </header>

      <form className="form-stack" onSubmit={handleSubmit}>
        <Select label="Tipo de ocorrência" name="type" value={type} onChange={(e) => setType(e.target.value as OccurrenceType)} options={typeOptions} />
        <Input label="Nome ou apelido do pet" name="petName" required value={petName} onChange={(e) => setPetName(e.target.value)} />
        <Select label="Espécie" name="species" value={species} onChange={(e) => setSpecies(e.target.value as PetSpecies)} options={speciesOptions} />
        <Input label="Raça (opcional)" name="breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
        <Input label="Cor (opcional)" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <TextArea label="Descrição" name="description" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Endereço aproximado (opcional)" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="form-field">
          <label htmlFor="photos">Fotos (opcional)</label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
          />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" loading={loading} className="full-width">
          Publicar alerta
        </Button>
      </form>
    </div>
  );
}
