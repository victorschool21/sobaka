import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/authService';
import { requestPushPermission } from '../services/notificationService';
import { getCurrentPosition } from '../utils/geolocation';
import { profileSchema } from '../utils/validators';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { formatRole } from '../utils/formatters';

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [notificationRadiusKm, setNotificationRadiusKm] = useState(5);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName);
    setPhone(profile.phone ?? '');
    setBio(profile.bio ?? '');
    setNotificationRadiusKm(profile.notificationRadiusKm);
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    const parsed = profileSchema.safeParse({ displayName, phone: phone || undefined, bio: bio || undefined, notificationRadiusKm });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }
    setLoading(true);
    try {
      let location = profile.location;
      try {
        location = await getCurrentPosition();
      } catch {
        /* mantém localização anterior */
      }
      await updateUserProfile(profile.uid, { ...parsed.data, location });
      await refreshProfile();
      setMessage('Perfil atualizado com sucesso.');
    } catch {
      setError('Não foi possível salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnablePush = async () => {
    if (!profile) return;
    const token = await requestPushPermission(profile.uid);
    setMessage(token ? 'Notificações push ativadas.' : 'Permissão de notificação negada ou indisponível.');
  };

  if (!profile) return null;

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1>Meu perfil</h1>
        <p className="muted">{formatRole(profile.role)} · {profile.email}</p>
      </header>

      <form className="form-stack" onSubmit={handleSubmit}>
        <Input label="Nome" name="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input label="Telefone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextArea label="Bio" name="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        <Input
          label="Raio de notificações (km)"
          name="notificationRadiusKm"
          type="number"
          min={1}
          max={50}
          value={notificationRadiusKm}
          onChange={(e) => setNotificationRadiusKm(Number(e.target.value))}
          hint="Usuários dentro deste raio recebem alertas de novas ocorrências."
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="success-banner" role="status">{message}</p>}
        <Button type="submit" loading={loading}>Salvar perfil</Button>
        <Button type="button" variant="secondary" onClick={handleEnablePush}>
          Ativar notificações push
        </Button>
      </form>
    </div>
  );
}
