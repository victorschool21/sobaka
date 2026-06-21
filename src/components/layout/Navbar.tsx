import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Map, PawPrint, Shield, Store, User } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { Button } from '../ui/Button';

export function Navbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand" aria-label="Sobaka - início">
          <PawPrint aria-hidden="true" />
          <span>Sobaka</span>
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          <NavLink to="/mapa">Mapa</NavLink>
          <NavLink to="/ocorrencias">Ocorrências</NavLink>
          <NavLink to="/notificacoes" className="nav-icon-link" aria-label="Notificações">
            <Bell size={18} aria-hidden="true" />
            <span className="sr-only">Notificações</span>
          </NavLink>
          <NavLink to="/perfil" className="nav-icon-link" aria-label="Perfil">
            <User size={18} aria-hidden="true" />
            <span className="sr-only">Perfil</span>
          </NavLink>
          {profile?.role === 'admin' && (
            <NavLink to="/admin" className="nav-icon-link" aria-label="Administração">
              <Shield size={18} aria-hidden="true" />
              <span className="sr-only">Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          <Button variant="secondary" size="sm" onClick={() => navigate('/ocorrencias/nova')}>
            <Map size={16} aria-hidden="true" /> Reportar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sair">
            <LogOut size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function PublicNavbar() {
  return (
    <header className="navbar navbar-public" role="banner">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <PawPrint aria-hidden="true" />
          <span>Sobaka</span>
        </Link>
        <nav className="nav-links" aria-label="Navegação pública">
          <Link to="/login">Entrar</Link>
          <Link to="/cadastro" className="nav-cta">
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <p>
          <Store size={16} aria-hidden="true" /> Sobaka — conectando pets perdidos às suas famílias.
        </p>
        <p className="footer-meta">Equipe 16 · Projeto Aplicado IV · SENAI SC</p>
      </div>
    </footer>
  );
}
