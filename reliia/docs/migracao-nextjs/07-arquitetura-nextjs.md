# 07. Arquitetura Next.js proposta

## Porquê mudar (o que dói hoje)

| Problema no Streamlit | Efeito | Resposta no Next.js |
|---|---|---|
| Cada clique **re-executa o ecrã inteiro** | lentidão, «piscar», estado frágil (chaves de widgets, `st.rerun`) | navegação por rotas; estado local só onde é preciso |
| **Um processo partilhado** por todos os leitores (GIL) | ~10–30 leitores simultâneos é o limite prático (`docs/escala.md`) | funções *serverless*/instâncias escaláveis; sessões sem estado |
| Respostas da IA só no fim | espera de 5–15 s sem feedback | **streaming** + estados de carregamento |
| Consultas à base repetidas e sem índices | latência por ecrã | consultas tipadas, índices, cache com revalidação |
| UI limitada (dataframes em canvas, diálogos, mobile) | UX média, testes difíceis | componentes acessíveis, tabelas reais, mobile-first |
| Sem API | impossível integrar / app móvel | Server Actions + Route Handlers + domínio testável |

## Stack recomendada

- **Next.js (App Router) + TypeScript estrito** — versão estável mais recente; React Server Components por omissão.
- **Base de dados:** a **mesma** (Turso/libSQL) com `@libsql/client`; **Drizzle ORM** (esquema obtido do `anexos/schema.sql`; migrações Drizzle só aditivas). Transações com `batch`/`transaction`.
- **Autenticação:** **Auth.js (v5) com Credentials** + sessões **JWT** em cookie `httpOnly`; `bcryptjs` para verificar os hashes existentes `$2b$`. *Runtime Node* (não Edge) nas rotas que usam bcrypt.
- **Validação:** **Zod** em todo o lado (entradas, JSON da base, saídas da IA).
- **UI:** **Tailwind CSS + shadcn/ui** (Radix) — acessibilidade e tema escuro; `lucide-react` para ícones; **Sonner** para toasts.
- **Formulários:** React Hook Form + Zod.
- **Gráficos:** **Recharts** (ou visx) para linhas/barras/funil/mapa de calor; o **mapa mental** e o **grafo de conceitos** passam a **componentes SVG React** (hoje o SVG é gerado em Python em `utils/visuais.py`, `views/professor_relatorio.py`).
- **Markdown:** `react-markdown` + `rehype-sanitize` (as respostas da IA e as fichas são Markdown/texto).
- **Tabelas:** TanStack Table (substitui `st.dataframe`; **filtrar/ordenar/paginar no servidor** nas tabelas grandes da administração).
- **IA:** SDK oficial `openai` (Node), com **streaming** e *structured outputs*; uma única função `chatCompletion()` que replica `utils/openai_client.py` (variante, parâmetros por modelo, registo em `uso_llm`).
- **Email:** Nodemailer (SMTP atual) ou Resend; **envio fora do pedido** (ver abaixo).
- **Tarefas em segundo plano:** `after()` do Next.js para trabalhos curtos; fila (Inngest/QStash/Vercel Queues) para envio de email e geração demorada.
- **Limites de taxa:** Upstash Ratelimit (Redis) **ou** tabela na própria base; os limites do doc 04 §16 aplicam-se **no servidor**.
- **i18n:** `next-intl` com `pt-PT` (predefinição) e `pt-BR`; os textos fixos em ficheiros de mensagens (hoje estão espalhados no código Python em PT-PT).
- **Observabilidade:** logging estruturado (pino), **Sentry** (sem dados pessoais), `uso_llm` e `erros_app` mantidos.
- **Testes:** **Vitest** (domínio, com os vetores do anexo) + **Playwright** (fluxos) + servidor falso da OpenAI/Open Library/Commons (MSW).
- **Qualidade:** ESLint, Prettier, `tsc --noEmit`, validação de variáveis de ambiente com Zod (`env.ts`).
- **Alojamento:** Vercel (ou outro com Node), região **próxima da réplica do Turso** (latência!). Rever o plano gratuito vs. limites de função (a geração por IA pode demorar → *maxDuration*).

## Estrutura de pastas sugerida

```
src/
  app/                       rotas (App Router)
    (publico)/entrar, registar, termos, privacidade, contacto
    (leitor)/ page.tsx(início), obras, obras/[obraId]/{roteiro,reflexao,percurso}, reescrita/[id], area-do-leitor, perfil, turmas, inquerito
    (professor)/professor/...
    (admin)/admin/{painel,pedagogia,utilizadores,obras,catalogo,perguntas,professores,contactos,inquerito,moderacao,auditoria,sistema}
    api/{chat,me/dados,cron/*,...}
  domain/                    LÓGICA PURA (sem React, sem rede), 1:1 com utils/*.py
    niveis.ts  fichas.ts  perguntas/{construtores,selecao,correcao}.ts  relatorio.ts
    linguistica.ts  reescrita.ts  inquerito.ts  turmas.ts  imagens.ts  conquistas.ts
  server/
    db/{client.ts, schema.ts, queries/*.ts}     acesso à base (Drizzle)
    ai/{client.ts, prompts/*.ts, contratos/*.ts}
    auth/ email/ ratelimit/ audit/ jobs/
  components/                UI reutilizável (shadcn) + gráficos + mapa mental
  lib/                       utilitários, formatadores PT (vírgula decimal), datas UTC→Lisboa
  messages/{pt-PT,pt-BR}.json
tests/{unit,e2e,fixtures}
```

**Regra de ouro:** `domain/` não importa nada de `server/` nem de React. Os testes do domínio usam os **vetores** de `anexos/vetores-de-teste.json`.

## Acesso à base de dados (o que melhora)

