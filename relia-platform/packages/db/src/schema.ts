import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

// ----------------------------------------------------------------------
// 1. Ações (Taxonomia de Bloom e pontuação)
// ----------------------------------------------------------------------
export const acoes = sqliteTable('acoes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nomesAcao: text('nomes_acao').notNull(),
  nivelBloom: text('nivel_bloom').notNull(),
  pontos: integer('pontos').notNull(),
  tipoResposta: text('tipo_resposta').notNull(),
  templatePergunta: text('template_pergunta').notNull(),
  respostasEsperadas: text('respostas_esperadas'),
});

// ----------------------------------------------------------------------
// 2. Auditoria
// ----------------------------------------------------------------------
export const auditoria = sqliteTable('auditoria', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quando: text('quando').default(sql`CURRENT_TIMESTAMP`),
  adminId: integer('admin_id'),
  adminEmail: text('admin_email'),
  acao: text('acao').notNull(),
  entidade: text('entidade'),
  entidadeId: text('entidade_id'),
  detalhes: text('detalhes'),
});

// ----------------------------------------------------------------------
// 3. Usuários (Leitores, Professores, Admins)
// ----------------------------------------------------------------------
export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uid: text('uid'),
  nome: text('nome').notNull(),
  email: text('email').unique().notNull(),
  senha: text('senha').notNull(),
  idade: integer('idade'),
  cidade: text('cidade'),
  interesses: text('interesses'),
  nivelEducacional: text('nivel_educacional'),
  habitoLeitura: text('habito_leitura'),
  opcaoCompartilhar: integer('opcao_compartilhar'),
  criadoEm: text('criado_em').default(sql`(DATETIME('now', 'localtime'))`),
  ultimaAtualizacao: text('ultima_atualizacao').default(sql`(DATETIME('now', 'localtime'))`),
  isAdmin: integer('is_admin').default(0),
  variantePt: text('variante_pt'),
  isProfessor: integer('is_professor').default(0),
});

// ----------------------------------------------------------------------
// 4. Obras Literárias
// ----------------------------------------------------------------------
export const obras = sqliteTable('obras', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  autor: text('autor').notNull(),
  anoPublicacao: integer('ano_publicacao'),
  genero: text('genero'),
  capa: text('capa'),
  noCatalogo: integer('no_catalogo').default(0),
});

// ----------------------------------------------------------------------
// 5. Roteiros de Leitura
// ----------------------------------------------------------------------
export const roteiros = sqliteTable('roteiros', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  obraId: integer('obra_id').notNull().references(() => obras.id),
  usuarioId: integer('usuario_id').references(() => usuarios.id),
  dataCriacao: text('data_criacao').default(sql`CURRENT_TIMESTAMP`),
  status: text('status').default('ativo'),
  resumo: text('resumo'),
});

// ----------------------------------------------------------------------
// 6. Mensagens de Chat (Roteiro)
// ----------------------------------------------------------------------
export const chatMessages = sqliteTable('chat_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roteiroId: integer('roteiro_id').notNull().references(() => roteiros.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 7. Checkpoints (Pontos de Reflexão)
// ----------------------------------------------------------------------
export const checkpoints = sqliteTable('checkpoints', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roteiroId: integer('roteiro_id').notNull().references(() => roteiros.id),
  acaoId: integer('acao_id').notNull(),
  nivelTaxonomia: text('nivel_taxonomia'),
  pergunta: text('pergunta').notNull(),
  resposta: text('resposta').notNull(),
  notaLlm: integer('nota_llm'),
  feedbackLlm: text('feedback_llm'),
  dataHora: text('data_hora').default(sql`(DATETIME('now', 'localtime'))`),
  formato: text('formato'),
  dados: text('dados'),
});

// ----------------------------------------------------------------------
// 8. Membros de Clubes de Leitura
// ----------------------------------------------------------------------
export const clubeMembros = sqliteTable(
  'clube_membros',
  {
    clube: text('clube').notNull(),
    usuarioId: integer('usuario_id').notNull(),
    entrouEm: text('entrou_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.clube, table.usuarioId] }),
  })
);

// ----------------------------------------------------------------------
// 9. Configurações da Aplicação
// ----------------------------------------------------------------------
export const configuracoes = sqliteTable('configuracoes', {
  chave: text('chave').primaryKey(),
  valor: text('valor'),
});

// ----------------------------------------------------------------------
// 10. Consentimentos (RGPD / Termos)
// ----------------------------------------------------------------------
export const consentimentos = sqliteTable(
  'consentimentos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    usuarioId: integer('usuario_id').notNull(),
    documento: text('documento').notNull(),
    versao: text('versao').notNull(),
    aceiteEm: text('aceite_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unq: uniqueIndex('unq_consentimento_usuario_doc_ver').on(
      table.usuarioId,
      table.documento,
      table.versao
    ),
  })
);

