# Conversão do RELIA para Next.js: dossiê de especificação

Este dossiê descreve **o que o RELIA é e faz hoje** (aplicação Streamlit em Python) com o detalhe necessário para a reconstruir em **React + Next.js**, com melhor desempenho, melhor UX e acesso mais direto à base de dados, e para a gerar **passo a passo com uma IA («vibe coding»)**.

Foi escrito a partir do código em `main`, não de memória: os esquemas, as estratégias, os itens do inquérito, os léxicos e os vetores de teste dos anexos foram **gerados a partir do código Python**.

> **Estado de maturidade (honesto).** Tudo o que está aqui foi testado em browser com servidores falsos (OpenAI, Open Library, Wikimedia Commons) e com a base de dados local. **Nunca foi testado** contra o Turso, a OpenAI, o SMTP e o Commons reais. Trate o comportamento descrito como «o que o código faz», não como «o que a produção já provou».

## Como usar este dossiê com uma IA

1. **Uma tarefa de cada vez.** O ficheiro [`09-plano-de-migracao.md`](09-plano-de-migracao.md) tem ~20 passos pela ordem certa; cada um traz o objetivo, o que ler, um **prompt pronto** e os **critérios de aceitação**.
2. **Dê à IA só o que é preciso:** o prompt do passo + os documentos que ele manda ler (normalmente 1 ou 2 das secções abaixo + 1 anexo). Os documentos são longos de propósito; não os cole todos de uma vez.
3. **Peça testes antes do código** nas regras de negócio: os [vetores de teste](anexos/vetores-de-teste.json) foram gerados do Python e provam que o TypeScript calcula o mesmo.
4. **Um commit por passo**, com os testes a passar. Se um passo falhar, volte atrás e divida-o.
5. **Não copie o legado.** [`11-problemas-conhecidos-e-divida.md`](11-problemas-conhecidos-e-divida.md) lista o que **não** se deve portar (código morto, defeitos, atalhos).

## Ordem de leitura

| # | Documento | Para quê |
|---|---|---|
| 01 | [Visão e produto](01-visao-e-produto.md) | O que é, para quem, glossário, âmbito, o que ficou de fora |
| 02 | [Fluxos e ecrãs](02-fluxos-e-ecras.md) | Todos os ecrãs, rotas propostas, estados e ações; fluxos em diagramas |
| 03 | [Modelo de dados](03-modelo-de-dados.md) | As 36 tabelas, relações, formas dos campos JSON, cascatas |
| 04 | [Regras de negócio](04-regras-de-negocio.md) | Níveis, pontos, motor de perguntas, relatório, linguística, professor, RGPD… com fórmulas |
| 05 | [IA: prompts e contratos](05-ia-prompts-e-contratos.md) | Cada chamada à IA: entrada, saída JSON, validação, limites, custos |
| 06 | [API e autorização](06-api-e-autorizacao.md) | Proposta de rotas/Server Actions e matriz de permissões |
| 07 | [Arquitetura Next.js](07-arquitetura-nextjs.md) | Stack recomendada, estrutura, desempenho, UX, acessibilidade, i18n |
| 08 | [Segurança e RGPD](08-seguranca-privacidade-rgpd.md) | Princípios, riscos, controlos |
| 09 | [Plano de migração e prompts](09-plano-de-migracao.md) | **Os passos para gerar o código** |
| 10 | [Testes e aceitação](10-testes-e-aceitacao.md) | Cenários, dados de arranque, paridade |
| 11 | [Problemas conhecidos e dívida](11-problemas-conhecidos-e-divida.md) | O que corrigir ao portar |

Anexos em [`anexos/`](anexos/): [`schema.sql`](anexos/schema.sql) (esquema atual), [`estrategias.md`](anexos/estrategias.md) (42 estratégias), [`prompts.md`](anexos/prompts.md) (textos dos prompts), [`inquerito-itens.md`](anexos/inquerito-itens.md), [`lexicos-linguisticos.md`](anexos/lexicos-linguisticos.md), [`vetores-de-teste.json`](anexos/vetores-de-teste.json), [`mapa-do-codigo.md`](anexos/mapa-do-codigo.md) (ficheiro Python → módulo Next.js), [`configuracoes.md`](anexos/configuracoes.md) (interruptores e segredos).

## Decisões já tomadas (não reabrir sem motivo)

- **Mesma base de dados (Turso/libSQL), mesmo esquema.** A migração não move dados: o Next.js lê e escreve as mesmas tabelas. Isto permite correr **as duas aplicações em paralelo** e voltar atrás.
- **As palavras-passe continuam válidas:** estão em bcrypt (`$2b$…`), que o Node lê (`bcryptjs`/`bcrypt`). Ninguém tem de repor a palavra-passe.
- **Tudo o que é reversível continua reversível:** os interruptores na tabela `configuracoes` mantêm-se (modo professor, catálogo, motor de perguntas, inquérito…).
- **PT-PT é a variante principal, com opção PT-BR** (campo `usuarios.variante_pt`); os textos fixos da aplicação estão em PT-PT.
- **Privacidade por desenho:** o nome e o email do leitor nunca vão para a IA; o professor só vê estudantes por número aleatório.
- **A IA nunca decide sozinha o que é facto:** as perguntas só usam **fichas validadas** das obras.

## Decisões em aberto (para si)

1. Hospedagem do Next.js (Vercel? outra?) e região da base de dados (latência: o Turso tem réplicas).
2. Biblioteca de autenticação: **Auth.js** (recomendado) ou implementação própria com sessões em cookie.
3. Se quer manter o modelo «uma conversa por roteiro» ou passar a permitir várias conversas por obra.
4. Onde mostrar as imagens do Wikimedia Commons aos leitores (hoje só na Administração).
5. Recuperação de palavra-passe: hoje **não funciona** (ver doc 11); desenhar de raiz.

## Glossário rápido

*Roteiro*: a leitura de uma obra por um leitor (uma por obra e leitor). *Ponto de Reflexão*: pergunta com nota. *Ficha*: dados factuais validados de uma obra, que alimentam as perguntas. *Estratégia*: tipo de pergunta (42). *Percurso de leitura*: o relatório. *Turma*, *professor*, *Aluno 154*: ver doc 04. Glossário completo em [01](01-visao-e-produto.md).
