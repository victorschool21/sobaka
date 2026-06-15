import { describe, expect, it } from 'vitest';
import { stripUndefined } from './firestore';

describe('stripUndefined', () => {
  it('remove campos undefined', () => {
    const result = stripUndefined({ a: 1, b: undefined, c: 'hello' });
    expect(result).toEqual({ a: 1, c: 'hello' });
    expect('b' in result).toBe(false);
  });

  it('mantém campos com valor falsy não-undefined (null, 0, false, "")', () => {
    const result = stripUndefined({ a: null, b: 0, c: false, d: '' });
    expect(result).toEqual({ a: null, b: 0, c: false, d: '' });
  });

  it('retorna objeto vazio se todos os campos forem undefined', () => {
    const result = stripUndefined({ a: undefined, b: undefined });
    expect(result).toEqual({});
  });

  it('retorna o mesmo objeto se não há undefined', () => {
    const input = { x: 1, y: 2, z: 'ok' };
    const result = stripUndefined(input);
    expect(result).toEqual(input);
  });

  it('funciona com objetos aninhados (não remove undefined dentro de objetos filhos)', () => {
    // stripUndefined é shallow — apenas o nível raiz é filtrado
    const result = stripUndefined({ location: { latitude: -27.5, longitude: undefined } });
    expect(result).toHaveProperty('location');
  });

  it('funciona com arrays como valores', () => {
    const result = stripUndefined({ photoURLs: ['a', 'b'], tags: undefined });
    expect(result).toEqual({ photoURLs: ['a', 'b'] });
  });
});
