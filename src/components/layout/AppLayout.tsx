import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
