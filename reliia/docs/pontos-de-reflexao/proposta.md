# Pontos de Reflexão: proposta para revisão

Nada disto está na base de dados nem no código da aplicação. É uma proposta para rever e corrigir.
A tabela de estratégias está em [`estrategias-proposta.csv`](estrategias-proposta.csv) (abre no Excel; separador `;`).
Quando estiver aprovada, importo-a para a base.

## 1. O que não funciona hoje

Resultado da leitura da tabela `acoes` (63 estratégias) e do código que a usa.

| Problema | Exemplo |
|---|---|
| Os pontos não acompanham a taxonomia | Aplicar vale 15 a 37 pontos por pergunta, Criar vale 19 a 30. O total de Aplicar (312) é maior do que o de Criar (265). |
| Os pontos crescem pela posição na lista | «Listar» vale 1 ponto e «Definir» vale 4, no mesmo nível. |
| Pontuação tudo ou nada | 5/10 e 10/10 dão os mesmos pontos; abaixo de 5, nenhum. |
| Escolha ao acaso | A estratégia é sorteada: pode repetir e ignora o que o leitor já respondeu e explorou no chat. |
| Modelos que não servem para literatura | «Construa um modelo de negócio baseado nos princípios da obra», «Conceba um novo sistema de saúde…». Um modelo cita uma metáfora fixa («A alma é um rio») que não existe nas outras obras. |
| Só perguntas de resposta livre | O código tem um erro (`tipo == 'texto' or 'textarea'`) que transforma todos os tipos em caixa de texto. As funções de quiz e de lista existem, mas nunca são chamadas. |
| A avaliação não sabe o que a pergunta pretendia | A IA que avalia não recebe gabarito nem rubrica. A coluna `respostas_esperadas` é carregada e ignorada. |
| A nota é lida por texto | O código procura «Pontuação: N» na resposta da IA. |

## 2. Como funcionaria

```
ficha da obra (validada por si)  →  estratégia  →  pergunta + gabarito  →  resposta do leitor  →  pontuação
```

1. **A obra tem uma ficha**: personagens, temas, símbolos, contexto, narrador… Foi gerada pela IA e **validada por si**. É a única fonte factual das perguntas.
2. **A estratégia** (uma linha da tabela) diz o nível, o formato e o foco, e traz um modelo com campos como `{personagem}` ou `{tema}`. Os campos são preenchidos com a ficha de qualquer obra, por isso a tabela serve para todas.
3. **Pergunta e gabarito nascem juntos** e são guardados. A avaliação usa o gabarito, e não a memória da IA.
4. **A pontuação das perguntas objetivas é feita pela aplicação**: instantânea, grátis, sem erros de avaliação, com crédito parcial. A IA só avalia as respostas livres, com uma rubrica.

## 3. A ficha da obra

Campos: `resumo`, `personagens` (nome, papel, descrição), `temas`, `simbolos` (símbolo, significado), `recursos` (ironia, metáfora…), `dilemas`, `contexto` (época, local), `narrador`, `estrutura`, `estilo`, `leituras_criticas`, `genero`, `ano`, e para obras de domínio público `link_texto_integral`.

Estados: **rascunho** (gerada pela IA) → **validada** (revista por si na Administração, onde pode corrigir cada campo). As perguntas só usam fichas validadas.

Exemplo, só para ilustrar (*Dom Casmurro*):

```json
{"genero": "romance realista", "ano": 1899,
 "narrador": "Bento Santiago (Bentinho), em 1.ª pessoa, a recordar a vida",
 "contexto": {"epoca": "século XIX, Segundo Reinado", "local": "Rio de Janeiro"},
 "personagens": [{"nome": "Capitu", "papel": "vizinha e depois mulher de Bentinho"},
                 {"nome": "José Dias", "papel": "agregado da família"},
                 {"nome": "Escobar", "papel": "amigo de Bentinho do seminário"}],
 "temas": ["ciúme", "dúvida", "memória e subjetividade"],
 "simbolos": [{"simbolo": "olhos de ressaca", "significado": "o fascínio e a ambiguidade de Capitu"}],
 "recursos": ["ironia", "narrador pouco fiável", "capítulos curtos"],
 "dilemas": ["acreditar ou não na suspeita de traição"],
 "leituras_criticas": ["Capitu trai Bentinho", "a traição só existe no ciúme do narrador"]}
```

## 4. Formatos de pergunta

| Formato | Quem gera | Como se corrige | Nível típico |
|---|---|---|---|
| Escolha múltipla | a aplicação, a partir da ficha (ou a IA, com verificação) | pela aplicação | Lembrar, Compreender |
| Verdadeiro ou falso | a IA, com a ficha | pela aplicação, uma a uma | Lembrar |
| Completar lacunas | a aplicação, a partir da ficha | pela aplicação, por lacuna | Lembrar |
| Associar pares | a aplicação, a partir da ficha | pela aplicação, por par | Lembrar, Compreender |
| Ordenar acontecimentos | a IA, com a ficha | pela aplicação | Compreender |
| Resposta curta | a IA, com gabarito e rubrica | IA com rubrica | Compreender, Aplicar |
| Resposta aberta | a IA, com gabarito e rubrica | IA com rubrica | Aplicar a Criar |

