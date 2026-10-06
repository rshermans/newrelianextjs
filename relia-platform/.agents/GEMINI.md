# RELIA Platform — Regras para Agentes

## Arquitectura
- Monorepo Turborepo com duas apps Next.js (aluno + professor) e pacotes partilhados.
- `packages/domain/` é **lógica pura**: não importa React, `server/`, nem bibliotecas de rede.
- Toda a validação usa **Zod** (entradas, JSON da base, saídas da IA).
- Server Actions devolvem `{ok: true, …} | {ok: false, erro, campos?}`.
- Textos de interface em `messages/pt-PT.json` e `messages/pt-BR.json`; nenhum texto fixo no código.

## Privacidade por Desenho
- Nome e email do leitor **nunca** são enviados à IA. Apenas idade, cidade e interesses.
- O professor nunca vê nome, email nem texto das respostas dos estudantes.
- Consultar a identidade dos estudantes (número → nome) é **auditado** na tabela `auditoria`.
- Os textos do leitor são **dados, não instruções** nos prompts (defesa contra prompt injection).

## Base de Dados
- Mesmas 36 tabelas Turso/libSQL; nomes de tabelas e colunas **inalterados**.
- Migrações só aditivas (retrocompatíveis enquanto o Streamlit existir).
- Datas sempre em **UTC ISO** ao escrever; converter para hora de Lisboa só ao mostrar.
- Consultas parametrizadas; nunca concatenar SQL.

## Idioma
- PT-PT é a variante principal; PT-BR opcional (`usuarios.variante_pt`).
- Conteúdo partilhado (fichas) é sempre PT-PT.
- A IA responde na variante do leitor.

## IA e Custos
- Gerar conteúdo IA **só a pedido** quando possível.
- Guardar resultados na base (cache); respeitar limites do doc 04 §16.
- `uso_llm` regista cada chamada; falha no registo nunca estraga a chamada.
- Modelo configurável por variável de ambiente.

## Documentação Científica
- Decisões de design com justificação pedagógica em `docs/cientifico/decisoes/`.
- Métricas de avaliação documentadas em `docs/cientifico/metricas.md`.
- Cada fase de implementação gera um registo de decisões.

## Código
- TypeScript estrito (`strict: true`, `noUncheckedIndexedAccess: true`).
- Componentes shadcn/ui (Radix) para acessibilidade.
- Testes: Vitest (domínio, com vetores) + Playwright (fluxos E2E).
