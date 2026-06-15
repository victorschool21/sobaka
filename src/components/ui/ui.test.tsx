import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Badge } from './Badge';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { LoadingSpinner } from './LoadingSpinner';

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
describe('Badge', () => {
  it('renderiza o texto do label', () => {
    render(<Badge label="Perdido" kind="lost" />);
    expect(screen.getByText('Perdido')).toBeInTheDocument();
  });

  it('aplica classe correta para tipo de ocorrência', () => {
    const { container } = render(<Badge label="Encontrado" kind="found" />);
    expect(container.firstChild).toHaveClass('badge-found');
  });

  it('aplica classe correta para status', () => {
    const { container } = render(<Badge label="Resolvido" kind="resolved" />);
    expect(container.firstChild).toHaveClass('badge-resolved');
  });

  it('aplica classe default para kind desconhecido', () => {
    const { container } = render(<Badge label="Padrão" kind="default" />);
    expect(container.firstChild).toHaveClass('badge-default');
  });
});

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
describe('Button', () => {
  it('renderiza o texto', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('fica desabilitado quando disabled=true', () => {
    render(<Button disabled>Salvar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('mostra "Aguarde..." e fica desabilitado quando loading=true', () => {
    render(<Button loading>Enviar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveTextContent('Aguarde...');
  });

  it('aplica variante secondary', () => {
    const { container } = render(<Button variant="secondary">Cancelar</Button>);
    expect(container.firstChild).toHaveClass('btn-secondary');
  });

  it('aplica variante ghost', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    expect(container.firstChild).toHaveClass('btn-ghost');
  });

  it('aplica variante danger', () => {
    const { container } = render(<Button variant="danger">Excluir</Button>);
    expect(container.firstChild).toHaveClass('btn-danger');
  });

  it('aplica tamanho sm', () => {
    const { container } = render(<Button size="sm">Pequeno</Button>);
    expect(container.firstChild).toHaveClass('btn-sm');
  });

  it('chama onClick quando clicado', () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('não chama onClick quando desabilitado', () => {
    const handler = vi.fn();
    render(<Button onClick={handler} disabled>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
describe('Input', () => {
  it('renderiza label e input associados', () => {
    render(<Input label="Nome" name="nome" />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('exibe mensagem de erro com role=alert', () => {
    render(<Input label="Email" name="email" error="E-mail inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail inválido');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('exibe hint quando não há erro', () => {
    render(<Input label="Raio" name="raio" hint="Em quilômetros" />);
    expect(screen.getByText('Em quilômetros')).toBeInTheDocument();
  });

  it('não exibe hint quando há erro', () => {
    render(<Input label="Campo" name="campo" hint="Dica" error="Erro" />);
    expect(screen.queryByText('Dica')).not.toBeInTheDocument();
  });

  it('aplica required ao input subjacente', () => {
    render(<Input label="Campo" name="campo" required />);
    expect(screen.getByLabelText('Campo')).toBeRequired();
  });
});

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
describe('Card', () => {
  it('renderiza o título como heading', () => {
    render(<Card title="Meu Card"><p>Conteúdo</p></Card>);
    expect(screen.getByRole('heading', { name: 'Meu Card' })).toBeInTheDocument();
  });

  it('renderiza os filhos', () => {
    render(<Card title="X"><span>Filho</span></Card>);
    expect(screen.getByText('Filho')).toBeInTheDocument();
  });

  it('renderiza sem título', () => {
    render(<Card><span>Sem título</span></Card>);
    expect(screen.getByText('Sem título')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// LoadingSpinner
// ---------------------------------------------------------------------------
describe('LoadingSpinner', () => {
  it('renderiza com label padrão', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renderiza com label customizado', () => {
    render(<LoadingSpinner label="Carregando dados..." />);
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// HomePage accessibility
// ---------------------------------------------------------------------------
describe('HomePage acessibilidade', () => {
  it('renderiza heading principal', async () => {
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