Exemplos, só para ilustrar:

```json
{"formato": "multipla_escolha", "enunciado": "Quem narra Dom Casmurro?",
 "opcoes": ["Bentinho", "Capitu", "José Dias", "Escobar"], "correta": 0}

{"formato": "completar", "enunciado": "José Dias é o ____ da família de Bentinho.",
 "lacunas": [{"resposta": "agregado", "banco": ["agregado", "padrinho", "advogado"]}]}

{"formato": "associar", "pares": [["Capitu", "vizinha de Bentinho"], ["Escobar", "amigo do seminário"]]}
```

## 5. Pontos e níveis

Os pontos passam a crescer com o nível, sem se sobreporem, e a pontuação passa a ter crédito parcial
(pontos × fração certa; as décimas contam).

| Nível | Pontos por pergunta | Soma acumulada para subir | Hoje |
|---|---|---|---|
| Lembrar | 1 a 2 | 8 | 15 |
| Compreender | 3 a 4 | 26 | 45 |
| Aplicar | 5 a 6 | 54 | 91 |
| Analisar | 7 a 8 | 92 | 153 |
| Avaliar | 9 a 10 | 140 | 190 |
| Criar | 11 a 12 | — | — |

Os limiares equivalem a cerca de 5 respostas certas por nível. A Administração e a Área do Leitor passam a usar estes limiares
(o «chegou a Analisar» passa de 92 para 55 pontos). Os dados atuais são poucos (2 roteiros, 3 pontos).

**Alternativa:** subir de nível por domínio (por exemplo, média de 70% nas últimas 5 respostas do nível) em vez de pontos acumulados.
É pedagogicamente mais exato, mas deixa de haver uma pontuação que só sobe. Recomendo a versão dos pontos.

## 6. Escolha das perguntas

- Nunca repetir a mesma estratégia com o mesmo foco no mesmo roteiro.
- Alternar formatos.
- Preferir focos que o leitor explorou no chat e no mapa mental; depois, os restantes.
- Depois de uma resposta fraca (menos de 50%), a pergunta seguinte é uma versão mais fácil (dificuldade 1) do mesmo foco.
- Obras sem ficha validada: o Ponto de Reflexão não arranca e explica porquê (em vez de inventar).

## 7. Avaliação das respostas livres

A IA recebe a pergunta, o gabarito, os critérios da estratégia e a ficha, e devolve estruturado:

```json
{"criterios": [{"nome": "Fidelidade à obra", "nota": 0-2}, ...],
 "pontos_fortes": "...", "a_melhorar": "...", "sugestao_de_leitura": "só se estiver na ficha"}
```

A nota é a soma dos critérios sobre o máximo. Respostas vazias, copiadas da pergunta ou sem relação são recusadas antes de chamar a IA.

## 8. A tabela de estratégias proposta

**42 estratégias** (hoje 63), todas escritas para obras literárias:

| Nível | Estratégias | Formatos |
|---|---|---|
| Lembrar | 8 | escolha múltipla, verdadeiro ou falso, lacunas, associar |
| Compreender | 8 | ordenar, escolha múltipla, associar, resposta curta |
| Aplicar | 6 | resposta curta e aberta, ligadas à vida do leitor |
| Analisar | 7 | resposta aberta |
| Avaliar | 6 | resposta aberta |
| Criar | 7 | resposta aberta |

Duas estratégias de Lembrar e Compreender («Recordar o texto» e «Parafrasear») exigem o texto integral e só se usam em obras de domínio público com texto disponível.

Cada linha tem: `nivel_bloom`, `verbo`, `formato`, `foco`, `dificuldade` (1 ou 2), `pontos`, `exige_texto_integral`,
`modelo_para_a_ia` e `criterios_de_avaliacao`. Pode editar à vontade: remover, acrescentar, mudar o texto de um modelo,
mudar um formato ou os pontos.

## 9. Como entraria na aplicação (por fases, cada uma num PR)

1. **Ficha da obra** (e catálogo de obras, se concordar): tabela `fichas_obra`, geração pela IA e validação na Administração.
2. **Perguntas objetivas**: tabela nova `estrategias` (importada do CSV revisto), formatos objetivos, pontuação pela aplicação e novos pontos e níveis.
3. **Perguntas abertas**: pergunta com gabarito e rubrica, avaliação estruturada, escolha adaptativa, estatísticas por estratégia na Administração e botão «reportar pergunta».

Nada para de funcionar durante a mudança: o motor novo fica atrás de um interruptor nos Secrets (`[CHECKPOINT] MOTOR`),
e a tabela `acoes` fica intacta até validar o novo.
