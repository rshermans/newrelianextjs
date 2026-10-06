/**
 * Constantes do RELIA Platform
 *
 * Valores que não mudam entre ambientes.
 * Configurações dinâmicas estão na tabela `configuracoes` da base de dados.
 */

/** Níveis de Bloom, por ordem */
export const NIVEIS_BLOOM = [
  'Lembrar',
  'Compreender',
  'Aplicar',
  'Analisar',
  'Avaliar',
  'Criar',
] as const;

export type NivelBloom = (typeof NIVEIS_BLOOM)[number];

/** Formatos de pergunta */
export const FORMATOS_PERGUNTA = [
  'escolha_multipla',
  'verdadeiro_falso',
  'completar',
  'associar',
  'ordenar',
  'resposta_curta',
  'resposta_aberta',
] as const;

export type FormatoPergunta = (typeof FORMATOS_PERGUNTA)[number];

/** Limites da aplicação */
export const LIMITES = {
  /** Idade mínima para registo */
  IDADE_MINIMA: 14,
  /** Idade máxima para registo */
  IDADE_MAXIMA: 100,
  /** Máximo de pedidos de obra pendentes por leitor */
  MAX_PEDIDOS_OBRA: 5,
  /** Máximo de mensagens de contexto no chat */
  MAX_MENSAGENS_CONTEXTO: 10,
  /** Máximo de caracteres na mensagem de chat */
  MAX_CARACTERES_CHAT: 1000,
  /** Máximo de turmas por professor */
  MAX_TURMAS_PROFESSOR: 20,
  /** Máximo de perguntas do professor por obra */
  MAX_PERGUNTAS_PROFESSOR: 60,
  /** Número mínimo do estudante na turma */
  NUMERO_ESTUDANTE_MIN: 100,
  /** Número máximo do estudante na turma */
  NUMERO_ESTUDANTE_MAX: 999,
  /** Máximo de reescritas por dia */
  MAX_REESCRITAS_DIA: 10,
  /** Máximo de tentativas de reescrita por resposta */
  MAX_TENTATIVAS_REESCRITA: 2,
  /** Contactos por hora por email */
  MAX_CONTACTOS_HORA: 3,
  /** Contactos por dia por email */
  MAX_CONTACTOS_DIA: 10,
  /** Tempo mínimo para enviar contacto (segundos) */
  TEMPO_MINIMO_CONTACTO: 4,
  /** Máximo de caracteres no comentário de reporte */
  MAX_CARACTERES_REPORTE: 500,
  /** Itens por página no catálogo */
  CATALOGO_POR_PAGINA: 12,
  /** Mínimo de estudantes para cobertura da ficha no relatório de turma */
  MIN_ESTUDANTES_COBERTURA: 5,
  /** Mínimo de respostas para leitura IA */
  MIN_RESPOSTAS_LEITURA_IA: 3,
  /** Mínimo de palavras para leitura IA */
  MIN_PALAVRAS_LEITURA_IA: 60,
  /** Máximo de leituras IA por dia */
  MAX_LEITURAS_IA_DIA: 10,
  /** Prazo para resposta a pedidos de dados (dias) */
  PRAZO_PEDIDO_DADOS: 30,
  /** Mínimo de respostas por grupo no inquérito */
  MIN_RESPOSTAS_GRUPO_INQUERITO: 5,
} as const;

/** Botões de interesse no roteiro e os seus níveis de Bloom */
export const BOTOES_INTERESSE = {
  'Contexto Histórico': ['Lembrar', 'Compreender'],
  Curiosidades: ['Lembrar', 'Compreender'],
  'Impacto Cultural': ['Analisar', 'Avaliar'],
  Estilo: ['Analisar', 'Avaliar'],
  'Questões Intrigantes': ['Avaliar', 'Criar'],
  Moral: ['Avaliar', 'Criar'],
  Personagens: ['Compreender', 'Analisar'],
} as const;

/** Motivos de reporte de pergunta */
export const MOTIVOS_REPORTE = [
  'Pergunta confusa',
  'Resposta incorreta',
  'Conteúdo inadequado',
  'Não relacionada com a obra',
  'Dificuldade inadequada',
  'Outro',
] as const;

/** Código de convite: caracteres permitidos (sem 0/O/1/I) */
export const CHARSET_CODIGO_TURMA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Comprimento do código de convite */
export const TAMANHO_CODIGO_TURMA = 6;
