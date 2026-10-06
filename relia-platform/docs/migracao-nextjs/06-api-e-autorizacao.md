# 06. API e autorização

Na aplicação Streamlit **não há API**: cada ecrã chama funções Python que leem/escrevem a base. No Next.js proponho:

- **Server Components** para leituras de páginas (consulta direta à base, sem passar por HTTP).
- **Server Actions** para mutações iniciadas por formulários/botões (registo, aceitar, responder, aprovar…).
- **Route Handlers** (`/api/...`) só onde há **streaming** (chat), **descarregamentos** (CSV/JSON/SVG), **webhooks/cron** e integração externa.

A camada de domínio (pasta `src/domain/*`) é **pura e testável** (regras do doc 04); as Server Actions e os Route Handlers só: autenticam → autorizam → validam (Zod) → chamam o domínio → devolvem.

## Matriz de autorização

Papéis: **V**isitante, **L**eitor, **P**rofessor, **A**dmin. «Dono» = o próprio recurso. Toda a verificação é **no servidor** (a interface só esconde botões).

| Recurso / ação | V | L | P | A | Regra extra |
|---|---|---|---|---|---|
| Páginas públicas (entrada, termos, privacidade, contacto) | ✔ | ✔ | ✔ | ✔ | — |
| Registar / entrar | ✔ | — | — | — | idade ≥14, aceite dos documentos |
| Aceitar documentos | — | ✔ | ✔ | ✔ | — |
| Perfil, exportar/eliminar os meus dados | — | dono | dono | dono | admin único não se elimina |
| Obras: pesquisar/escolher/continuar | — | ✔ | ✔ | ✔ | `obra_permitida` (catálogo + turmas) |
| Pedir obra | — | ✔ | ✔ | ✔ | ≤5 pendentes |
| Roteiro, chat, mapa, infográfico | — | dono | dono | dono | só o dono do roteiro |
| Ponto de Reflexão, reportar pergunta | — | dono | dono | dono | pergunta tem de ser sua |
| Percurso de leitura, leitura IA, reescrita, email | — | dono | dono | dono | limites doc 04 §16 |
| Área do Leitor, fórum, clubes, desafios | — | ✔ | ✔ | ✔ | apagar: autor ou admin |
| Entrar/sair de turma, partilhar percurso | — | ✔ | ✔ | ✔ | modo professor ligado; não o próprio professor |
| Pedir acesso de professor | — | ✔ | — | — | um pendente |
| Turmas/obras/estudantes (por número) | — | — | **dono da turma** | ✔ (leitura) | modo ligado |
| Relatório da turma, percursos partilhados | — | — | dono da turma | — | só estudantes que partilharam |
| Fichas/perguntas do professor | — | — | dono | — | só obras das suas turmas |
| Identidade dos estudantes (número→nome) | — | — | **✘** | ✔ | **auditado** |
| Aprovar/recusar professor; promover ficha | — | — | — | ✔ | auditado |
| Catálogo, fichas, estratégias, reportes, imagens | — | — | — | ✔ | auditado |
| Utilizadores (editar, tornar/retirar admin, apagar) | — | — | — | ✔ | nunca ficar sem admins; nunca a si próprio |
| Contactos, inquérito (resultados/exportar), consentimentos, sistema | — | — | — | ✔ | — |
| Responder ao inquérito | — | ✔ | ✔ | ✔ | uma vez; aberto |
| Enviar contacto | ✔ | ✔ | ✔ | ✔ | anti-abuso |

**Regras transversais:** o papel de professor e de admin é **relido da base de dados** a cada pedido sensível (não confiar na sessão). Toda a consulta de professor passa por `turma_do_professor(turmaId, professorId)` (dono). **Nunca** devolver `usuario_id`, nome ou email de estudantes a um professor.

## Proposta de rotas e ações (paridade com o Python)

Notação: `GET` = Server Component ou Route Handler; `ACTION` = Server Action. Entre parênteses a função atual.

### Autenticação e conta
- `ACTION registar(dados)` — valida campos (doc 02 §1), `hash(bcrypt)`, insere (`inserir_perfil_login`), regista consentimentos (`registar_aceitacao`), inicia sessão.
- `ACTION entrar(email, senha)` — `obter_perfil` + `check_password` (bcrypt `$2b$`); sessão com `id, nome, email, idade, cidade, interesses, nivel_educacional, habito_leitura, opcao_compartilhar, is_admin, is_professor, variante_pt`.
- `ACTION sair()`.
- `ACTION aceitarDocumentos()` (`registar_aceitacao`) · `GET /api/me/dados` (JSON; `dados_do_utilizador`) · `ACTION eliminarConta(confirmacao)` (`apagar_utilizador`).
- `ACTION atualizarPerfil(campos)` (`atualizar_usuario_Perfil`; só aplica campos não vazios — tal como hoje).
- Recuperação de palavra-passe: **desenhar de raiz** (doc 11).

