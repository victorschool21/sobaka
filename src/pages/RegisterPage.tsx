import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../services/authService';
import { PublicNavbar, Footer } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { registerSchema } from '../utils/validators';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { UserRole } from '../types';

const roleOptions = [
  { value: 'tutor', label: 'Tutor — perdi ou quero proteger meu pet' },
  { value: 'protector', label: 'Protetor / Solidário — avisto pets na rua' },
  { value: 'temporary_home', label: 'Lar temporário / Resgatista' },
];

export function RegisterPage() {
  const { user, profile, loading, firebaseReady, setProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('protector');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!firebaseReady) return <Navigate to="/setup" replace />;
  if (loading) {
    return (
      <div className="page-center">
        <LoadingSpinner label="Carregando..." />
      </div>
    );
  }
  if (user && profile) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = registerSchema.safeParse({ displayName, email, password, role, phone: phone || undefined });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }
    setSubmitting(true);
    try {
      const userProfile = await registerUser(
        parsed.data.email,
        parsed.data.password,
        parsed.data.displayName,
        parsed.data.role,
        parsed.data.phone,
      );
      setProfile(userProfile);
      navigate('/dashboard');
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-shell">
      <PublicNavbar />
      <main id="main-content" className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit} aria-labelledby="register-title">
          <h1 id="register-title">Criar conta</h1>
          <Input label="Nome completo" name="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input label="E-mail" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Telefone (opcional)" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Select label="Como você vai usar a Sobaka?" name="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} options={roleOptions} />
          <Input label="Senha" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} error={error ?? undefined} />
          <Button type="submit" loading={submitting} className="full-width">
            Cadastrar
          </Button>
          <p className="auth-footer">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