// ----------------------------------------------------------------------
// 11. Contactos / Mensagens de Suporte
// ----------------------------------------------------------------------
export const contactos = sqliteTable('contactos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  usuarioId: integer('usuario_id').references(() => usuarios.id),
  nome: text('nome'),
  email: text('email').notNull(),
  categoria: text('categoria').notNull(),
  assunto: text('assunto').notNull(),
  mensagem: text('mensagem').notNull(),
  estado: text('estado').default('novo'),
  notaAdmin: text('nota_admin'),
  tratadoEm: text('tratado_em'),
});

// ----------------------------------------------------------------------
// 12. Desafios Aceites
// ----------------------------------------------------------------------
export const desafiosAceites = sqliteTable(
  'desafios_aceites',
  {
    usuarioId: integer('usuario_id').notNull(),
    desafio: text('desafio').notNull(),
    aceiteEm: text('aceite_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.usuarioId, table.desafio] }),
  })
);

// ----------------------------------------------------------------------
// 13. Erros da Aplicação (Telemetria)
// ----------------------------------------------------------------------
export const errosApp = sqliteTable('erros_app', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quando: text('quando').default(sql`CURRENT_TIMESTAMP`),
  tela: text('tela'),
  tipo: text('tipo'),
  mensagem: text('mensagem'),
  usuarioId: integer('usuario_id'),
});

// ----------------------------------------------------------------------
// 14. Estratégias Pedagógicas
// ----------------------------------------------------------------------
export const estrategias = sqliteTable('estrategias', {
  id: integer('id').primaryKey(),
  nivelBloom: text('nivel_bloom').notNull(),
  verbo: text('verbo').notNull(),
  formato: text('formato').notNull(),
  foco: text('foco').notNull(),
  dificuldade: integer('dificuldade').default(1),
  pontos: integer('pontos').notNull(),
  exigeTextoIntegral: integer('exige_texto_integral').default(0),
  modelo: text('modelo'),
  criterios: text('criterios'),
  ativa: integer('ativa').default(1),
});

// ----------------------------------------------------------------------
// 15. Feedback Automatizado
// ----------------------------------------------------------------------
export const feedbackAutomatizado = sqliteTable('feedback_automatizado', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roteiroId: integer('roteiro_id').notNull().references(() => roteiros.id),
  resumoCheckpoints: text('resumo_checkpoints'),
  feedbackMotivacional: text('feedback_motivacional'),
  recomendacoes: text('recomendacoes'),
  insights: text('insights'),
  dataGeracao: text('data_geracao').default(sql`(DATETIME('now', 'localtime'))`),
});

// ----------------------------------------------------------------------
// 16. Fichas de Obra (Estudante/Público)
// ----------------------------------------------------------------------
export const fichasObra = sqliteTable('fichas_obra', {
  obraId: integer('obra_id').primaryKey(),
  dados: text('dados').notNull(),
  estado: text('estado').default('rascunho'),
  linkTexto: text('link_texto'),
  dominioPublico: integer('dominio_publico').default(0),
  geradoEm: text('gerado_em').default(sql`CURRENT_TIMESTAMP`),
  validadoEm: text('validado_em'),
  validadoPor: integer('validado_por'),
});

// ----------------------------------------------------------------------
// 17. Fichas do Professor
// ----------------------------------------------------------------------
export const fichasProfessor = sqliteTable(
  'fichas_professor',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    professorId: integer('professor_id').notNull(),
    obraId: integer('obra_id').notNull(),
    dados: text('dados').notNull(),
    estado: text('estado').default('rascunho'),
    linkTexto: text('link_texto'),
    dominioPublico: integer('dominio_publico').default(0),
    atualizadaEm: text('atualizada_em').default(sql`CURRENT_TIMESTAMP`),
    validadaEm: text('validada_em'),
  },
  (table) => ({
    unq: uniqueIndex('unq_fichas_prof_obra').on(table.professorId, table.obraId),
  })
);

