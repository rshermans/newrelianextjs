import { z } from 'zod';

export const entrarSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type EntrarInput = z.infer<typeof entrarSchema>;

export const registarSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  idade: z.coerce.number().min(14, 'A idade mínima é de 14 anos').max(100).optional(),
  cidade: z.string().optional(),
  interesses: z.string().optional(),
  nivelEducacional: z.string().optional(),
  habitoLeitura: z.string().optional(),
  opcaoCompartilhar: z.coerce.number().default(1),
  variantePt: z.enum(['pt-PT', 'pt-BR']).default('pt-PT'),
});

export type RegistarInput = z.infer<typeof registarSchema>;
