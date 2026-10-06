import { describe, it, expect } from 'vitest';
import {
  determinarNivel,
  nivelEProgresso,
  pontosParaAnalisar,
  formatarPontos,
  calcularPontosObtidos,
} from '../src/niveis';
import testVectors from '../../../docs/migracao-nextjs/anexos/vetores-de-teste.json';

describe('@relia/domain niveis against test vectors', () => {
  it('passes all formatar_pontos test vectors', () => {
    for (const v of testVectors.formatar_pontos) {
      expect(formatarPontos(v.in)).toBe(v.out);
    }
  });

  it('passes all niveis_antigos test vectors', () => {
    for (const c of testVectors.niveis_antigos.casos) {
      expect(determinarNivel(c.pontos, 'antigo')).toBe(c.nivel);
      expect(pontosParaAnalisar('antigo')).toBe(c.pontos_para_analisar);

      const res = nivelEProgresso(c.pontos, 'antigo');
      expect(res.nivel).toBe(c.nivel_e_progresso[0]);
      expect(Math.abs(res.progresso - c.nivel_e_progresso[1])).toBeLessThan(1e-11);
    }
  });

  it('passes all niveis_novos test vectors', () => {
    for (const c of testVectors.niveis_novos.casos) {
      expect(determinarNivel(c.pontos, 'novo')).toBe(c.nivel);
      expect(pontosParaAnalisar('novo')).toBe(c.pontos_para_analisar);

      const res = nivelEProgresso(c.pontos, 'novo');
      expect(res.nivel).toBe(c.nivel_e_progresso[0]);
      expect(Math.abs(res.progresso - c.nivel_e_progresso[1])).toBeLessThan(1e-11);
    }
  });

  it('passes all pontos_obtidos test vectors', () => {
    for (const v of testVectors.pontos_obtidos) {
      expect(calcularPontosObtidos(v.pontos, v.fracao)).toBe(v.out);
    }
  });
});
