import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  formatOccurrenceType,
  formatOccurrenceStatus,
  formatSpecies,
  formatRole,
  formatDate,
  formatRelativeDate,
} from './formatters';

describe('formatOccurrenceType', () => {
  it('formata todos os tipos', () => {
    expect(formatOccurrenceType('lost')).toBe('Perdido');
    expect(formatOccurrenceType('found')).toBe('Encontrado');
    expect(formatOccurrenceType('sighted')).toBe('Avistado');
    expect(formatOccurrenceType('temporary_care')).toBe('Lar temporário');
  });
});

describe('formatOccurrenceStatus', () => {
  it('formata todos os status', () => {
    expect(formatOccurrenceStatus('active')).toBe('Ativo');
    expect(formatOccurrenceStatus('resolved')).toBe('Resolvido');
    expect(formatOccurrenceStatus('archived')).toBe('Arquivado');
  });
});

describe('formatSpecies', () => {
  it('formata todas as espécies', () => {
    expect(formatSpecies('dog')).toBe('Cachorro');
    expect(formatSpecies('cat')).toBe('Gato');
    expect(formatSpecies('other')).toBe('Outro');
  });
});

describe('formatRole', () => {
  it('formata todos os roles', () => {
    expect(formatRole('tutor')).toBe('Tutor');
    expect(formatRole('protector')).toBe('Protetor / Solidário');
    expect(formatRole('temporary_home')).toBe('Lar temporário');
    expect(formatRole('admin')).toBe('Administrador');
  });
});

describe('formatDate', () => {
  it('formata data ISO no padrão brasileiro', () => {
    const result = formatDate('2024-03-15T14:30:00.000Z');
    // O formato é dd/MM/yyyy 'às' HH:mm — o fuso pode variar, então verificamos a estrutura
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}$/);
  });

  it('formata datas de anos diferentes corretamente', () => {
    // Usa datas no meio do ano (julho) para evitar problemas de fuso horário
    const result2020 = formatDate('2020-07-15T12:00:00.000Z');
    expect(result2020).toContain('2020');

    const result2025 = formatDate('2025-07-15T12:00:00.000Z');
    expect(result2025).toContain('2025');
  });
});

describe('formatRelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  it('retorna "há X minutos" para data recente', () => {
    const fiveMinutesAgo = new Date('2024-06-15T11:55:00.000Z').toISOString();
    const result = formatRelativeDate(fiveMinutesAgo);
    expect(result).toMatch(/minuto/);
  });

  it('retorna "há X horas" para data de horas atrás', () => {
    const twoHoursAgo = new Date('2024-06-15T10:00:00.000Z').toISOString();
    const result = formatRelativeDate(twoHoursAgo);
    expect(result).toMatch(/hora/);
  });

  it('retorna texto em português', () => {
    const yesterday = new Date('2024-06-14T12:00:00.000Z').toISOString();
    const result = formatRelativeDate(yesterday);
    // date-fns/ptBR usa "há" como prefixo
    expect(result).toMatch(/há/);
  });
});