// ----------------------------------------------------------------------
// 18. Tópicos do Fórum
// ----------------------------------------------------------------------
export const forumTopicos = sqliteTable('forum_topicos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  obraId: integer('obra_id').notNull().references(() => obras.id),
  usuarioId: integer('usuario_id').notNull().references(() => usuarios.id),
  titulo: text('titulo').notNull(),
  texto: text('texto').notNull(),
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 19. Respostas do Fórum
// ----------------------------------------------------------------------
export const forumRespostas = sqliteTable('forum_respostas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topicoId: integer('topico_id').notNull().references(() => forumTopicos.id),
  usuarioId: integer('usuario_id').notNull().references(() => usuarios.id),
  texto: text('texto').notNull(),
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 20. Imagens da Obra
// ----------------------------------------------------------------------
export const imagensObra = sqliteTable(
  'imagens_obra',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    obraId: integer('obra_id').notNull().references(() => obras.id),
    tipo: text('tipo').notNull(),
    titulo: text('titulo'),
    urlImagem: text('url_imagem').notNull(),
    urlMiniatura: text('url_miniatura'),
    urlPagina: text('url_pagina').notNull(),
    autor: text('autor'),
    licenca: text('licenca').notNull(),
    atribuicao: text('atribuicao').notNull(),
    escolhidaPor: integer('escolhida_por'),
    criadaEm: text('criada_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unq: uniqueIndex('unq_imagens_obra_url').on(table.obraId, table.urlImagem),
  })
);

// ----------------------------------------------------------------------
// 21. Infográficos
// ----------------------------------------------------------------------
export const infograficos = sqliteTable(
  'infograficos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    roteiroId: integer('roteiro_id').notNull().references(() => roteiros.id),
    chave: text('chave').notNull(),
    topico: text('topico'),
    dados: text('dados').notNull(),
    criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unq: uniqueIndex('unq_infograficos_roteiro_chave').on(
      table.roteiroId,
      table.chave
    ),
  })
);

// ----------------------------------------------------------------------
// 22. Participações em Inquérito
// ----------------------------------------------------------------------
export const inqueritoParticipacoes = sqliteTable(
  'inquerito_participacoes',
  {
    usuarioId: integer('usuario_id').notNull(),
    inquerito: text('inquerito').notNull(),
    versao: text('versao').notNull(),
    estado: text('estado').notNull(),
    data: text('data').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.usuarioId, table.inquerito, table.versao] }),
  })
);

// ----------------------------------------------------------------------
// 23. Respostas do Inquérito
// ----------------------------------------------------------------------
export const inqueritoRespostas = sqliteTable('inquerito_respostas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  inquerito: text('inquerito').notNull(),
  versao: text('versao').notNull(),
  data: text('data').notNull(),
  respostas: text('respostas').notNull(),
  sus: real('sus'),
  nps: integer('nps'),
  contexto: text('contexto'),
});

// ----------------------------------------------------------------------
// 24. Logs de Uso
// ----------------------------------------------------------------------
export const logsUso = sqliteTable('logs_uso', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id').references(() => usuarios.id),
  acao: text('acao').notNull(),
  dataHora: text('data_hora').default(sql`(DATETIME('now', 'localtime'))`),
  detalhes: text('detalhes'),
});

// ----------------------------------------------------------------------
// 25. Pedidos de Novas Obras
// ----------------------------------------------------------------------
export const pedidosObra = sqliteTable('pedidos_obra', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id').notNull(),
  titulo: text('titulo').notNull(),
  autor: text('autor').notNull(),
  estado: text('estado').default('pendente'),
  obraId: integer('obra_id'),
  nota: text('nota'),
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  resolvidoEm: text('resolvido_em'),
});

// ----------------------------------------------------------------------
// 26. Pedidos de Estatuto de Professor
// ----------------------------------------------------------------------
export const pedidosProfessor = sqliteTable('pedidos_professor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id').notNull(),
  instituicao: text('instituicao'),
  motivo: text('motivo'),
  estado: text('estado').default('pendente'),
  notaAdmin: text('nota_admin'),
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  resolvidoEm: text('resolvido_em'),
});

