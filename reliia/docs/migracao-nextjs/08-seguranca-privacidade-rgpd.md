# 08. Segurança, privacidade e RGPD

O RELIA trata dados de **jovens a partir dos 14 anos**. Estas regras são **requisitos**, não sugestões. Cada uma tem de ter um teste (doc 10).

## 1. Dados pessoais e onde estão

| Dado | Tabela | Quem pode ver | Vai para a IA? |
|---|---|---|---|
| Nome, email, hash da palavra-passe | `usuarios` | o próprio; admin | **Nunca** (nome e email) |
| Idade, cidade, interesses, nível de ensino, hábito de leitura | `usuarios` | o próprio; admin | Sim (só para adaptar o tom) |
| Respostas, mensagens, reescritas | `checkpoints`, `chat_messages`, `reescritas` | o próprio; professor **só** se o leitor partilhar o percurso | Sim (texto, sem identificação) |
| Número na turma | `turma_membros` | professor da turma | — |
| Identidade número→nome | junção `turma_membros`×`usuarios` | **só admin**, com auditoria | — |
| Consentimentos | `consentimentos` | o próprio (histórico); admin | — |
| Inquérito | `inquerito_*` | só agregados anónimos (grupos n<5 escondidos) | — |

## 2. Princípios obrigatórios

1. **Minimização para a IA:** nome e email nunca saem do servidor para a OpenAI (defeito já corrigido no chat livre, PR #30; ver teste em doc 10). Criar uma função única `perfilParaIA(utilizador)` que devolve **só** `idade, cidade, interesses` e usá-la em todas as chamadas.
2. **Texto do leitor = dados:** delimitado nos prompts; nunca executado nem interpretado como instrução.
3. **Professor nunca vê identidade:** as consultas de professor **não selecionam** `usuario_id`, `nome`, `email`. Teste automático que inspeciona o objeto devolvido.
4. **Partilha opt-in:** o percurso só é visível ao professor se `turma_membros.partilha = 1`; desligar tem efeito imediato.
5. **Cobertura da turma** só com ≥5 estudantes com texto; inquérito com grupos <5 escondidos (anti-reidentificação).
6. **Consentimento por versão do documento:** ao mudar a versão (termos/privacidade), pedir novo aceite no próximo acesso e guardar registo (data, versão). Não repetir o pedido se já aceite na versão atual.
7. **Direitos do titular:** exportar (JSON com todos os dados do utilizador) e eliminar conta (apaga em cascata; o único admin não se elimina). Manter as cascatas do doc 03.
8. **Retenção:** `uso_llm`, `logs_uso`, `erros_app`, `reset_tokens` com limpeza periódica (cron). Definir prazos com o responsável pelo tratamento (a preencher; hoje «A equipa do projeto RELIA»).
9. **Auditoria:** toda a ação de admin sobre pessoas ou conteúdo grava em `auditoria` (quem, quê, entidade, detalhes). A revelação de identidade é auditada.
10. **Idade mínima 14:** validada no servidor no registo.

## 3. Segurança aplicacional

| Tema | Requisito |
|---|---|
| Palavras-passe | `bcryptjs` compatível com `$2b$`; custo ≥10; nunca registar; mensagem de erro igual para email inexistente e senha errada |
| Sessão | JWT `httpOnly`, `Secure`, `SameSite=Lax`; expiração; papéis **relidos da base** em ações sensíveis |
| CSRF | Server Actions (origem verificada); rotas `POST` próprias com verificação de origem |
| Autorização | matriz do doc 06; **no servidor**; 404 para recursos alheios |
| Validação | Zod em todas as entradas e saídas da IA; limites de tamanho (p. ex. chat 1000 car., resposta aberta 4000) |
| SQL | só consultas parametrizadas (ORM) |
| XSS | `react-markdown` + `rehype-sanitize`; nunca `dangerouslySetInnerHTML` com texto de utilizadores; atribuições de imagem sem HTML |
| Limites de taxa | login (por IP+email), registo, contacto, chat, IA por funcionalidade (doc 04 §16), no servidor |
| Cabeçalhos | CSP restritiva (imagens só `covers.openlibrary.org`, `upload.wikimedia.org`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors 'none'` |
| Uploads | não há uploads de ficheiros; manter assim |
| Imagens externas | https e hosts permitidos; licença validada **de novo** ao guardar (doc 04 §14) |
| Segredos | só em ambiente; **rodar** as chaves que estiveram no histórico git (ação do responsável); `gitleaks` no CI |
| Dependências | `npm audit`/Dependabot; *lockfile* versionado |
| Registos | sem dados pessoais nos logs nem no Sentry (mascarar email, texto do leitor) |
| Perguntas com resposta certa | a correção é **no servidor**; o cliente só recebe o enunciado e as opções (doc 06) |

## 4. Recuperação de palavra-passe (a desenhar)

Hoje é um *stub* inacessível. Desenho pedido: token aleatório de 32 bytes, **guardado só como hash**, validade 30 min, uso único, resposta genérica («se o email existir, enviámos instruções»), limite de pedidos, envio por email, invalidar sessões ao mudar. Tabela `reset_tokens` já existe (verificar colunas no `schema.sql`).

## 5. Crianças e jovens

- Linguagem simples nos avisos; sem *dark patterns*; sem publicidade nem *tracking* de terceiros.
- Análises de uso (se houver) sem *cookies* de terceiros e sem identificadores pessoais.
- Textos legais **precisam de revisão de um(a) DPO/jurista** antes de produção (pendente do responsável).

## 6. Lista de verificação antes de ir para produção

- [ ] Chaves antigas revogadas e novas só no ambiente
- [ ] «Responsável pelo tratamento» preenchido
- [ ] Textos legais revistos
- [ ] Testes de privacidade (doc 10 §4) a passar
- [ ] Limites de taxa ativos e testados
- [ ] CSP e cabeçalhos verificados
- [ ] Cópias de segurança da base (Turso) e teste de restauro
- [ ] Plano de resposta a incidentes (quem avisa a CNPD em 72 h)
