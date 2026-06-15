import { useEffect, useReducer, useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/useAuth';
import { updateUserProfile } from '../services/authService';
import { requestPushPermission } from '../services/notificationService';
import { getCurrentPosition } from '../utils/geolocation';
import { profileSchema } from '../utils/validators';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { formatRole } from '../utils/formatters';

type FormState = { displayName: string; phone: string; bio: string; notificationRadiusKm: number };
type FormAction = { type: 'init'; payload: FormState } | { type: 'set'; field: keyof FormState; value: string | number };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'init': return action.payload;
    case 'set': return { ...state, [action.field]: action.value };
    default: return state;
  }
}

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, dispatch] = useReducer(formReducer, {
    displayName: '',
    phone: '',
    bio: '',
    notificationRadiusKm: 5,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    dispatch({
      type: 'init',
      payload: {
        displayName: profile.displayName,
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
        notificationRadiusKm: profile.notificationRadiusKm,
      },
    });
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    const parsed = profileSchema.safeParse({ displayName: form.displayName, phone: form.phone || undefined, bio: form.bio || undefined, notificationRadiusKm: form.notificationRadiusKm });
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
        <Input label="Nome" name="displayName" required value={form.displayName} onChange={(e) => dispatch({ type: 'set', field: 'displayName', value: e.target.value })} />
        <Input label="Telefone" name="phone" type="tel" value={form.phone} onChange={(e) => dispatch({ type: 'set', field: 'phone', value: e.target.value })} />
        <TextArea label="Bio" name="bio" rows={3} value={form.bio} onChange={(e) => dispatch({ type: 'set', field: 'bio', value: e.target.value })} />
        <Input
          label="Raio de notificações (km)"
          name="notificationRadiusKm"
          type="number"
          min={1}
          max={50}
          value={form.notificationRadiusKm}
          onChange={(e) => dispatch({ type: 'set', field: 'notificationRadiusKm', value: Number(e.target.value) })}
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
