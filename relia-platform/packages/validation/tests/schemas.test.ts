import { describe, it, expect } from 'vitest';
import {
  fichaObraSchema,
  obraSchema,
  catalogoFiltrosSchema,
  submeterRespostaSchema,
} from '../src';

describe('@relia/validation comprehensive schemas', () => {
  it('validates a complete book sheet', () => {
    const valid = fichaObraSchema.safeParse({
      genero: 'romance',
      ano: 1899,
      ano_morte_autor: 1908,
      resumo: 'Resumo da obra Os Maias...',
      personagens: [{ nome: 'Carlos', papel: 'Protagonista' }],
      temas: ['amor', 'sociedade'],
    });
    expect(valid.success).toBe(true);
  });

  it('rejects sheet with resumo over 1200 characters', () => {
    const invalid = fichaObraSchema.safeParse({
      resumo: 'x'.repeat(1201),
    });
    expect(invalid.success).toBe(false);
  });

  it('validates catalog query filters with defaults', () => {
    const parsed = catalogoFiltrosSchema.parse({});
    expect(parsed.pagina).toBe(1);
    expect(parsed.limite).toBe(12);
  });

  it('validates checkpoint answer submission', () => {
    const valid = submeterRespostaSchema.safeParse({
      checkpointId: 10,
      resposta: 'Esta é a minha resposta reflexiva.',
    });
    expect(valid.success).toBe(true);
  });
});
