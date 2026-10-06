# 04. Regras de negócio

Este é o documento mais importante para a paridade: **as regras e fórmulas têm de dar o mesmo resultado no TypeScript**. Os casos de teste correspondentes estão em [`anexos/vetores-de-teste.json`](anexos/vetores-de-teste.json) (gerados do Python). Entre parênteses, o ficheiro Python de referência.

Convenção: «fração» = nota entre 0 e 1; «pontos» = valor absoluto.

---

## 1. Níveis, pontos e progresso (`utils/niveis.py`)

Níveis, por ordem: `Lembrar, Compreender, Aplicar, Analisar, Avaliar, Criar`.

Há **dois conjuntos de limiares** (limite superior **inclusivo** de cada nível; a pontuação é a soma de `checkpoints.nota_llm` do roteiro):

| | Lembrar | Compreender | Aplicar | Analisar | Avaliar | Criar |
|---|---|---|---|---|---|---|
| **Antigos** (motor antigo) | ≤15 | ≤45 | ≤91 | ≤153 | ≤190 | ≤253 |
| **Novos** (motor novo) | ≤8 | ≤26 | ≤54 | ≤92 | ≤140 | ≤200 |

O conjunto vale conforme `configuracoes.motor_perguntas = 'novo'` (lido com cache de 5 s); sem o registo, vale o antigo.

- `determinar_nivel(p)`: o primeiro nível cujo limite (dos cinco primeiros) é ≥ p; acima do quinto limite é `Criar`.
- `nivel_e_progresso(p)`: percorre os **seis** limites; se `p ≤ limite_i`: `nivel_i` e progresso global `(i + (p − limite_{i−1}) / (limite_i − limite_{i−1})) / 6` (com `limite_{−1} = 0`); se `p` excede o sexto limite: nível `"Mestre"` e progresso 1.0.
- `pontos_para_analisar() = limites[2] + 1` (55 com os novos, 92 com os antigos): usado em Conquistas, funil, «a meio».
- **Formatação de pontos** (`formatar_pontos`): arredonda a 1 casa decimal; inteiro sem decimais; vírgula decimal («3,5»). *Cuidado:* o Python usa arredondamento «para o par» (`round(0.25,1)=0.2`); o JavaScript `toFixed`/`Math.round` difere. Os vetores marcam estes casos: decidir uma regra única e aplicá-la.
- **Pontos obtidos** numa pergunta: `round(est.pontos × clamp(fração,0,1), 1)`.

## 2. Fichas das obras (`utils/fichas.py`, `utils/catalogo.py`)

- **Normalização** (`normalizar_ficha`): qualquer ficha (IA, base, formulário) passa por aqui. Textos aparados e cortados (resumo ≤1200 car.); listas limpas de vazios, com limites (acontecimentos 8, personagens 8, temas 6, símbolos 5, recursos 6, dilemas 4, leituras críticas 4); `ano` e `ano_morte_autor` inteiros (inválido → 0); `contexto` sempre `{epoca, local}`; campos desconhecidos descartados; **sem URLs**. Vetor: `normalizar_ficha`.
- **Estados:** `rascunho` ou `validada`. **Qualquer edição volta a pôr em rascunho**; uma ficha em rascunho **sai do catálogo** (`obras.no_catalogo = 0`). Para validar: resumo, pelo menos uma personagem e pelo menos um tema.
- **Link do texto integral:** só `http(s)` com host; só conta se a obra é de **domínio público**. Domínio público = `ano_morte + 70 + 1 ≤ ano atual`; se `ano_morte = 0` é desconhecido. Marcar domínio público numa obra ainda protegida é recusado. Vetores: `link_valido`, `dominio_publico`.
- **Gerar rascunho com IA** (`gerar_ficha`): ver doc 05. Se a IA responder `{"desconhecida": true}` lança «obra desconhecida» e **nada é guardado**.
- **Cobertura da ficha** (`cobertura_da_ficha`): para cada estratégia ativa diz se a ficha permite a pergunta (objetivas: constrói até 3 vezes e vê se alguma dá; abertas: o foco exige campos e o modelo preenche; «motivação»: precisa de personagens e resumo). Alimenta «Perguntas que esta ficha permite: N de 40».
- **Ficha efetiva para um leitor** (`utils/professor.ficha_efetiva`): se o leitor é membro de uma **turma aberta** de um professor que tem a obra atribuída **e** uma ficha **validada** dessa obra → usa a **ficha do professor**; senão a **do catálogo** (`fichas_obra`, só se validada). Só com o modo professor ligado.

