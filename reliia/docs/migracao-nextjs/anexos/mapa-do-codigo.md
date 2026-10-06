# Anexo: mapa do código Python → módulos Next.js

Use-o para saber **que ficheiro Python ler** em cada passo do doc 09 e **onde** pôr o equivalente.

## Núcleo

| Python | Responsabilidade | Next.js |
|---|---|---|
| `streamlit_app.py` | arranque, rotas por `tela`, barra lateral | `app/` (rotas), `components/shell` |
| `database.py`, `db_compat.py` | esquema, migrações, acesso, reconexão | `server/db/{client,schema}.ts` |
| `user_crud.py` | registo, perfil, aceitação, apagar | `server/auth`, `server/db/queries/utilizadores.ts` |
| `utils/openai_client.py` | única chamada à IA, variante, registo `uso_llm` | `server/ai/client.ts` |
| `utils/lingua.py` | variante pt-PT/pt-BR no prompt | `server/ai/variante.ts` |
| `utils/legal.py` | versões e textos legais | `messages/*`, `app/(publico)/*` |
| `utils/email_utils.py` | envio de email | `server/email` |
| `utils/lazy.py` | imports lentos | `dynamic()` |

## Domínio (puro)

| Python | Next.js `domain/` |
|---|---|
| `utils/niveis.py` | `niveis.ts` |
| `utils/fichas.py` | `fichas.ts` |
| `utils/perguntas.py` | `perguntas/{construtores,selecao,correcao}.ts` |
| `utils/relatorio.py` | `relatorio.ts` |
| `utils/linguistica.py` | `linguistica.ts` |
| `utils/relatorio_ia.py` | `server/ai/contratos/leitura.ts` |
| `utils/reescrita.py` | `reescrita.ts` |
| `utils/inquerito.py` | `inquerito.ts` |
| `utils/professor.py`, `utils/banco_perguntas.py`, `utils/relatorio_turma.py` | `turmas.ts`, `banco.ts`, `relatorio-turma.ts` |
| `utils/imagens.py`, `utils/capas.py` | `imagens.ts`, `server/capas` |
| `utils/catalogo.py`, `utils/definicoes.py`, `utils/contactos.py`, `utils/admin_dados.py` | `catalogo.ts`, `server/config.ts`, `contactos.ts`, `server/db/queries/admin.ts` |
| `utils/visuais.py` | `components/{mapa-mental,infografico}` (SVG React) |

## Ecrãs

| Python (`views/`) | Rota Next.js |
|---|---|
| `login.py` | `(publico)/entrar`, `registar` |
| `legal.py`, `contacto.py` | `(publico)/termos`, `privacidade`, `contacto` |
| `painel.py`, `obra_search.py` | `(leitor)/` e `obras` |
| `chat.py` | `obras/[obraId]/roteiro` + `api/chat` |
| `checkpoint_novo.py` | `obras/[obraId]/reflexao` |
| `relatorio.py` | `obras/[obraId]/percurso` |
| `reescrita.py` | `reescrita/[id]` |
| `area_do_leitor.py`, `comunidade.py` | `area-do-leitor` |
| `profile.py` | `perfil` |
| `turmas.py` | `turmas` |
| `inquerito.py` | `inquerito` |
| `professor*.py`, `ficha_form.py` | `professor/*` |
| `admin*.py` (11 ficheiros) | `admin/*` |
| `sidebar.py` | `components/shell/sidebar` |

## Não portar (legado/morto)
`views/checkpoint.py`, `views/auth_config.py`, `views/password_recovery.py` (stub), `utils/bloom_level_info.py`, `utils/estruturas_de_dados.py`, `utils/chkFuncoes.py`, `utils/popup.py`, `utils/criar_dataframes.py`, `atualizar_acoes.py`, `migrar_para_turso.py`, `utils/api.py` (verificar antes). Ver doc 11.
