import { describe, it, expect } from 'vitest';
import {
  NIVEIS_BLOOM,
  FORMATOS_PERGUNTA,
  LIMITES,
  TAMANHO_CODIGO_TURMA,
} from '../src/constants';

describe('@relia/config constants', () => {
  it('should define all 6 Bloom levels in correct educational order', () => {
    expect(NIVEIS_BLOOM).toEqual([
      'Lembrar',
      'Compreender',
      'Aplicar',
      'Analisar',
      'Avaliar',
      'Criar',
    ]);
  });

  it('should define question formats', () => {
    expect(FORMATOS_PERGUNTA).toContain('escolha_multipla');
    expect(FORMATOS_PERGUNTA).toContain('resposta_aberta');
  });

  it('should have sensible boundaries for limits', () => {
    expect(LIMITES.IDADE_MINIMA).toBe(14);
    expect(TAMANHO_CODIGO_TURMA).toBe(6);
  });
});
