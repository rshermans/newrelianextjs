# 09. Plano de migração passo a passo (para *vibe coding*)

Cada passo é uma **fatia vertical** com: objetivo, o que ler, um **prompt pronto** e critérios de aceitação. Siga a ordem; só avance quando os critérios passarem (doc 10).

## Como usar cada passo
1. Abra uma conversa nova com a IA de código.
2. Dê-lhe **o README, os documentos indicados em «Ler»** e os anexos referidos (cole ou anexe os ficheiros).
3. Cole o **Prompt**. Peça para **escrever primeiro os testes**.
4. Corra os critérios; faça *commit* por passo (`git tag passo-NN`).
5. Se a IA divergir das regras, **o documento 04 e os vetores mandam**.

## Regras para todos os prompts
- «Mantém os nomes de tabelas e colunas do `anexos/schema.sql`; só migrações aditivas.»
- «`domain/` não importa React nem `server/`.»
- «Textos de interface em `messages/pt-PT.json`; nada fixo no código.»
- «Valida entradas e saídas da IA com Zod; nunca enviar nome/email à IA.»
- «Server Actions devolvem `{ok:true,…}|{ok:false,erro,campos?}`.»

## Visão geral
| # | Passo |
|---|---|
| 01 | Arranque do projeto |
| 02 | Camada de base de dados |
| 03 | Domínio: níveis, pontos e fichas |
| 04 | Autenticação e sessão |
| 05 | Shell, navegação e i18n |
| 06 | Páginas legais, consentimento e perfil |
| 07 | Catálogo, pesquisa e escolha de obra |
| 08 | Cliente de IA e contratos |
| 09 | Roteiro e chat com streaming |
| 10 | Mapa mental e infográfico |
| 11 | Motor de perguntas (domínio) |
| 12 | Ponto de Reflexão (ecrã) |
| 13 | Percurso: métricas e gráficos |
| 14 | Linguística e leitura IA |
| 15 | Email do percurso e reescrita |
| 16 | Comunidade e área do leitor |
| 17 | Turmas (estudante) e pedido de professor |
| 18 | Professor |
| 19 | Contacto e inquérito |
| 20 | Administração |
| 21 | Imagens, desempenho e observabilidade |
| 22 | Paralelo, cutover e endurecimento |

## Passo 01. Arranque do projeto

**Objetivo:** Projeto Next.js (App Router, TS estrito), Tailwind, shadcn/ui, ESLint, Prettier, Vitest, Playwright, `env.ts` com Zod, CI.

**Ler:** 07 (stack e pastas), anexos/configuracoes.md

**Prompt:**

> Cria o projeto Next.js com a estrutura de pastas do doc 07, `env.ts` (Zod) com as variáveis de anexos/configuracoes.md, scripts `lint`, `typecheck`, `test`, `e2e`, e uma página inicial. Não ligues à base ainda.

**Aceitação:** `npm run lint && npm run typecheck && npm test` a verde; app arranca; faltar uma variável obrigatória falha com mensagem clara.

## Passo 02. Camada de base de dados

**Objetivo:** Cliente libSQL + Drizzle com o esquema atual; bases de teste.

**Ler:** 03, anexos/schema.sql

**Prompt:**

> Gera `server/db/schema.ts` (Drizzle) a partir de anexos/schema.sql **sem alterar nomes de tabelas/colunas**. Cria `client.ts` (Turso por pedido) e um *helper* de teste que cria uma base libSQL em ficheiro a partir do schema.sql. Adiciona os índices recomendados do doc 03 como migração **aditiva**.

**Aceitação:** Teste de integração cria a base de raiz e de uma cópia 'antiga' sem erros; todas as 36 tabelas mapeadas; índices criados.

## Passo 03. Domínio: níveis, pontos e fichas

**Objetivo:** `domain/niveis.ts`, `domain/fichas.ts` puros.

**Ler:** 04 §1–3, anexos/vetores-de-teste.json, mapa-do-codigo

**Prompt:**

> Implementa `domain/niveis.ts` e `domain/fichas.ts` conforme o doc 04 §1–3. Cria os testes Vitest que carregam os blocos correspondentes de vetores-de-teste.json e comparam exatamente. Sem imports de React nem de `server/`.

**Aceitação:** Todos os vetores de níveis/fichas passam; cobertura >90 % no módulo.

## Passo 04. Autenticação e sessão

**Objetivo:** Auth.js Credentials, bcryptjs compatível com `$2b$`, papéis relidos da base.

**Ler:** 02 §1, 06 (auth), 08 §3

**Prompt:**

> Implementa registo e entrada: valida (idade ≥14, email único, campos do doc 02 §1), `bcryptjs` verifica hashes `$2b$` existentes, sessão JWT com os campos do doc 06. Limite de taxa no login. Server Actions devolvem `{ok}`.

**Aceitação:** Um utilizador criado no Streamlit entra no Next.js; senha errada e email inexistente dão a mesma mensagem; teste E2E de registo/entrada.

## Passo 05. Shell, navegação e i18n

