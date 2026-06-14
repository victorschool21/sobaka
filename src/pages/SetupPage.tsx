import { Link } from 'react-router-dom';
import { PublicNavbar, Footer } from '../components/layout/Navbar';

export function SetupPage() {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <main id="main-content" className="page-narrow">
        <h1>Configuração necessária</h1>
        <p>
          Para executar a Sobaka, configure as variáveis de ambiente copiando{' '}
          <code>.env.example</code> para <code>.env</code> e preenchendo as credenciais do Firebase
          e do Mapbox.
        </p>
        <ol className="setup-steps">
          <li>Crie um projeto no <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">Firebase Console</a></li>
          <li>Ative Authentication (e-mail/senha), Firestore e Storage</li>
          <li>Obtenha um token em <a href="https://account.mapbox.com" target="_blank" rel="noreferrer">Mapbox</a></li>
          <li>Execute <code>npm run dev</code></li>
        </ol>
        <p>
          Consulte o <Link to="/">README</Link> no repositório para instruções detalhadas de deploy e testes.
        </p>
      </main>
      <Footer />
    </div>
  );
}
