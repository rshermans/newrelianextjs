import { z } from 'zod';

export const submeterRespostaSchema = z.object({
  checkpointId: z.coerce.number().int().positive('ID do checkpoint inválido'),
  resposta: z.string().trim().min(1, 'A resposta não pode estar vazia'),
  tempoSegundos: z.coerce.number().min(0).optional(),
});

export type SubmeterRespostaInput = z.infer<typeof submeterRespostaSchema>;

export const avaliarRespostaSchema = z.object({
  checkpointId: z.coerce.number().int().positive(),
  notaLlm: z.coerce.number().int().min(0).max(100),
  feedbackLlm: z.string().trim().min(1),
});

export type AvaliarRespostaInput = z.infer<typeof avaliarRespostaSchema>;