// ----------------------------------------------------------------------
// 27. Perguntas Customizadas do Professor
// ----------------------------------------------------------------------
export const perguntasProfessor = sqliteTable('perguntas_professor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  professorId: integer('professor_id').notNull(),
  obraId: integer('obra_id').notNull(),
  estrategiaId: integer('estrategia_id').notNull(),
  formato: text('formato'),
  dados: text('dados').notNull(),
  criadaEm: text('criada_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 28. Reescritas de Respostas (Desafio)
// ----------------------------------------------------------------------
export const reescritas = sqliteTable('reescritas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  checkpointId: integer('checkpoint_id').notNull(),
  roteiroId: integer('roteiro_id').notNull().references(() => roteiros.id),
  resposta: text('resposta').notNull(),
  fracao: real('fracao'),
  feedback: text('feedback'),
  criadaEm: text('criada_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 29. Relatórios de IA
// ----------------------------------------------------------------------
export const relatoriosIa = sqliteTable(
  'relatorios_ia',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    roteiroId: integer('roteiro_id').notNull().references(() => roteiros.id),
    nRespostas: integer('n_respostas').notNull(),
    conteudo: text('conteudo').notNull(),
    criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unq: uniqueIndex('unq_relatorios_ia_roteiro_respostas').on(
      table.roteiroId,
      table.nRespostas
    ),
  })
);

// ----------------------------------------------------------------------
// 30. Reportes de Erro em Perguntas
// ----------------------------------------------------------------------
export const reportesPergunta = sqliteTable(
  'reportes_pergunta',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
    checkpointId: integer('checkpoint_id'),
    usuarioId: integer('usuario_id'),
    roteiroId: integer('roteiro_id'),
    estrategiaId: integer('estrategia_id'),
    formato: text('formato'),
    motivo: text('motivo').notNull(),
    comentario: text('comentario'),
    pergunta: text('pergunta'),
    estado: text('estado').default('novo'),
    notaAdmin: text('nota_admin'),
  },
  (table) => ({
    unq: uniqueIndex('unq_reportes_pergunta_chk_user').on(
      table.checkpointId,
      table.usuarioId
    ),
  })
);

// ----------------------------------------------------------------------
// 31. Resumos Semanais
// ----------------------------------------------------------------------
export const resumosSemanais = sqliteTable('resumos_semanais', {
  semana: text('semana').primaryKey(),
  texto: text('texto').notNull(),
  estatisticas: text('estatisticas'),
  geradoEm: text('gerado_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 32. Mapa Conceitual do Roteiro
// ----------------------------------------------------------------------
export const roteiroMapa = sqliteTable('roteiro_mapa', {
  roteiroId: integer('roteiro_id').primaryKey(),
  dados: text('dados').notNull(),
  atualizadoEm: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 33. Turmas (Criadas por Professores)
// ----------------------------------------------------------------------
export const turmas = sqliteTable('turmas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  professorId: integer('professor_id').notNull(),
  nome: text('nome').notNull(),
  anoLetivo: text('ano_letivo'),
  codigo: text('codigo').unique().notNull(),
  ativa: integer('ativa').default(1),
  criadaEm: text('criada_em').default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 34. Membros da Turma (Estudantes)
// ----------------------------------------------------------------------
export const turmaMembros = sqliteTable(
  'turma_membros',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    turmaId: integer('turma_id').notNull().references(() => turmas.id),
    usuarioId: integer('usuario_id').notNull().references(() => usuarios.id),
    numero: integer('numero').notNull(),
    entrouEm: text('entrou_em').default(sql`CURRENT_TIMESTAMP`),
    partilha: integer('partilha').default(0),
  },
  (table) => ({
    unqTurmaUser: uniqueIndex('unq_turma_membros_turma_user').on(
      table.turmaId,
      table.usuarioId
    ),
    unqTurmaNum: uniqueIndex('unq_turma_membros_turma_num').on(
      table.turmaId,
      table.numero
    ),
  })
);

// ----------------------------------------------------------------------
// 35. Obras Atribuídas à Turma
// ----------------------------------------------------------------------
export const turmaObras = sqliteTable(
  'turma_obras',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    turmaId: integer('turma_id').notNull().references(() => turmas.id),
    obraId: integer('obra_id').notNull().references(() => obras.id),
    prazo: text('prazo'),
    orientacao: text('orientacao'),
    criadaEm: text('criada_em').default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    unq: uniqueIndex('unq_turma_obras_turma_obra').on(
      table.turmaId,
      table.obraId
    ),
  })
);

// ----------------------------------------------------------------------
// 36. Telemetria de Uso do LLM
// ----------------------------------------------------------------------
export const usoLlm = sqliteTable('uso_llm', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quando: text('quando').default(sql`CURRENT_TIMESTAMP`),
  funcao: text('funcao'),
  modelo: text('modelo'),
  tokensIn: integer('tokens_in'),
  tokensOut: integer('tokens_out'),
  duracaoMs: integer('duracao_ms'),
  ok: integer('ok'),
  erro: text('erro'),
});

// Inferência de Tipos Select e Insert
export type Usuario = typeof usuarios.$inferSelect;
export type NovoUsuario = typeof usuarios.$inferInsert;

export type Obra = typeof obras.$inferSelect;
export type NovaObra = typeof obras.$inferInsert;

export type Roteiro = typeof roteiros.$inferSelect;
export type NovoRoteiro = typeof roteiros.$inferInsert;

export type Checkpoint = typeof checkpoints.$inferSelect;
export type NovoCheckpoint = typeof checkpoints.$inferInsert;

export type Estrategia = typeof estrategias.$inferSelect;
export type NovaEstrategia = typeof estrategias.$inferInsert;

export type Turma = typeof turmas.$inferSelect;
export type NovaTurma = typeof turmas.$inferInsert;
