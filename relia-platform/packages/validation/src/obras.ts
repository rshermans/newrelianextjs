import { z } from 'zod';

export const obraSchema = z.object({
  titulo: z.string().min(1, 'O título é obrigatório').trim(),
  autor: z.string().min(1, 'O autor é obrigatório').trim(),
  anoPublicacao: z.coerce.number().int().optional(),
  genero: z.string().trim().optional(),
  capa: z.string().url().optional().or(z.literal('')),
  noCatalogo: z.coerce.number().int().default(0),
});

export type ObraInput = z.infer<typeof obraSchema>;

export const pedidoObraSchema = z.object({
  titulo: z.string().min(1, 'O título da obra é obrigatório').trim(),
  autor: z.string().min(1, 'O nome do autor é obrigatório').trim(),
  nota: z.string().trim().max(500, 'A nota não pode exceder 500 caracteres').optional(),
});

export type PedidoObraInput = z.infer<typeof pedidoObraSchema>;

export const catalogoFiltrosSchema = z.object({
  pesquisa: z.string().trim().default(''),
  genero: z.string().trim().default(''),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(50).default(12),
});

export type CatalogoFiltros = z.infer<typeof catalogoFiltrosSchema>;
