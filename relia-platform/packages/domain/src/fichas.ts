export interface PersonagemFicha {
  nome: string;
  papel: string;
}

export interface ContextoFicha {
  epoca: string;
  local: string;
}

export interface FichaObra {
  genero: string;
  ano: number;
  ano_morte_autor: number;
  resumo: string;
  narrador: string;
  estrutura: string;
  acontecimentos: string[];
  estilo: string;
  contexto: ContextoFicha;
  personagens: PersonagemFicha[];
  temas: string[];
  simbolos: string[];
  recursos: string[];
  dilemas: string[];
  leituras_criticas: string[];
}

export const LIMITES_FICHA = {
  acontecimentos: 8,
  personagens: 8,
  temas: 6,
  simbolos: 5,
  recursos: 6,
  dilemas: 4,
  leituras_criticas: 4,
  resumo_max: 1200,
} as const;

/**
 * Valida e higieniza um link externo.
 * Apenas protocolos http e https com host válido são aceites.
 */
export function linkValido(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname) {
      return trimmed;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Calcula se a obra está em domínio público segundo a regra de Portugal/UE:
 * ano_morte + 70 + 1 <= ano atual
 */
export function calcularDominioPublico(
  anoMorte: number,
  dataReferencia: Date | string = new Date()
): [boolean | null, number | null] {
  if (!anoMorte || anoMorte <= 0) {
    return [null, null];
  }

  const anoReferencia =
    typeof dataReferencia === 'string'
      ? new Date(dataReferencia).getUTCFullYear()
      : dataReferencia.getUTCFullYear();

  const anoDominio = anoMorte + 70 + 1;
  return [anoDominio <= anoReferencia, anoDominio];
}

function limparTexto(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.trim();
}

function limparInteiro(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return Math.floor(val);
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function limparListaStrings(val: unknown, maxItens: number): string[] {
  if (!Array.isArray(val)) return [];
  const res: string[] = [];
  for (const item of val) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.length > 0) {
        res.push(trimmed);
        if (res.length >= maxItens) break;
      }
    }
  }
  return res;
}

/**
 * Normaliza e sanitiza qualquer ficha de leitura (vinda de formulário, IA ou DB).
 * Corta resumos ao limite, remove campos desconhecidos e impõe limites de listas.
 */
export function normalizarFicha(raw: unknown): FichaObra {
  const dados = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  // Resumo com corte no limite
  const resumoCru = limparTexto(dados.resumo);
  const resumo = resumoCru.slice(0, LIMITES_FICHA.resumo_max);

  // Contexto
  const contextoCru =
    dados.contexto && typeof dados.contexto === 'object'
      ? (dados.contexto as Record<string, unknown>)
      : {};
  const contexto: ContextoFicha = {
    epoca: limparTexto(contextoCru.epoca),
    local: limparTexto(contextoCru.local),
  };

  // Personagens
  const personagensCru = Array.isArray(dados.personagens) ? dados.personagens : [];
  const personagens: PersonagemFicha[] = [];
  for (const p of personagensCru) {
    if (p && typeof p === 'object') {
      const nome = limparTexto(p.nome);
      const papel = limparTexto(p.papel);
      if (nome.length > 0 || papel.length > 0) {
        personagens.push({ nome, papel });
        if (personagens.length >= LIMITES_FICHA.personagens) break;
      }
    }
  }

  return {
    genero: limparTexto(dados.genero),
    ano: limparInteiro(dados.ano),
    ano_morte_autor: limparInteiro(dados.ano_morte_autor),
    resumo,
    narrador: limparTexto(dados.narrador),
    estrutura: limparTexto(dados.estrutura),
    acontecimentos: limparListaStrings(dados.acontecimentos, LIMITES_FICHA.acontecimentos),
    estilo: limparTexto(dados.estilo),
    contexto,
    personagens,
    temas: limparListaStrings(dados.temas, LIMITES_FICHA.temas),
    simbolos: limparListaStrings(dados.simbolos, LIMITES_FICHA.simbolos),
    recursos: limparListaStrings(dados.recursos, LIMITES_FICHA.recursos),
    dilemas: limparListaStrings(dados.dilemas, LIMITES_FICHA.dilemas),
    leituras_criticas: limparListaStrings(dados.leituras_criticas, LIMITES_FICHA.leituras_criticas),
  };
}

/**
 * Verifica se a ficha cumpre os critérios mínimos para ser validada no catálogo:
 * Resumo presente, pelo menos uma personagem e pelo menos um tema.
 */
export function validarFichaParaCatalogo(ficha: FichaObra): boolean {
  return (
    ficha.resumo.trim().length > 0 &&
    ficha.personagens.length > 0 &&
    ficha.temas.length > 0
  );
}