### Obras e catálogo
- `GET obras?catalogo` (`obras_do_catalogo`, filtros, paginação 12) · `ACTION pesquisarObras(titulo, autor)` (IA, #5) · `ACTION escolherObra(sugestão|obraId)` (cria obra se não existir + `criar_ou_obter_roteiro`) · `ACTION pedirObra(titulo, autor)`.
- `GET /api/capas?obraId` (cache; guarda `obras.capa`).

### Roteiro
- `GET roteiro(obraId)` (resumo + mensagens; gera o resumo se faltar).
- `POST /api/chat` (**streaming SSE**): corpo `{roteiroId, texto | interesse}`; grava a mensagem do leitor, chama a IA, **grava a resposta no fim**.
- `ACTION mapaMental(roteiroId)`, `ACTION refazerMapa`, `GET /api/mapa.svg`; `ACTION infografico(roteiroId, parId)`.

### Pontos de Reflexão
- `ACTION proximaPergunta(roteiroId)` → `{estrategia, pergunta}` ou `{motivo: sem_ficha|ficha_insuficiente}`. **A pergunta (com a resposta certa) não pode ir inteira para o cliente se isso permitir ver as respostas antes de responder** — enviar só o necessário e **corrigir no servidor** (hoje a correção é no mesmo processo, sem problema; no browser seria uma fuga).
- `ACTION responder(roteiroId, resposta)` → corrige/avalia, grava (`registar_resposta`), devolve `{pontos, fracao, feedback, gabarito?, subiuDeNivel}`.
- `ACTION reportarPergunta(checkpointId, motivo, comentario)`.

### Percurso de leitura
- `GET percurso(roteiroId)` (`respostas_do_roteiro`, métricas do doc 04 §5–6) · `ACTION gerarLeitura(roteiroId)` (#10) · `ACTION enviarPercursoPorEmail(roteiroId, email)` (fila em segundo plano).
- `GET reescrita(checkpointId)` · `ACTION reescrever(checkpointId, texto)`.

### Comunidade
- `GET/ACTION` fórum (`criar_topico`, `criar_resposta`, `apagar_*`), clubes (`entrar_clube`, `sair_clube`), desafios (`aceitar_desafio`, `desistir_desafio`).

### Turmas e professores
- Estudante: `GET turmas` · `ACTION entrarNaTurma(codigo)` · `ACTION sairDaTurma` · `ACTION partilha(turmaId, bool)` · `ACTION pedirProfessor`.
- Professor: `GET professor/turmas` · `ACTION criarTurma` · `ACTION novoCodigo|arquivar|apagar` · `ACTION atribuirObra|retirarObra|adicionarObra` · `GET turma/[id]/estudantes` (só números) · `GET turma/[id]/relatorio?obra` · `GET /api/turma/[id]/relatorio.csv` · `GET percursoPartilhado(turma, numero, obra)` · fichas (`gerarRascunho`, `guardarFicha`, `apagarFicha`) · perguntas (`proporPerguntas`, `aprovar`, `escreverAberta`, `retirar`).

### Contacto e inquérito
- `ACTION enviarContacto(...)` (anti-abuso do doc 04 §12; email em segundo plano) · `ACTION responderInquerito(respostas, consentimento)` · `ACTION recusarInquerito`.

### Administração
- Cada secção: `GET` de leitura + `ACTION`s auditadas. `GET /api/admin/inquerito.csv`, `/api/admin/consentimentos.csv`, `/api/admin/contactos.csv`, `/api/admin/obras-a-meio.csv`.
- **Auditoria:** toda a `ACTION` de admin chama `auditar(acao, entidade, entidadeId, detalhes)`.

### Tarefas agendadas (novas)
- `GET /api/cron/limpeza` — retenção de `uso_llm`, `logs_uso`, `erros_app`, `reset_tokens` expirados.
- `GET /api/cron/resumo-semanal` (opcional; hoje é manual).

## Contratos de erro

- Validação: `400` com `{campo: mensagem}`; sem sessão: `401`; sem permissão: `403` (não revelar se o recurso existe: `404` para recursos de outros utilizadores); limite: `429` com `Retry-After`; IA em baixo: `503` com mensagem amigável. Mensagens ao utilizador **em PT-PT**, sem detalhes técnicos.
- Nas Server Actions devolver um objeto `{ok: true, ...} | {ok: false, erro, campos?}` em vez de lançar, para o formulário mostrar a mensagem.

## Validação (Zod) e tipos

Um esquema Zod por entrada e por forma JSON da base (ficha, pergunta `q`, `checkpoints.dados`, mapa, infográfico, leitura IA, inquérito). **A mesma validação serve para a resposta da IA e para o que vem do browser.** Gerar os tipos TypeScript a partir dos esquemas.