- **Consultas pontuais** por página (Server Components), em vez de reconstruir estado em sessão. Onde o Python faz várias consultas por ecrã (p. ex. `listar_leituras`, `estudantes_da_turma`), manter **uma consulta** com subconsultas/joins e **sem N+1**.
- **Índices** (doc 03) e **paginação** em `chat_messages`, `checkpoints`, tabelas de administração.
- **Cache** com revalidação por etiqueta para dados quase estáticos: `configuracoes`, `estrategias`, `fichas_obra` e catálogo, `obras_do_catalogo`. A Administração, ao gravar, **revalida** as etiquetas. Os Python usam TTLs de 5–60 s (`motor_perguntas` 5 s, `modo_professor` 10 s, pendências 60 s, definições 30 s): manter ordens de grandeza equivalentes.
- **Transações** nas operações multi-tabela (cascatas, entrar na turma com sorteio do número, juntar obras). A tentativa com colisão do número (dois a entrar ao mesmo tempo) deve **repetir**.
- **Ligações:** `@libsql/client` por pedido (HTTP) ou réplica embutida; o Python tem lógica de **reconexão** em erros de stream expirado (`db_compat.py`); o cliente HTTP evita o problema.
- **Datas:** guardar sempre **UTC ISO** (a base mistura UTC e «hora local do servidor»; doc 03).
- **Segurança:** consultas parametrizadas (o ORM trata); nunca concatenar SQL.

## Desempenho: orçamento e táticas

- **Alvos (Web Vitals):** LCP < 2,5 s, INP < 200 ms, CLS < 0,1 em 4G; **primeira resposta do chat em < 1,5 s** (streaming).
- **Servidor primeiro:** páginas como Server Components; dados críticos a carregar em paralelo (`Promise.all`); `Suspense` com *skeletons* para blocos lentos (relatório, voz, leitura IA).
- **Pré-carregar** (*prefetch*) as rotas prováveis (do Início para o roteiro, do roteiro para a reflexão).
- **Imagens:** `next/image` com `remotePatterns` para `covers.openlibrary.org` e `upload.wikimedia.org`; capas guardadas em `obras.capa`.
- **Gráficos e mapa mental:** carregados com `dynamic()` só nas páginas que os usam (o Python já faz *lazy import* de bibliotecas pesadas por isso).
- **IA:** nunca bloquear a navegação; mostrar progresso; pré-gerar o resumo da obra **quando o leitor escolhe a obra** (hoje só ao abrir o roteiro).
- **Custos de IA** são o limite real: respeitar os limites e o `uso_llm`.

## Melhorias de UX (para além da paridade)

1. **Chat:** resposta em *streaming*, estado «a escrever…», botão «Parar», copiar resposta, tópicos como *chips* clicáveis, histórico paginado, atualização otimista da mensagem do leitor.
2. **Ponto de Reflexão:** uma pergunta por ecrã com progresso e temporizador opcional, **rascunho guardado** da resposta aberta (localStorage), contador de palavras, teclado (Enter/atalhos), animações discretas de acerto, subida de nível celebrada sem bloquear.
3. **Percurso:** gráficos interativos (hover, filtros), «Próximo passo» fixo em cima, **imprimir/guardar PDF** do percurso (não existe hoje), partilha opcional com o professor com *feedback* visível do estado.
4. **Mobile-first:** barra de navegação inferior (Início, Obras, Ler, Percurso, Perfil) em ecrãs pequenos; barra lateral só em ecrã largo.
5. **Acessibilidade WCAG 2.2 AA:** foco visível, contrastes, etiquetas em campos, `aria-live` para toasts e resultados, não depender só de cor (o gráfico de níveis usa laranja/azul/cinzento + texto), reduzir movimento.
6. **Estados:** *skeletons*, vazios com ação («Ainda sem leituras → Explorar obras»), erros com «tentar de novo» sem perder o texto.
7. **Administração:** tabelas com filtros no servidor, ações em lote, desfazer onde possível, pesquisa global; painel ao vivo com *polling* de 30 s.
8. **Ficha e professor:** editor de ficha com **pré-visualização das perguntas** que a ficha permite, validação inline, comparação ficha do professor × catálogo.
9. **Conteúdo legal e consentimento:** páginas legíveis, aceite com resumo em linguagem simples, histórico de versões aceites no perfil.
10. **Tema escuro**, `prefers-reduced-motion`, e **PWA** (instalável; *offline* só para o último resumo lido).

## Segredos e configuração (ambiente)

Replicar os segredos atuais (anexo `configuracoes.md`): `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_REASONING_EFFORT?`, `EMAIL_HOST/PORT/USER/PASSWORD/USE_TLS`, `ADMIN_EMAILS`, `PRICE_IN_PER_M/PRICE_OUT_PER_M?`, `NEXTAUTH_SECRET`, `COMMONS_API_URL?` (para testes). **Nada disto no repositório.** Variáveis de teste (`OPENLIBRARY_URL`, `COMMONS_API_URL`, `OPENAI_BASE_URL`) permitem apontar a servidores falsos.

## Estratégia de convivência (sem «big bang»)

1. **As duas apps usam a mesma base** (esquema inalterado) durante a migração; o interruptor por funcionalidade fica na `configuracoes` e/ou no *proxy* de entrada.
2. Migrar por **fatias verticais** (doc 09): primeiro o que é só leitura (páginas legais, catálogo), depois autenticação, depois leitura/chat, reflexão, percurso, turmas, administração.
3. **Paridade verificável:** cada fatia só fecha quando os vetores do domínio passam e o fluxo Playwright equivalente passa nas duas apps.
4. **Reversão:** voltar a apontar o domínio para o Streamlit; nenhuma migração de dados destrutiva.