## 3. Catálogo e obras permitidas (`utils/catalogo.py`)

- `catalogo_ativo`: com ele ligado, a escolha de obras novas é só entre obras `no_catalogo = 1` **com ficha validada** (`obras_do_catalogo`).
- `catalogo_bloqueia_iniciadas` (só com catálogo ativo): também bloqueia **continuar** leituras de obras fora do catálogo (botões «Continuar» desativados com 🔒; quem estiver dentro de uma é levado ao catálogo). Pontos e conversas **nunca se apagam**.
- **`ids_permitidos()`**: `None` (tudo permitido) se não houver bloqueio; senão o conjunto `{no_catalogo=1}` **mais** as obras atribuídas às turmas (abertas) do leitor da sessão. `obra_permitida(id)` = `ids is None or id in ids`.
- **Pedidos de obras:** o leitor pede (título, autor); máx. **5 pendentes** por leitor; estados `pendente → em análise → aprovado | recusado`; aprovar liga o pedido à obra (`obra_id`) e à ficha. A Administração prepara a ficha.
- **Capas (Open Library):** pesquisa por título+autor (timeout 4 s), guarda o URL em `obras.capa` (`''` quando não há); só se desenham URLs `http(s)`; sem capa mostra-se um cartão com o título.

## 4. Motor de perguntas (`utils/perguntas.py`)

### 4.1 Estratégias
42 linhas em `estrategias` (anexo `estrategias.md`): nível, verbo, **formato**, **foco**, dificuldade (1–3), pontos (1–12, crescentes com o nível), `exige_texto_integral` (2 estratégias, **nunca usadas**), `modelo` (abertas), `criterios` (abertas, separados por `;`), `ativa`. Só se usam as `ativa = 1` e `exige_texto_integral = 0`.

### 4.2 Perguntas objetivas (sem IA, a partir da ficha)
Todas devolvem `None` se a ficha não chega (a estratégia não serve a esta obra). Os **distratores** saem de outras obras/fichas e de listas de apoio (20 autores, 9 géneros), **sem repetições** (comparação sem acentos nem maiúsculas) e embaralhados.

| Foco | Formato | Regra |
|---|---|---|
| autor | escolha múltipla | «Quem escreveu «T»?»; 3 distratores de outras obras + lista de autores |
| personagem | escolha múltipla | «Quem é X em «T»?»; correta = papel; distratores = papéis de outras personagens e de outras fichas (≥3) |
| genero | escolha múltipla | distratores sem géneros parecidos (um contido no outro) |
| contexto | escolha múltipla | século da publicação, com numeral romano; distratores = séculos vizinhos |
| narrador | escolha múltipla | distratores = narradores de outras fichas (≥3) |
| motivação | escolha múltipla **com IA** | doc 05; 4 opções distintas, 1 correta, validada |
| enredo | verdadeiro/falso | até 3 afirmações «X corresponde a: papel»; alterna verdadeira/falsa; exige ≥2 personagens com papel |
| personagem | completar | frase da personagem + (se houver) frase do autor; bancos de 3 palavras |
| personagem / símbolo | associar | 3 a 4 pares sem direitas repetidas |
| enredo | ordenar | 4 a 5 acontecimentos da ficha, ordem baralhada diferente da certa |

