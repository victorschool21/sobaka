import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, Shield } from 'lucide-react';
import { PublicNavbar, Footer } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

export function HomePage() {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <main id="main-content">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Plataforma comunitária de reencontro</p>
            <h1>Transforme compaixão em ação imediata</h1>
            <p className="hero-subtitle">
              A Sobaka conecta tutores, protetores e cidadãos solidários para localizar pets
              perdidos em tempo real — com mapa, chat e alertas na região.
            </p>
            <div className="hero-actions">
              <Link to="/cadastro">
                <Button size="lg">Começar agora</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="features" aria-labelledby="features-title">
          <h2 id="features-title">Como funciona</h2>
          <div className="features-grid">
            <article>
              <MapPin aria-hidden="true" />
              <h3>Sinalização em tempo real</h3>
              <p>Registre avistamentos com localização exata e fotos em menos de um minuto.</p>
            </article>
            <article>
              <MessageCircle aria-hidden="true" />
              <h3>Chat integrado</h3>
              <p>Converse com tutores e resgatistas para coordenar lares temporários com segurança.</p>
            </article>
            <article>
              <Heart aria-hidden="true" />
              <h3>Rede de solidariedade</h3>
              <p>Notificações push alertam quem está por perto sobre novos casos na região.</p>
            </article>
            <article>
              <Shield aria-hidden="true" />
              <h3>Segurança e privacidade</h3>
              <p>Dados protegidos com Firebase Auth, regras de acesso e moderação administrativa.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
