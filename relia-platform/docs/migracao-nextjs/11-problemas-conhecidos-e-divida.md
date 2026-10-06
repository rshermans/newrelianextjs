# 11. Problemas conhecidos e dívida técnica

O que **não** replicar, o que corrigir e o que decidir. Marcação: 🔴 corrigir na migração · 🟡 decidir · ⚪ ignorar (legado).

## Defeitos / comportamentos a corrigir
| # | Item | Onde | Ação |
|---|---|---|---|
| 1 | 🔴 `sanitize_input` remove **toda** a pontuação da pergunta livre | `views/chat.py` | Não portar; limitar a 1000 car. e tratar como texto |
| 2 | 🔴 Recuperação de palavra-passe é *stub* inalcançável (token fixo) | `views/password_recovery.py` | Desenhar de raiz (doc 08 §4) |
| 3 | 🔴 `PONTOS_NIVEL_ANALISAR = 92` fixo e «92» na legenda do admin | `views/comunidade.py`, `views/admin_pedagogia.py` | Ler dos limiares do motor ativo |
| 4 | 🔴 Datas misturam UTC e `DATETIME('now','localtime')` | várias | Guardar UTC ISO; converter para Lisboa na UI; migrar leitura tolerante |
| 5 | 🔴 Sem índices | `database.py` | Criar (doc 03) |
| 6 | 🔴 9 FKs declaradas mas **não impostas** | esquema | Ativar `PRAGMA foreign_keys=ON` com cuidado; limpar órfãos antes |
| 7 | 🔴 Correção de perguntas no mesmo processo (resposta certa acessível ao cliente se mal portado) | — | Corrigir **no servidor** |
| 8 | 🟡 `checkpoints.nota_llm INTEGER` guarda decimais | esquema | Migração aditiva para `REAL` ou nova coluna |
| 9 | 🟡 `formatar_pontos` arredonda 0,25→«0,2» (arredondamento do banqueiro) | `utils/niveis.py` | Decidir: manter para paridade ou corrigir |
| 10 | 🟡 Duas tabelas de limiares (antigos/novos) coexistem | `utils/niveis.py` | Manter até o motor novo ser definitivo; depois remover |
| 11 | 🟡 Nome/identificação: `usuarios.nome` livre | — | Rever necessidade de nome real |
| 12 | 🟡 Imagens Commons só admin, sem local de exibição decidido | — | Decidir onde mostrar ao leitor; imagens geradas por IA adiadas |
| 13 | 🟡 Envio de email síncrono | `utils/email_utils.py` | Fila/`after()` |
| 14 | 🟡 Cache de IA do percurso por `(roteiro, n_respostas)` | `relatorios_ia` | Manter |

## Segurança (histórico)
- ⚠️ Chaves expostas no histórico git: **revogar** (ação do responsável; sem *force-push*).
- ✔ Nome já não vai para a IA no chat livre (PR #30).
- ✔ Arranque em base nova corrigido (PR #29).

## Legado a não portar ⚪
`views/checkpoint.py`, `views/auth_config.py`, `utils/bloom_level_info.py`, `utils/estruturas_de_dados.py`, `utils/chkFuncoes.py`, `utils/popup.py`, `utils/criar_dataframes.py`, tabelas `acoes` e `feedback_automatizado` (verificar uso antes de eliminar), `atualizar_acoes.py`, `migrar_para_turso.py`.

## Limitações atuais do produto (oportunidades)
- Sem streaming; sem API; sem PDF do percurso; sem PWA; mobile fraco; escala ~10–30 leitores.
- Sem suite de testes automáticos.
- Textos legais não revistos por jurista; responsável pelo tratamento por preencher; tradução da escala SUS e léxicos linguísticos por validar.

## Decisões em aberto (para o responsável)
1. Corrigir ou manter o arredondamento 0,25→«0,2»?
2. Onde mostrar imagens do Commons ao leitor? Quando introduzir imagens geradas por IA?
3. Prazos de retenção de logs e dados.
4. Hospedagem (Vercel vs. outra) e região.
5. Manter `pt-BR` como opção na v1 do Next.js?
6. Email institucional definitivo (assumido `relia.informa@gmail.com`).
