import { describe, expect, it } from 'vitest';
import { loginSchema, occurrenceSchema, registerSchema } from './validators';

describe('validators', () => {
  it('validates login input', () => {
    const result = loginSchema.safeParse({ email: 'ana@email.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email on login', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('validates register input with role', () => {
    const result = registerSchema.safeParse({
      displayName: 'Ana Laura',
      email: 'ana@email.com',
      password: '123456',
      role: 'tutor',
    });
    expect(result.success).toBe(true);
  });

  it('requires minimum description length for occurrences', () => {
    const result = occurrenceSchema.safeParse({
      type: 'lost',
      petName: 'Thor',
      species: 'dog',
      description: 'curta',
    });
    expect(result.success).toBe(false);
  });
});