### 4.3 Perguntas abertas (IA)
`preencher_modelo` substitui campos `{obra} {autor} {personagem} {personagem2} {tema} {tema2} {simbolo} {recurso} {dilema} {contexto}` com a ficha (aleatórios); se faltar algum campo usado, a estratégia **não serve**. `_foco_exige` obriga a campos da ficha mesmo sem campo no modelo (estrutura, estilo, narrador, crítica, enredo). A IA escreve **pergunta + gabarito** (doc 05). Critérios por omissão se a estratégia não os tem: «Fidelidade à obra», «Fundamentação», «Clareza».

### 4.4 Escolha da pergunta (`escolher_pergunta(obra, roteiro, nível, perfil)`)
1. Sem **ficha efetiva validada** → `(None, "sem_ficha")`.
2. `usadas` = estratégias já respondidas neste roteiro; `facil` = a **última** resposta teve fração < **0,5**.
3. Percorre os níveis por **distância ao nível atual** (primeiro o atual, depois vizinhos); em cada nível: candidatas ativas **não usadas** (se todas usadas, recomeça), embaralhadas, e **ordenadas** por: (a) **tem pergunta aprovada pelo professor** para este leitor primeiro; (b) se `facil`: dificuldade 1 primeiro e mesmo foco da anterior; (c) formato **diferente** do da anterior; (d) as que gastam IA (abertas e «motivação») **no fim**.
4. Para cada candidata: se há pergunta aprovada pelo professor → devolve uma (aleatória) ; senão, se usa IA, no máximo **4 tentativas de IA** por nível e só depois de confirmar que o modelo preenche; constrói; a primeira que der pergunta é devolvida.
5. Nenhuma construiu → `(None, "ficha_insuficiente")`.

### 4.5 Correção (`corrigir`, `resposta_completa`)
- **Escolha múltipla:** 1 ou 0. **V/F:** acertos/total. **Completar:** acertos/lacunas. **Associar:** acertos/pares. **Ordenar:** posição de cada item mostrado = `índice do item nos certos + 1`; acertos/itens. Os textos de feedback estão nos vetores (`corrigir`).
- **Completa** (`resposta_completa`): escolha múltipla ≠ `None`; abertas: ≥ **3 palavras** e **diferente do enunciado** (sem acentos/maiúsculas); outros: lista sem `None`.

### 4.6 Avaliação das abertas (`avaliar_aberta`)
A IA dá **0, 1 ou 2** a cada critério (a nota é limitada a 0–2; critérios em falta valem 0). `fração = soma / (2 × n_critérios)`. O **feedback** = «Pontos fortes» + «A melhorar» + lista `- critério: n/2`. Guarda-se `detalhes.criterios`. O **gabarito** é um guia («não penalize respostas válidas diferentes se apoiadas na ficha; penalize o que a ficha contradiz»). Se a IA falhar, **lança** e a interface mostra erro **sem perder a resposta**.

### 4.7 Gabarito para o leitor
Mostrado **depois** de responder, em «Ver o gabarito»: título «Aspetos que podia ter considerado» (tipo `opiniao`/`criativa`) ou «O que uma boa resposta podia incluir» (factual); lista dos pontos-chave (2 a 4).

### 4.8 Registo (`registar_resposta`)
Insere em `checkpoints`: `acao_id = estratégia`, `nivel_taxonomia`, `pergunta` = texto simples (enunciado + opções), `resposta` = texto simples, `nota_llm = pontos`, `feedback_llm`, `formato`, `dados` (JSON). Devolve (pontos, id).

### 4.9 Reportes (`criar_reporte`)
Motivos: «Contém um facto errado sobre a obra», «A resposta certa está marcada como errada», «A pergunta é confusa ou ambígua», «A avaliação foi injusta», «Conteúdo inadequado», «Outro motivo». Um por pergunta e leitor (`UNIQUE`); só de perguntas **suas**; comentário ≤500. Estados `novo → visto → resolvido | rejeitado`. A Administração pode **desativar a estratégia** (`ativa = 0`).

