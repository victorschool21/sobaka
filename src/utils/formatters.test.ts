import { describe, expect, it } from 'vitest';
import {
  formatOccurrenceType,
  formatRole,
  formatSpecies,
} from './formatters';

describe('formatters', () => {
  it('formats occurrence types in Portuguese', () => {
    expect(formatOccurrenceType('lost')).toBe('Perdido');
    expect(formatOccurrenceType('temporary_care')).toBe('Lar temporário');
  });

  it('formats species labels', () => {
    expect(formatSpecies('dog')).toBe('Cachorro');
    expect(formatSpecies('cat')).toBe('Gato');
  });

  it('formats user roles', () => {
    expect(formatRole('protector')).toBe('Protetor / Solidário');
    expect(formatRole('admin')).toBe('Administrador');
  });
});
