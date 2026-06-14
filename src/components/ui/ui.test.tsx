import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Badge } from './Badge';
import { Button } from './Button';

describe('UI components', () => {
  it('renders badge with label', () => {
    render(<Badge label="Perdido" kind="lost" />);
    expect(screen.getByText('Perdido')).toBeInTheDocument();
  });

  it('renders button and respects disabled state', () => {
    render(<Button disabled>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });

  it('shows loading state on button', () => {
    render(<Button loading>Enviar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});

describe('HomePage accessibility', () => {
  it('renders hero heading', async () => {
    const { HomePage } = await import('../../pages/HomePage');
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /transforme compaixão em ação imediata/i }),
    ).toBeInTheDocument();
  });
});