### 4.10 Banco de perguntas do professor (`utils/banco_perguntas.py`)
- **Propor** (`propor`): até 6 propostas de estratégias **diferentes**; as objetivas primeiro; **no máximo 2 gastam IA** por pedido; usa a ficha do professor (se validada) ou a do catálogo.
- **Pergunta aberta do professor:** estratégia aberta + enunciado (15–500 car.) + natureza + pontos-chave (≤4, ≤200 car. cada); critérios da estratégia.
- **Guardar:** só em obras das turmas do professor; ≤**60** por obra; sem repetidas (mesma estratégia e mesmo texto).
- **Uso:** para um estudante, `banco_para(obra, estudante, roteiro)` devolve `{estratégia: [perguntas]}` dos professores das suas turmas (abertas, obra atribuída), **excluindo as que já fez neste roteiro** (comparando o texto da pergunta). Modo professor desligado → vazio.

## 5. Percurso de leitura (`utils/relatorio.py`)

**Respostas do roteiro** (`respostas_do_roteiro`): linhas de `checkpoints` ordenadas por `data_hora, id`, com a estratégia **conforme o motor**: se `formato` vazio → `acoes` (verbo = `nomes_acao`, máximo = `acoes.pontos`); senão → `estrategias` (verbo, `pontos`). `fração = clamp(nota / máximo, 0, 1)` (se não há máximo, **sem fração**: a resposta conta nos pontos mas não nas médias). Nível normalizado sem acentos/maiúsculas (desconhecido → ignorado nos gráficos).

- **Por nível** (`por_nivel`): para cada um dos 6 níveis: `n` e média das frações (None se `n = 0`).
- **Trajetória** (`serie_de_pontos`): pontos **acumulados** depois de cada resposta.
- **Tendência** (`tendencia`): só com **≥5** respostas com fração (senão `estado='poucos'`, `faltam = 5 − n`). Reta de mínimos quadrados sobre as frações em função da ordem: `declive = Σ(i−x̄)(y−ȳ)/Σ(i−x̄)²`; `variação = declive × (n−1)`; `subir` se ≥ **+0,10**, `descer` se ≤ **−0,10**, senão `estavel`. Devolve também a média da 1.ª metade (`n//2` primeiras) e da 2.ª. Vetor: `tendencia`.
- **Nível a reforçar:** o explorado com menor média, se `< 0,6`. **Mais forte:** maior média (desempate pelo `n`). **Resposta mais fraca:** menor fração.
- **Pontos para subir** (`pontos_para_subir`): `(próximo nível, max(0, round(limite_do_atual + 0,1 − pontos, 1)))`; `(None, 0)` no último.
- **Próximo passo** (`proximo_passo`): sem respostas → «Comece pelo primeiro Ponto de Reflexão» (ação reflexão); respostas sem nenhuma fração → «Continue a responder»; com nível fraco → «Aprofundar o nível X» (ação chat; texto cita a média e o número de respostas e, se a pior resposta é desse nível, sugere relê-la) ; senão «Subir de nível» (ação reflexão); acrescenta «Nas respostas escritas ainda não apareceu: …» (até 3, Temas depois Personagens, da cobertura linguística), «Faltam N pontos para chegar a **Nível**» e, se a tendência desceu, uma nota.
- **Atividade:** dias distintos (datas das respostas + mensagens do leitor) e nº de mensagens do leitor.
- **Email** (`html_do_email`): HTML de tabelas com barras em cor (sem imagens), tendência, níveis, voz (resumo), leitura pela IA (se existir), últimas 8 respostas (resposta cortada a 300 car.), próximo passo; todo o texto **escapado**. Envio **em segundo plano** por SMTP com os segredos `[EMAIL]`; limites **5 por sessão** e **60 s** entre envios; destino editável; só aparece quando há respostas.

