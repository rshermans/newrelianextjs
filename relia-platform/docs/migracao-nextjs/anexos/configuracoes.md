# Anexo: configuração e segredos

## Segredos (ambiente)

Hoje vivem em `st.secrets` (TOML). No Next.js passam a variáveis de ambiente validadas com Zod em `env.ts`. **Nada disto vai para o repositório.**

| Hoje (`st.secrets`) | Variável Next.js | Obrigatória | Notas |
|---|---|---|---|
| `[TURSO] DATABASE_URL` | `TURSO_DATABASE_URL` | sim | `libsql://…` |
| `[TURSO] AUTH_TOKEN` | `TURSO_AUTH_TOKEN` | sim | |
| `[TURSO] SHARED_CONNECTION` | — | não | detalhe do Python (ligação partilhada); não se aplica |
| `[OPENAI] OPENAI_API_KEY` | `OPENAI_API_KEY` | sim | |
| `[OPENAI] MODEL` | `OPENAI_MODEL` | não | omissão `gpt-6-luna` |
| `[OPENAI] REASONING_EFFORT` | `OPENAI_REASONING_EFFORT` | não | |
| `[OPENAI] PRICE_IN_PER_M` / `PRICE_OUT_PER_M` | `OPENAI_PRICE_IN_PER_M` / `…_OUT_PER_M` | não | só para estimar custos no ecrã «Uso da IA» |
| `[EMAIL] EMAIL_HOST/PORT/HOST_USER/HOST_PASSWORD` | `EMAIL_HOST/PORT/USER/PASSWORD` | sim (envio) | |
| `[EMAIL] EMAIL_USE_TLS` | `EMAIL_USE_TLS` | não | omissão `true` |
| `[ADMIN] EMAILS` | `ADMIN_EMAILS` | não | lista separada por vírgulas |
| — | `AUTH_SECRET` | sim | novo (Auth.js) |
| — | `OPENLIBRARY_URL`, `COMMONS_API_URL`, `OPENAI_BASE_URL` | não | só testes: apontam para servidores falsos |

## Interruptores e definições (tabela `configuracoes`, chave/valor em texto)

Lidos da base; sem linha vale a omissão. Cache curto no Python (ordem de grandeza a manter).

| Chave | Valores | Omissão | Efeito | Cache atual |
|---|---|---|---|---|
| `catalogo_ativo` | `1`/`0` | `0` | só obras do catálogo + turmas podem ser escolhidas | — |
| `catalogo_bloqueia_iniciadas` | `1`/`0` | `0` | com catálogo ativo, também bloqueia continuar obras fora dele | — |
| `motor_perguntas` | `novo`/`antigo` | `antigo` | motor de 42 estratégias e limiares novos (8/26/54/92/140/200) vs. antigos (15/45/91/153/190/253) | 5 s |
| `modo_professor` | `1`/`0` | `0` | liga a persona professor e as turmas | 10 s |
| `inquerito_interno_ativo` | `1`/`0` | `0` | inquérito interno ligado | — |
| `inquerito_convite_apos` | inteiro ≥0 | `5` | respostas de reflexão até convidar (0 = nunca) | — |
| `inquerito_url` | URL https | `https://bit.ly/Zoho-RELIA` | inquérito externo | 30 s |
| `inquerito_texto` | texto | «Inquérito sobre o RELIA» | | 30 s |
| `inquerito_locais` | JSON `["barra","area_leitor","inicio"]` | `["barra","area_leitor"]` | onde aparece o convite | 30 s |
| `ajuda_email` | email | `relia.informa@gmail.com` | contacto de ajuda | 30 s |
| `responsavel_tratamento` | texto | «A equipa do projeto RELIA» | entra nos textos legais (a preencher pelo responsável) | 30 s |

**Migração:** manter a tabela e as chaves; criar um módulo `server/config.ts` com `getConfig(chave)` em cache com etiqueta, revalidada ao gravar.