**Objetivo:** Layout, barra lateral/inferior, tema, `next-intl` pt-PT/pt-BR, guardas por papel.

**Ler:** 02 (mapa de rotas, sidebar), 07 (UX)

**Prompt:**

> Cria o layout com barra lateral (desktop) e barra inferior (mobile), tema claro/escuro, `next-intl` e *middleware* de guarda por papel (visitante/leitor/professor/admin). Textos em `messages/`.

**Aceitação:** Rotas protegidas redirecionam; axe sem violações sérias; navegação por teclado.

## Passo 06. Páginas legais, consentimento e perfil

**Objetivo:** Termos, privacidade, aceite por versão, perfil, exportar/eliminar dados.

**Ler:** 02, 04 §11, 08

**Prompt:**

> Implementa as páginas legais (texto de anexos/messages a extrair do `utils/legal.py`), aceite por versão (tabela `consentimentos`), perfil (só campos não vazios), `GET /api/me/dados` e eliminar conta em cascata.

**Aceitação:** Aceitar uma vez não repete na mesma versão; mudar a versão volta a pedir; exportar devolve JSON completo; eliminar remove tudo (teste de integração).

## Passo 07. Catálogo, pesquisa e escolha de obra

**Objetivo:** Lista com filtros e paginação (12), pesquisa por IA, escolher/continuar, pedir obra.