## 6. A sua voz — linguística (`utils/linguistica.py`)

Só sobre **respostas escritas** (formato vazio, `resposta_aberta` ou `resposta_curta`, com ≥3 palavras). **Contagem determinística, sem IA.** Aparece com **≥3 respostas** e **≥60 palavras**. Léxicos e parâmetros: [`anexos/lexicos-linguisticos.md`](anexos/lexicos-linguisticos.md).

- **Tokenização:** minúsculas, sem acentos, só `[a-z]+`. **Raiz** (`raiz`): `-ns→-m`, `-es→∅` (len>4), `-s→∅` (len>3). Para mostrar palavras ao leitor usam-se as formas originais com acentos.
- **Palavras por resposta** e **por frase** (frase = divisão por `. ! ? …` com ≥2 palavras).
- **Riqueza lexical (MATTR, janela 25):** média de `tipos/25` em janelas móveis sobre todas as palavras; `None` com <25 palavras. Comparação primeiras×últimas metades só se cada metade tem ≥**40** palavras.
- **Marcadores de raciocínio:** contagens por 100 palavras de 5 categorias (causa, contraste, conclusão, exemplo, posição), por expressão com fronteira de palavra (não casa dentro de outra palavra: «mas» ≠ «máscara»).
- **Cobertura da ficha:** personagens (basta **um** dos nomes/raízes de ≥4 letras, sem palavras vazias), temas e símbolos (**pelo menos metade** das palavras de conteúdo) que aparecem nas respostas; devolve `mencionados` e `por_tocar`.
- **Palavras-chave:** as mais frequentes (≥4 letras, sem palavras vazias, por raiz, frequência ≥2), até 8; **concordância** (6 palavras de cada lado, na 1.ª ocorrência) das 5 primeiras; **vocabulário novo** (só na 2.ª metade, ≥5 letras, até 6; precisa de ≥4 respostas).
- **Rede de conceitos:** nós = termos da ficha + palavras-chave (sem duplicar raízes); aresta = aparecem na mesma resposta; mantêm-se as **12** ligações mais fortes.

## 7. Leitura do percurso pela IA (`utils/relatorio_ia.py`)

A pedido do leitor (≥3 respostas). Guarda-se por `(roteiro, nº de respostas)`; mostra a mais recente e oferece «Atualizar» se há respostas novas. **Limite 10 por leitor e dia.** A IA recebe só números e excertos (últimas 8 respostas, resposta ≤500 car., pergunta ≤200), a ficha/cobertura e métricas — **nunca nome nem email** (doc 05). A saída é validada e cortada (resumo ≤400, forças ≤2 de ≤220, lacuna ≤260, desafio ≤260).

## 8. Desafio de reescrita (`utils/reescrita.py`)

- **Elegível:** resposta **aberta** do motor novo, com `dados.pergunta`, fração **< 0,7**, **<2 tentativas** e nenhuma reescrita com fração ≥0,7. Ordem: a mais fraca primeiro (até 3 no relatório).
- **Enviar:** dono do checkpoint; ≤10 reescritas por dia por estudante; resposta completa (≥3 palavras); **diferente** (palavras sem acentos/pontuação/maiúsculas — `_chave`) da original e das reescritas anteriores; exige ficha efetiva; avalia com a mesma `avaliar_aberta`; guarda em `reescritas`. «Melhorou» = nova fração > antiga + 0,01.
- **Não dá pontos** nem altera `checkpoints`. O gabarito só se mostra depois de enviar.

## 9. Comunidade, conquistas e desafios (`views/comunidade.py`)

Sem tabelas próprias para conquistas/desafios: **calculam-se** dos dados.

