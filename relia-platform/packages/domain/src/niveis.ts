export const NIVEIS_BLOOM = [
  'Lembrar',
  'Compreender',
  'Aplicar',
  'Analisar',
  'Avaliar',
  'Criar',
] as const;

export type NivelBloom = (typeof NIVEIS_BLOOM)[number];

export const LIMIARES_ANTIGOS = [15, 45, 91, 153, 190, 253] as const;
export const LIMIARES_NOVOS = [8, 26, 54, 92, 140, 200] as const;

export type TipoMotorPerguntas = 'antigo' | 'novo';

/**
 * Arredondamento banker's rounding (round-half-to-even) a N casas decimais,
 * compatível com o comportamento nativo de round(x, n) em Python.
 */
export function roundHalfToEven(n: unknown, decimals = 1): number {
  if (n === null || n === undefined || isNaN(Number(n))) return 0;
  const num = Number(n);
  const factor = Math.pow(10, decimals);
  const shifted = num * factor;
  const floor = Math.floor(shifted);
  const diff = Math.abs(shifted - floor);
  if (Math.abs(diff - 0.5) < 1e-9) {
    return (floor % 2 === 0 ? floor : floor + 1) / factor;
  }
  return Math.round(shifted) / factor;
}

/**
 * Devolve os limiares superiores inclusivos para cada nível
 */
export function obterLimiares(
  motor: TipoMotorPerguntas = 'antigo'
): readonly [number, number, number, number, number, number] {
  return motor === 'novo' ? LIMIARES_NOVOS : LIMIARES_ANTIGOS;
}

/**
 * Determina o nível de Bloom com base na pontuação acumulada.
 * O primeiro nível cujo limite (dos cinco primeiros) é >= p; acima do quinto limite é 'Criar'.
 */
export function determinarNivel(
  pontos: number,
  motor: TipoMotorPerguntas = 'antigo'
): NivelBloom {
  const limiares = obterLimiares(motor);

  for (let i = 0; i < 5; i++) {
    const limite = limiares[i];
    const nivel = NIVEIS_BLOOM[i];
    if (limite !== undefined && nivel !== undefined && pontos <= limite) {
      return nivel;
    }
  }

  return 'Criar';
}

/**
 * Devolve o nível atual e o progresso normalizado [0.0, 1.0].
 * Percorre os seis limites; se p <= limite_i: nivel_i e progresso global
 * (i + (p - limite_{i-1}) / (limite_i - limite_{i-1})) / 6 (com limite_{-1} = 0);
 * se p excede o sexto limite: nível "Mestre" e progresso 1.0.
 */
export function nivelEProgresso(
  pontos: number,
  motor: TipoMotorPerguntas = 'antigo'
): { nivel: string; progresso: number } {
  const limiares = obterLimiares(motor);

  let limiteAnterior = 0;
  for (let i = 0; i < 6; i++) {
    const limiteAtual = limiares[i];
    const nivelAtual = NIVEIS_BLOOM[i];
    if (limiteAtual !== undefined && nivelAtual !== undefined) {
      if (pontos <= limiteAtual) {
        const fracaoNivel =
          limiteAtual === limiteAnterior
            ? 0
            : (pontos - limiteAnterior) / (limiteAtual - limiteAnterior);
        const progressoGlobal = (i + Math.max(0, Math.min(1, fracaoNivel))) / 6;
        return {
          nivel: nivelAtual,
          progresso: progressoGlobal,
        };
      }
      limiteAnterior = limiteAtual;
    }
  }

  return {
    nivel: 'Mestre',
    progresso: 1.0,
  };
}

/**
 * Devolve a pontuação necessária para alcançar o nível 'Analisar' (limiares[2] + 1)
 */
export function pontosParaAnalisar(motor: TipoMotorPerguntas = 'antigo'): number {
  const limiares = obterLimiares(motor);
  const limite = limiares[2];
  return (limite ?? 91) + 1;
}

/**
 * Formata pontos com 1 casa decimal quando necessário, com vírgula decimal (ex: "3,5" ou "12")
 * e compatibilidade estrita com os vetores de teste (arredondamento round-half-to-even).
 */
export function formatarPontos(pontos: unknown): string {
  const r = roundHalfToEven(pontos, 1);
  if (Number.isInteger(r)) {
    return r.toString();
  }
  return r.toFixed(1).replace('.', ',');
}

/**
 * Calcula os pontos obtidos numa pergunta dada a pontuação base e a fração [0, 1].
 */
export function calcularPontosObtidos(pontosEstrategia: number, fracao: number): number {
  const clampFracao = Math.max(0, Math.min(1, fracao));
  return roundHalfToEven(pontosEstrategia * clampFracao, 1);
}