**Ler:** 02, 04 §4, 05 (#5), 06

**Prompt:**

> Implementa `/obras` (catálogo, filtros, paginação), `obra_permitida`, pesquisa por IA (contrato #5, cache 1 h), escolher obra (cria roteiro) e pedir obra (≤5 pendentes). Capas com `next/image`.

**Aceitação:** Catálogo ativo bloqueia obras fora dele conforme interruptores; E2E de escolher obra.

## Passo 08. Cliente de IA e contratos

**Objetivo:** `server/ai/client.ts`, prompts, validação Zod, registo `uso_llm`, servidor falso.

**Ler:** 05, anexos/prompts.md, 08

**Prompt:**

> Implementa `chatCompletion()` (variante, parâmetros por modelo, `max_completion_tokens` ≥4000, registo em `uso_llm` que nunca falha) e os prompts **copiados verbatim** de anexos/prompts.md. Cria MSW para testes. Cria `perfilParaIA()` que devolve só idade/cidade/interesses.

**Aceitação:** Teste prova que nenhum pedido contém nome/email; respostas malformadas tratadas; falha não perde dados.

## Passo 09. Roteiro e chat com streaming

**Objetivo:** Resumo, botões de interesse, pergunta livre, tópicos, SSE.

**Ler:** 02, 05 (#1–4), 06, 07 (UX chat)

**Prompt:**

> Implementa `/obras/[id]/roteiro` e `POST /api/chat` com streaming SSE; grava a resposta completa no fim em `chat_messages`; últimas 10 mensagens como contexto; limite de 1000 car.; botão Parar; pré-gerar o resumo ao escolher a obra.

**Aceitação:** Primeira resposta <1,5 s com IA falsa; histórico paginado; sem dupla gravação; E2E do chat.

## Passo 10. Mapa mental e infográfico

**Objetivo:** Componentes SVG React; contratos #11 e #12.

**Ler:** 05 (#11–12), 03 (JSON), 02

**Prompt:**

> Implementa o mapa mental (lotes de 6, ≤3 pedidos, limites do doc 05) e o infográfico como componentes SVG React acessíveis; guarda em `roteiro_mapa` e `infograficos`.

**Aceitação:** Falha da IA mantém o mapa a crescer com a pergunta como rótulo; snapshot visual; texto alternativo.

## Passo 11. Motor de perguntas (domínio)

**Objetivo:** 42 estratégias, construtores objetivos, seleção adaptativa, correção.

**Ler:** 04 §3–4, anexos/estrategias.md, vetores-de-teste.json

**Prompt:**

> Implementa `domain/perguntas/*`: construtores objetivos sem IA, seleção (adaptativa pela última fração <0,5, banco do professor com prioridade, `ficha_efetiva`), correção de objetivas e cálculo de pontos com decimais. Tudo puro e testado com os vetores.

**Aceitação:** Vetores 100 %; nenhuma estratégia escolhida sem dados suficientes na ficha.

## Passo 12. Ponto de Reflexão (ecrã)

**Objetivo:** Fluxo de uma pergunta por ecrã, avaliação aberta (#7–#9), pontos, subida de nível, reporte.

**Ler:** 02, 04, 05, 06, 07 (UX)

**Prompt:**

> Implementa `/obras/[id]/reflexao`: `proximaPergunta` (não envia o gabarito), `responder` (corrige no servidor), avaliação aberta via IA (critérios 0–2), `registar_resposta`, subida de nível, rascunho local, `reportarPergunta`. Desativar Enviar enquanto espera.

**Aceitação:** A resposta certa não aparece no payload; sem duas respostas gravadas; E2E certa/errada/aberta/subida.

## Passo 13. Percurso: métricas e gráficos

**Objetivo:** Fração, tendência, nível a reforçar, gráficos, próximo passo.

**Ler:** 04 §5, vetores-de-teste.json, 07

**Prompt:**

> Implementa `domain/relatorio.ts` e `/obras/[id]/percurso` com Recharts: fração, tendência (OLS, n≥5, ±0,10), nível a reforçar (<0,6), 'próximo passo'.

**Aceitação:** Vetores de métricas 100 %; gráficos acessíveis (texto + cor).

## Passo 14. Linguística e leitura IA

**Objetivo:** MATTR, marcadores, cobertura, KWIC, rede; contrato #10; cache.

**Ler:** 04 §6–7, anexos/lexicos-linguisticos.md, 05 (#10)

**Prompt:**

> Implementa `domain/linguistica.ts` com os léxicos do anexo e a 'Leitura do percurso' (≥3 respostas e ≥60 palavras; cache por `(roteiro, n_respostas)`; ≤10/dia; falha não conta).

**Aceitação:** Vetores linguísticos 100 %; limite diário testado; JSON inválido não grava.

## Passo 15. Email do percurso e reescrita

**Objetivo:** Envio em segundo plano; desafio de reescrita sem pontos.

**Ler:** 04 §8–9, 05 (#9)

**Prompt:**

> Implementa o envio do percurso por email (fila/`after()`, SMTP falso nos testes) e o desafio de reescrita (`_chave` sem acentos/pontuação para detetar duplicados; reavaliação; sem pontos).

**Aceitação:** Duplicado recusado; email enviado fora do pedido; E2E.

## Passo 16. Comunidade e área do leitor

**Objetivo:** Fórum, clubes, desafios, conquistas.

**Ler:** 02, 04 §10

**Prompt:**

> Implementa `/area-do-leitor` com fórum, clubes e desafios; apagar só autor/admin; níveis mínimos usando o limiar do motor ativo (corrige o 92 fixo).

**Aceitação:** Permissões testadas; E2E de tópico e resposta.

## Passo 17. Turmas (estudante) e pedido de professor

**Objetivo:** Entrar/sair, partilha, pedir acesso.

**Ler:** 02, 04 §13, 06

**Prompt:**

> Implementa `/turmas`: entrar com código, número aleatório único 100–999 por turma (transação com repetição em colisão), partilha opt-in, pedir acesso de professor (um pendente).

**Aceitação:** Dois a entrar ao mesmo tempo nunca partilham número; modo professor desligado esconde tudo.

## Passo 18. Professor

**Objetivo:** Turmas, obras, fichas, banco de perguntas, relatório de turma.

**Ler:** 02, 04 §13, 06, 08

**Prompt:**

> Implementa `/professor/*`: criar turma, código, obras, estudantes **só por número**, ficha (rascunho IA, validada), banco de perguntas (propor/aprovar/aberta/retirar), relatório da turma (cobertura ≥5) e CSV. Consultas nunca selecionam identidade.

**Aceitação:** Teste de privacidade do doc 10 §4; ficha do professor só vale para as suas turmas.

## Passo 19. Contacto e inquérito

**Objetivo:** Formulário anti-abuso; inquérito interno anónimo.

**Ler:** 04 §12, anexos/inquerito-itens.md

**Prompt:**

> Implementa contacto (anti-abuso, email em segundo plano) e inquérito (itens do anexo, convite após N respostas, anónimo, resultados com grupos n<5 escondidos).

**Aceitação:** Agregados corretos com os vetores; recusa não repete cedo.

## Passo 20. Administração

**Objetivo:** 11 secções com tabelas no servidor, auditoria e CSV.

**Ler:** 02 (admin), 06, 08

**Prompt:**

> Implementa `/admin/*`: painel ao vivo (30 s), pedagogia, utilizadores (nunca ficar sem admin), obras, catálogo/fichas (+ imagens Commons, licenças validadas), perguntas/reportes, professores (aprovar/recusar), contactos, inquérito, moderação, auditoria, sistema (interruptores). Toda a ação grava auditoria; revelar identidade é auditado.

**Aceitação:** Só admin acede (403 aos outros); tabelas filtram no servidor; CSV exportam; interruptores revalidam a cache.

## Passo 21. Imagens, desempenho e observabilidade

**Objetivo:** Commons no editor da ficha, cache, Sentry, cron de limpeza, PWA.

**Ler:** 04 §14, 07, 08

**Prompt:**

> Finaliza o seletor de imagens (apenas admin), orçamento de desempenho, Sentry sem dados pessoais, `GET /api/cron/limpeza`, PWA básica.

**Aceitação:** Lighthouse dentro do orçamento; retenção funciona.

## Passo 22. Paralelo, cutover e endurecimento

**Objetivo:** Correr as duas apps na mesma base, comparar, trocar o domínio.

**Ler:** 07 (convivência), 08 §6, 10

**Prompt:**

> Prepara staging com serviços reais, executa o teste de fumo, a lista de verificação do doc 08 §6 e o plano de reversão (voltar o domínio ao Streamlit).

**Aceitação:** Checklist completa; um ensaio de reversão bem-sucedido.
