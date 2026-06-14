import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  displayName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['tutor', 'protector', 'temporary_home']),
  phone: z.string().optional(),
});

export const profileSchema = z.object({
  displayName: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  notificationRadiusKm: z.number().min(1).max(50),
});

export const occurrenceSchema = z.object({
  type: z.enum(['lost', 'found', 'sighted', 'temporary_care']),
  petName: z.string().min(1, 'Informe o nome ou apelido do pet'),
  species: z.enum(['dog', 'cat', 'other']),
  breed: z.string().optional(),
  color: z.string().optional(),
  description: z.string().min(10, 'Descreva com mais detalhes (mín. 10 caracteres)'),
  address: z.string().optional(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(1000),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type OccurrenceInput = z.infer<typeof occurrenceSchema>;