- **Conquistas** (meta; medida): Primeira Página (1; nº de leituras) · Leitor Ávido (5; leituras) · Explorador de Géneros (3; géneros distintos) · Pensador Reflexivo (10; Pontos de Reflexão) · Mestre da Análise (`pontos_para_analisar`; melhor pontuação de um roteiro — *no código está fixo em 92, deve usar a função*) · Voz da Comunidade (3; publicações no fórum).
- **Desafios** (aceites em `desafios_aceites`; contam **desde a aceitação**): Maratona Literária (3 obras novas em 30 dias), Novos Horizontes (1 obra de género novo em 60 dias), Análise Profunda (3 Pontos de Reflexão de nível Analisar ou superior em 30 dias), Voz Ativa (3 publicações em 14 dias). Estados: em curso, concluído, expirado (pode repetir); desistir apaga a aceitação. Concluídos dão **insígnia** nas Conquistas.
- **Fórum:** tópicos por obra (título ≤120, texto ≤2000), respostas (≤1000); só se pode abrir discussão sobre obras que o leitor está a ler; filtro por obra; **o nome só aparece se `opcao_compartilhar = 1`**, senão «Leitor anónimo» (a Administração vê sempre o verdadeiro); apagar: o autor ou um administrador.
- **Clubes do Livro** (lista fixa de 6: Romance, Ficção Científica, Fantasia, Poesia, Policial e Mistério, Drama e Teatro, cada um com géneros associados): entrar/sair; mostra contagem de membros e as discussões recentes de obras desses géneros.

## 10. Consentimento e direitos do titular (`utils/legal.py`)

- **Documentos** (`DOCUMENTOS`): `termos` e `privacidade`, cada um com `versao` (hoje `2026-10-04`). Os textos estão em `assets/termos.md` e `assets/privacidade.md` com marcadores `{{VERSAO}} {{DATA}} {{RESPONSAVEL}} {{EMAIL}}`; **estão marcados como provisórios** até revisão de quem trata da proteção de dados.
- **Aceitação por versão:** `consentimentos (usuario, documento, versao)` UNIQUE; `precisa_aceitar` = falta alguma versão atual; mudar a versão obriga todos a aceitar de novo. O registo exige a aceitação e grava as duas.
- **Descarregar os meus dados** (JSON, **sem a palavra-passe**): perfil, roteiros, mensagens, pontos de reflexão, reescritas, leituras do percurso, fórum, clubes, desafios, pedidos de obras, reportes, contactos, consentimentos, turmas (como estudante: número e partilha; como professor: turmas, fichas, perguntas), pedidos de professor.
- **Eliminar a minha conta:** confirmação escrevendo `APAGAR`; cascata no doc 03; um administrador único não se pode eliminar.
- **Privacidade para a IA:** o **nome** e o **email** nunca seguem; seguem idade, cidade e interesses (para adaptar), e os textos do leitor.

## 11. Inquérito (`utils/inquerito.py`)

Instrumento `relia-uso`, versão `1`, 22 itens (anexo `inquerito-itens.md`).
- **SUS** (10 itens likert 1–5; ímpares positivos, pares invertidos): `soma = Σ (valor−1) para positivos + Σ (5−valor) para invertidos`; `SUS = soma × 2,5` (0–100); `None` se faltar algum item. **NPS** = `% promotores (9–10) − % detratores (0–6)`, arredondado, de −100 a 100. Vetores: `sus`, `nps`.
- **Anonimato por desenho:** a resposta guarda só o **dia** e um **contexto em grupos largos** (faixa etária 14-17/18-24/25-34/35-49/50+, escolaridade, hábito, variante, nº de leituras 0/1/2-3/4+, respostas de reflexão 0/1-9/10-29/30+, nível atingido, dias de uso <7/7-29/30-89/90+). A participação (`respondeu`/`recusou`) guarda-se **à parte**, sem ligação à resposta; apagar a conta apaga a participação e **mantém a resposta anónima**.
- **Convite:** só com o inquérito aberto, o leitor ainda sem estado e com ≥N respostas de reflexão (`inquerito_convite_apos`, por omissão 5; 0 = nunca); «Agora não» vale a sessão; «Não quero participar» grava `recusou`. Consentimento para investigação **obrigatório** no formulário.
- **Resultados:** SUS (média, desvio-padrão, mediana, histograma 0–100 com eixo fixo, interpretação), NPS, médias, **por grupo escondendo grupos com <5 respostas**, comentários, exportação CSV (`;`, UTF-8 com BOM, uma coluna por item) com **dicionário de dados**; apagar as respostas de uma versão.
- **Mudar o questionário = nova `versao`** (versões nunca se misturam).

