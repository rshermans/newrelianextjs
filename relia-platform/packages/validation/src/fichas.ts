import { z } from 'zod';

export const personagemFichaSchema = z.object({
  nome: z.string().trim(),
  papel: z.string().trim(),
});

export const contextoFichaSchema = z.object({
  epoca: z.string().trim().default(''),
  local: z.string().trim().default(''),
});

export const fichaObraSchema = z.object({
  genero: z.string().trim().default(''),
  ano: z.coerce.number().int().default(0),
  ano_morte_autor: z.coerce.number().int().default(0),
  resumo: z.string().trim().max(1200, 'O resumo não pode exceder 1200 caracteres').default(''),
  narrador: z.string().trim().default(''),
  estrutura: z.string().trim().default(''),
  acontecimentos: z.array(z.string().trim()).max(8).default([]),
  estilo: z.string().trim().default(''),
  contexto: contextoFichaSchema.default({ epoca: '', local: '' }),
  personagens: z.array(personagemFichaSchema).max(8).default([]),
  temas: z.array(z.string().trim()).max(6).default([]),
  simbolos: z.array(z.string().trim()).max(5).default([]),
  recursos: z.array(z.string().trim()).max(6).default([]),
  dilemas: z.array(z.string().trim()).max(4).default([]),
  leituras_criticas: z.array(z.string().trim()).max(4).default([]),
});

export type FichaObraInput = z.infer<typeof fichaObraSchema>;
