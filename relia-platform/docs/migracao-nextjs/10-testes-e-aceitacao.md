# 10. Testes e critérios de aceitação

A migração só avança quando os testes da fatia passam. **Não existe suite de testes no repositório Python**: os vetores em [`anexos/vetores-de-teste.json`](anexos/vetores-de-teste.json) foram gerados do código atual e são a **fonte da verdade da paridade**.

## 1. Pirâmide

| Nível | Ferramenta | O que cobre |
|---|---|---|
| Unitário (domínio) | Vitest | níveis, pontos, fichas, motor, correção, métricas, linguística, reescrita (vetores) |
| Contrato da IA | Vitest + MSW | JSON bem formado, malformado, vazio, `impossivel`, `desconhecida` |
| Integração | Vitest + libSQL em ficheiro temporário | queries, cascatas, transações, números únicos |
| E2E | Playwright | fluxos do doc 02 nas 3 personas |
| Segurança/privacidade | Vitest + Playwright | secção 4 |
| Acessibilidade | `@axe-core/playwright` | sem violações sérias nas páginas-chave |
| Desempenho | Lighthouse CI | orçamento do doc 07 |

## 2. Paridade do domínio

Para cada bloco de `vetores-de-teste.json`: carregar o JSON, aplicar a função TS e comparar **exatamente** (decimais com tolerância 1e-9; textos iguais). Se um vetor falhar, **o TS está errado** (salvo decisão documentada em doc 11). Atenção ao arredondamento de `formatar_pontos` (Python arredonda 0,25→«0,2»; decidir e documentar se se corrige).

## 3. Fluxos E2E obrigatórios

1. **Registo → termos → perfil → entrar** (idade <14 recusada; email repetido recusado).
2. **Aceitar termos uma vez** e não voltar a aparecer no login seguinte (mesma versão).
3. **Escolher obra → resumo → chat** (botão de interesse, pergunta livre, tópico sugerido).
4. **Ponto de Reflexão:** objetiva certa/errada, aberta com avaliação (IA falsa), subida de nível.
5. **Percurso:** gráficos, linguística (≥3 respostas e ≥60 palavras), leitura IA (cache e limite diário), enviar por email (SMTP falso).
6. **Reescrita:** sem pontos; duplicado («Acho que sim.» = «acho QUE sim») recusado.
7. **Comunidade:** tópico, resposta, clube, desafio; apagar só autor/admin.
8. **Turma:** pedir professor → admin aprova → professor cria turma → estudante entra (número único 100–999) → partilha → professor vê **só o número**.
9. **Ficha do professor** só vale para as suas turmas; prioridade sobre a do catálogo.
10. **Admin:** catálogo, fichas (com imagens Commons), utilizadores (nunca ficar sem admin), auditoria, inquérito (grupos n<5), contactos.
11. **Inquérito:** convite após N respostas; anónimo; recusar não repete antes do tempo.
12. **Contacto:** anti-abuso e email em segundo plano.

## 4. Testes de privacidade (bloqueantes)

- **Nenhum pedido à OpenAI contém nome ou email** (gravar todos os pedidos do servidor falso e procurar o nome/email de teste em **todos** os fluxos).
- **Professor:** as respostas das consultas de professor não contêm `usuario_id`, `nome`, `email`; endpoint de identidade devolve 403.
- Estudante não vê percursos de outros; 404 em recursos alheios.
- Com `partilha=0` o professor não vê texto.
- Cobertura da turma e grupos do inquérito escondidos com n<5.
- A resposta certa não vai ao cliente antes de responder (inspecionar payload).
- Exportar e eliminar conta funcionam; cascatas removem tudo.
- Logs e Sentry sem email/texto de leitor.

## 5. Ambientes de teste

- Servidor falso (MSW) para **OpenAI**, **Open Library**, **Wikimedia Commons**, SMTP falso (MailHog).
- Base de teste: libSQL em ficheiro, criada a partir de `anexos/schema.sql`, com *seed* (obras, fichas, 1 admin, 1 professor, 6 estudantes numa turma).
- **Base nova (vazia)** e **base antiga (de produção, cópia)** têm de arrancar sem erro (falha real que já aconteceu: `no such table: turma_membros`).

## 6. Critérios de aceitação por passo

Cada passo do doc 09 declara os seus; regras comuns: `tsc --noEmit`, ESLint e testes a verde; sem `any` novo; sem segredos; textos em `messages/`; acessibilidade sem violações sérias; cada Server Action devolve `{ok}` e valida com Zod.

## 7. Limites da verificação

Não foi possível testar contra Turso, OpenAI, SMTP nem Wikimedia Commons reais no ambiente onde isto foi documentado. Fazer **um teste de fumo em staging** com serviços reais antes de produção.