## 12. Contacto (`utils/contactos.py`)

Categorias: `duvida`, `problema`, `sugestao`, `dados` (pedido sobre dados pessoais), `outro`. Validações: email válido; assunto ≤120; mensagem 10–2000. **Anti-abuso:** campo-armadilha (preenchido ⇒ «sucesso» sem guardar), preenchimento em <4 s ⇒ idem, **≤3 por hora e ≤10 por dia por email** (sem distinguir maiúsculas). Guarda e **avisa a equipa por email em segundo plano** (falha de SMTP não perde o contacto nem atrasa). Estados `novo → em curso → respondido → arquivado`; `dados` mostra os **dias restantes do prazo de 30**.

## 13. Turmas e professores (`utils/professor.py`, `utils/relatorio_turma.py`)

- **Interruptor** `modo_professor` (cache 10 s). Desligado: ninguém vê turmas nem painel.
- **Pedido:** escola (≤120) + motivo (10–500); **um pendente de cada vez**; aprovar põe `is_professor = 1`; recusar guarda nota. Revogar põe `is_professor = 0` e **arquiva** as turmas.
- **Turma:** nome ≤80, ano letivo ≤20, **código de 6 caracteres** do alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (sem 0/O/1/I; gerado com `secrets`, único); ≤**20** turmas por professor; o dono pode trocar o código (quem já entrou fica), arquivar/reabrir (arquivada não aceita entradas) e apagar. **Toda a ação passa pela verificação de dono.**
- **Entrar:** código normalizado (maiúsculas, só `[A-Z0-9]`, 6 caracteres); turma aberta; não o próprio professor; não repetir. Sorteia o **número** com `secrets.choice` entre 100–999 livres (depois 1000–9999) — **sem relação com a ordem de entrada**. O estudante vê o aviso e confirma antes de entrar.
- **O que o professor vê de um estudante** (`estudantes_da_turma`): **só** `numero, entrou_em, pontos, respostas, obras_iniciadas, ultima` e `partilha`, **limitados às obras atribuídas à turma**. **Nunca** `usuario_id`, nome, email, mensagens, nem texto das respostas.
- **Partilha do percurso** (`turma_membros.partilha`, por turma, desligada por omissão): se ligada, o professor vê desse número (e só de obras da turma) as respostas, notas, critérios e feedback (`percurso_partilhado`).
- **Identidade:** só a Administração vê `numero → nome, email` (`identidades`), e **cada consulta fica na auditoria** (`ver_identidades_turma`).
- **Obras da turma:** o professor atribui obras do catálogo ou **adiciona** uma obra (título+autor, fora do catálogo, sem duplicar ignorando maiúsculas); ficam disponíveis aos estudantes da turma mesmo com o catálogo restrito. Prazo `AAAA-MM-DD` e orientação ≤500.
- **Relatório da turma** (`analisar_turma`, por obra): estudantes, participantes, respostas, nota média; **estudantes por nível atingido** (pontos nessa obra → `determinar_nivel`; «Sem respostas»); média por nível; tendência; **dificuldades** (estratégia+nível com ≥3 respostas, 5 piores); sem atividade; **reportes por motivo**; **cobertura da ficha** só com **≥5 estudantes com respostas escritas** (texto agregado de toda a turma; nunca sai do cálculo); tabela por número com CSV (`;`, BOM).
- **Fichas e perguntas do professor:** doc 02 §8 e §2/§4.10 acima. A Administração pode **promover** uma ficha do professor a ficha do catálogo (substitui a existente, com auditoria).

