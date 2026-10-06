import { describe, it, expect } from 'vitest';
import {
  linkValido,
  calcularDominioPublico,
  normalizarFicha,
  validarFichaParaCatalogo,
} from '../src/fichas';
import testVectors from '../../../docs/migracao-nextjs/anexos/vetores-de-teste.json';

describe('@relia/domain fichas against test vectors', () => {
  it('passes all link_valido test vectors', () => {
    for (const vector of testVectors.link_valido) {
      expect(linkValido(vector.in)).toBe(vector.out);
    }
  });

  it('passes all dominio_publico test vectors', () => {
    for (const vector of testVectors.dominio_publico) {
      const [emDominio, ano] = calcularDominioPublico(vector.ano_morte, vector.hoje);
      expect(emDominio).toBe(vector.out[0]);
      expect(ano).toBe(vector.out[1]);
    }
  });

  it('normalizes book sheets respecting limits and clipping', () => {
    const rawFicha = {
      genero: ' romance ',
      ano: '1899',
      ano_morte_autor: 0,
      resumo: 'A'.repeat(2000),
      contexto: { epoca: ' Século XIX ', local: ' Lisboa ' },
      personagens: [
        { nome: ' Carlos ', papel: ' Protagonista ' },
        { nome: ' Maria ', papel: ' Educadora ' },
      ],
      temas: ['família', 'sociedade', 'educação'],
      campo_estranho: 'deve ser descartado',
    };

    const normalizada = normalizarFicha(rawFicha);
    expect(normalizada.genero).toBe('romance');
    expect(normalizada.ano).toBe(1899);
    expect(normalizada.resumo.length).toBe(1200);
    expect(normalizada.contexto.epoca).toBe('Século XIX');
    expect(normalizada.personagens).toHaveLength(2);
    expect((normalizada as any).campo_estranho).toBeUndefined();
    expect(validarFichaParaCatalogo(normalizada)).toBe(true);
  });
});
