import { describe, expect, it } from 'vitest';
import {
  loginSchema,
  registerSchema,
  profileSchema,
  occurrenceSchema,
  chatMessageSchema,
} from './validators';

describe('loginSchema', () => {
  it('aceita email e senha válidos', () => {
    expect(loginSchema.safeParse({ email: 'ana@email.com', password: '123456' }).success).toBe(true);
  });

  it('rejeita email inválido', () => {
    const r = loginSchema.safeParse({ email: 'invalido', password: '123456' });
    expect(r.success).toBe(false);
  });

  it('rejeita senha com menos de 6 caracteres', () => {
    const r = loginSchema.safeParse({ email: 'ana@email.com', password: '123' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toContain('password');
  });

  it('rejeita payload vazio', () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const base = {
    displayName: 'Ana Laura',
    email: 'ana@email.com',
    password: '123456',
    role: 'tutor' as const,
  };

  it('aceita dados válidos com role tutor', () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it('aceita role protector e temporary_home', () => {
    expect(registerSchema.safeParse({ ...base, role: 'protector' }).success).toBe(true);
    expect(registerSchema.safeParse({ ...base, role: 'temporary_home' }).success).toBe(true);
  });

  it('rejeita role admin (não permitido no cadastro)', () => {
    expect(registerSchema.safeParse({ ...base, role: 'admin' }).success).toBe(false);
  });

  it('rejeita displayName com menos de 2 caracteres', () => {
    expect(registerSchema.safeParse({ ...base, displayName: 'A' }).success).toBe(false);
  });

  it('aceita phone opcional', () => {
    expect(registerSchema.safeParse({ ...base, phone: '48999999999' }).success).toBe(true);
  });
});

describe('profileSchema', () => {
  it('aceita perfil válido', () => {
    expect(profileSchema.safeParse({ displayName: 'João', notificationRadiusKm: 10 }).success).toBe(true);
  });

  it('rejeita raio menor que 1', () => {
    const r = profileSchema.safeParse({ displayName: 'João', notificationRadiusKm: 0 });
    expect(r.success).toBe(false);
  });

  it('rejeita raio maior que 50', () => {
    const r = profileSchema.safeParse({ displayName: 'João', notificationRadiusKm: 51 });
    expect(r.success).toBe(false);
  });

  it('rejeita bio com mais de 500 caracteres', () => {
    const r = profileSchema.safeParse({
      displayName: 'João',
      notificationRadiusKm: 5,
      bio: 'x'.repeat(501),
    });
    expect(r.success).toBe(false);
  });

  it('aceita bio com exatamente 500 caracteres', () => {
    expect(profileSchema.safeParse({
      displayName: 'João',
      notificationRadiusKm: 5,
      bio: 'x'.repeat(500),
    }).success).toBe(true);
  });
});

describe('occurrenceSchema', () => {
  const base = {
    type: 'lost' as const,
    petName: 'Thor',
    species: 'dog' as const,
    description: 'Cachorro de porte médio, pelagem marrom',
  };

  it('aceita ocorrência válida', () => {
    expect(occurrenceSchema.safeParse(base).success).toBe(true);
  });

  it('rejeita descrição com menos de 10 caracteres', () => {
    expect(occurrenceSchema.safeParse({ ...base, description: 'curta' }).success).toBe(false);
  });

  it('rejeita type inválido', () => {
    expect(occurrenceSchema.safeParse({ ...base, type: 'unknown' }).success).toBe(false);
  });

  it('rejeita species inválida', () => {
    expect(occurrenceSchema.safeParse({ ...base, species: 'bird' }).success).toBe(false);
  });

  it('aceita todos os tipos válidos', () => {
    for (const type of ['lost', 'found', 'sighted', 'temporary_care'] as const) {
      expect(occurrenceSchema.safeParse({ ...base, type }).success).toBe(true);
    }
  });

  it('aceita campos opcionais ausentes', () => {
    expect(occurrenceSchema.safeParse(base).success).toBe(true);
  });
});

describe('chatMessageSchema', () => {
  it('aceita mensagem válida', () => {
    expect(chatMessageSchema.safeParse({ content: 'Olá!' }).success).toBe(true);
  });

  it('rejeita mensagem vazia', () => {
    expect(chatMessageSchema.safeParse({ content: '' }).success).toBe(false);
  });

  it('rejeita mensagem com mais de 1000 caracteres', () => {
    expect(chatMessageSchema.safeParse({ content: 'a'.repeat(1001) }).success).toBe(false);
  });

  it('aceita mensagem com exatamente 1000 caracteres', () => {
    expect(chatMessageSchema.safeParse({ content: 'a'.repeat(1000) }).success).toBe(true);
  });
});