## 14. Imagens das obras (`utils/imagens.py`)

Wikimedia Commons, **escolha humana**, só na Administração por agora. Pesquisa `generator=search`, `filetype:bitmap`, espaço de nomes 6, miniatura 320 px, cabeçalho `User-Agent` descritivo com o email de ajuda, cache de 1 hora. **Licenças aceites:** domínio público (`public domain`, `PD…`), `CC0`, `CC BY`, `CC BY-SA` (qualquer versão); **recusadas** NC, ND, «fair use», «all rights reserved», GFDL e desconhecidas. **Validado de novo ao guardar:** só `https`, imagem em `upload.wikimedia.org`, página em `commons.wikimedia.org`; texto limpo de HTML; ≤6 por obra; sem repetidas (`obra_id + url_imagem`). Atribuição guardada: «Título» por Autor, licença, via Wikimedia Commons. Vetor: `licencas`.

## 15. Indicadores de administração (`utils/admin_dados.py`)

- **Indicadores da semana** (últimos 7 dias contra os 7 anteriores): utilizadores ativos, novos, leituras começadas, perguntas no chat, Pontos de Reflexão, mensagens no fórum. Por omissão **exclui administradores** (toggle para incluir).
- **Mapa de calor:** matriz 7×24 (dia da semana × hora de **Lisboa**) de ações dos últimos 90 dias (roteiros criados, mensagens do leitor, pontos de reflexão, tópicos e respostas do fórum).
- **Funil:** registaram-se → começaram uma obra → responderam a um Ponto de Reflexão → chegaram a Analisar (≥ `pontos_para_analisar`). **Níveis:** o melhor roteiro de cada leitor. **«A meio»:** sem atividade há >**7 dias** e sem chegar a Analisar. Cada leitor conta uma vez (roteiros duplicados ignorados).
- **Resumo semanal pela IA** (≤150 palavras; recebe só números agregados; doc 05), guardado por `semana` ISO.
- **Uso da IA:** cada chamada regista `funcao` (nome da função que a pediu), modelo, tokens, duração, sucesso, erro; custo estimado se `PRICE_IN_PER_M`/`PRICE_OUT_PER_M` estiverem nos segredos.

## 16. Quadro de limites e proteções

| O quê | Limite |
|---|---|
| Idade mínima / máxima no perfil | 14 / 100 |
| Pedidos de obra pendentes por leitor | 5 |
| Leituras da IA do percurso | 10 por leitor e dia |
| Reescritas | 10 por estudante e dia; 2 por resposta |
| Email do relatório | 5 por sessão; 60 s entre envios |
| Contacto | 3/hora e 10/dia por email; 4 s mínimos; assunto 120, mensagem 10–2000 |
| Turmas por professor | 20 |
| Perguntas aprovadas por obra e professor | 60 |
| Imagens por obra | 6 |
| Reportes por pergunta e leitor | 1 (comentário ≤500) |
| Tentativas de IA por nível ao escolher pergunta | 4 |
| Propostas do banco com IA por pedido | 2 |
| Cobertura da turma | ≥5 estudantes com texto |
| Grupos do inquérito | ≥5 respostas |
| Chat: contexto para a IA | últimas 10 mensagens |
| Mapa mental | ≤10 ramos, ≤5 ideias por ramo |

## 17. Definições e interruptores (`configuracoes`)

Chaves e valores por omissão em [`anexos/configuracoes.md`](anexos/configuracoes.md). Todos reversíveis; ler com cache curto.
