import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { loginUser } from '../services/authService';
import { PublicNavbar, Footer } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { loginSchema } from '../utils/validators';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function LoginPage() {
  const { user, profile, loading, firebaseReady, setProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }
    setSubmitting(true);
    try {
      const userProfile = await loginUser(parsed.data.email, parsed.data.password);
      setProfile(userProfile);
      navigate(from, { replace: true });
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
        <form className="auth-card" onSubmit={handleSubmit} aria-labelledby="login-title">
          <h1 id="login-title">Entrar na Sobaka</h1>
          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error ?? undefined}
          />
          <Button type="submit" loading={submitting} className="full-width">
            Entrar
          </Button>
          <p className="auth-footer">
            Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
