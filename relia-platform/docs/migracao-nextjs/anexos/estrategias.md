# Anexo: as 42 estratégias de pergunta

Importadas de `docs/pontos-de-reflexao/estrategias-proposta.csv` para a tabela `estrategias` quando esta está vazia (`utils/perguntas.garantir_estrategias`). Editáveis na Administração.

- **formato:** multipla_escolha, verdadeiro_falso, completar, associar, ordenar (objetivos, construídos pela aplicação, sem IA, exceto «multipla_escolha/motivacao»), resposta_curta, resposta_aberta (escritas pela IA e avaliadas por critérios).
- **foco:** o que da ficha da obra alimenta a pergunta (autor, personagem, genero, contexto, narrador, enredo, simbolo, tema, recurso, dilema, estrutura, estilo, critica, motivacao, vida).
- **modelo:** instrução com campos {obra}, {autor}, {personagem}, {personagem2}, {tema}, {tema2}, {simbolo}, {recurso}, {dilema}, {contexto}. Só as abertas têm.

| id | nível | verbo | formato | foco | dific. | pontos | texto integral | critérios | modelo |
|---|---|---|---|---|---|---|---|---|---|
| 101 | Lembrar | Identificar | multipla_escolha | autor | 1 | 1 |  |  | Escolha múltipla: quem escreveu '{obra}' ou em que século foi publicada. Uma opção correta e três plausíveis do mesmo idioma e período. |
| 102 | Lembrar | Reconhecer | multipla_escolha | personagem | 1 | 1 |  |  | Escolha múltipla: «Quem é {personagem} em '{obra}'?». Opções: o papel correto e três papéis de outras personagens da ficha. |
| 103 | Lembrar | Verificar | verdadeiro_falso | enredo | 1 | 1 |  |  | Três afirmações sobre acontecimentos ou factos da ficha de '{obra}', verdadeiras e falsas misturadas. O leitor marca cada uma. |
| 104 | Lembrar | Completar | completar | personagem | 1 | 1 |  |  | Frase sobre {personagem} com uma lacuna, retirada da ficha, com banco de três palavras. |
| 105 | Lembrar | Nomear | associar | personagem | 2 | 2 |  |  | Associar quatro personagens de '{obra}' às suas descrições curtas (colunas embaralhadas). |
| 106 | Lembrar | Classificar | multipla_escolha | genero | 2 | 2 |  |  | Escolha múltipla: género literário ou movimento a que '{obra}' pertence. |
| 107 | Lembrar | Situar | multipla_escolha | contexto | 2 | 2 |  |  | Escolha múltipla: época ou lugar em que decorre a ação de '{obra}'. |
| 108 | Lembrar | Recordar o texto | completar | trecho | 2 | 2 | sim |  | Trecho real e curto de '{obra}' com uma palavra em falta (só para obras com texto integral). |
| 201 | Compreender | Ordenar | ordenar | enredo | 1 | 3 |  |  | Ordenar quatro acontecimentos principais de '{obra}' pela ordem em que ocorrem. |
| 202 | Compreender | Classificar | multipla_escolha | narrador | 1 | 3 |  |  | Escolha múltipla: que tipo de narrador conta '{obra}' e o que isso implica para o leitor. |
| 203 | Compreender | Associar | associar | simbolo | 2 | 4 |  |  | Associar três símbolos ou imagens de '{obra}' aos seus significados. |
| 204 | Compreender | Inferir | multipla_escolha | motivacao | 2 | 4 |  |  | Escolha múltipla: porque age {personagem} de certa forma. Só uma opção é apoiada pela ficha. |
| 205 | Compreender | Explicar | resposta_curta | tema | 1 | 3 |  | Fidelidade à obra; Fundamentação em elementos do texto; Clareza | Peça uma explicação com as palavras do leitor, em uma ou duas frases, do que significa o tema {tema} em '{obra}'. |
| 206 | Compreender | Resumir | resposta_curta | enredo | 1 | 3 |  | Fidelidade à obra; Fundamentação em elementos do texto; Clareza | Peça um resumo do conflito central de '{obra}' em três frases. |
| 207 | Compreender | Parafrasear | resposta_curta | trecho | 2 | 4 | sim | Fidelidade à obra; Fundamentação em elementos do texto; Clareza | Dê um trecho real curto e peça que o leitor o diga por outras palavras. |
| 208 | Compreender | Comparar | resposta_curta | personagem | 2 | 4 |  | Fidelidade à obra; Fundamentação em elementos do texto; Clareza | Peça a diferença principal entre {personagem} e {personagem2}, em duas frases. |
| 301 | Aplicar | Relacionar | resposta_curta | vida | 1 | 5 |  | Liga corretamente a obra ao exemplo; Justifica a relação; Clareza | Peça um exemplo de uma situação atual, da vida do leitor ou do mundo, em que se veja o tema {tema} de '{obra}'. |
| 302 | Aplicar | Usar | resposta_curta | simbolo | 1 | 5 |  | Liga corretamente a obra ao exemplo; Justifica a relação; Clareza | Peça um objeto do dia a dia que possa simbolizar {tema} e uma explicação curta, ao estilo de {simbolo}. |
| 303 | Aplicar | Transpor | resposta_aberta | contexto | 2 | 6 |  | Liga corretamente a obra ao exemplo; Justifica a relação; Clareza | Peça como seria a história de {personagem} se vivesse hoje, mantendo o que a define. |
| 304 | Aplicar | Demonstrar | resposta_curta | recurso | 2 | 6 |  | Liga corretamente a obra ao exemplo; Justifica a relação; Clareza | Peça um exemplo de {recurso} (um recurso literário da ficha) na obra, com a explicação do seu efeito. |
| 305 | Aplicar | Aconselhar | resposta_aberta | dilema | 2 | 6 |  | Liga corretamente a obra ao exemplo; Justifica a relação; Clareza | Peça o conselho que o leitor daria a {personagem} perante {dilema}, justificado com factos da obra. |
| 306 | Aplicar | Dramatizar | resposta_aberta | tema | 2 | 6 |  | Liga corretamente a obra ao exemplo; Justifica a relação; Clareza | Peça um diálogo breve entre {personagem} e {personagem2} sobre {tema}. |
| 401 | Analisar | Examinar motivos | resposta_aberta | motivacao | 1 | 7 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça uma análise das causas da decisão de {personagem} em '{obra}', com dois momentos do texto. |
| 402 | Analisar | Interpretar símbolo | resposta_aberta | simbolo | 1 | 7 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça a interpretação de {simbolo} em '{obra}': o que representa e como muda ao longo da história. |
| 403 | Analisar | Relacionar causa e efeito | resposta_aberta | enredo | 2 | 8 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça uma cadeia de causa e efeito entre dois acontecimentos centrais da ficha. |
| 404 | Analisar | Examinar a voz | resposta_aberta | narrador | 2 | 8 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça como o tipo de narrador condiciona o que sabemos e acreditamos em '{obra}'. |
| 405 | Analisar | Ligar ao contexto | resposta_aberta | contexto | 2 | 8 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça de que modo {contexto} aparece na obra, com um exemplo concreto. |
| 406 | Analisar | Distinguir | resposta_aberta | tema | 2 | 8 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça a diferença entre {tema} e {tema2} na obra e como se cruzam. |
| 407 | Analisar | Estrutura | resposta_aberta | estrutura | 2 | 8 |  | Identifica o elemento certo; Explica a relação com o sentido da obra; Apoia-se em momentos concretos | Peça uma análise de como a estrutura (partes, tempo, capítulos) serve o sentido da obra. |
| 501 | Avaliar | Julgar uma decisão | resposta_aberta | personagem | 1 | 9 |  | Fundamenta a posição; Usa exemplos da obra; Considera outro ponto de vista | Pergunte se o leitor concorda com a decisão de {personagem} e peça dois momentos da obra que apoiem a opinião. |
| 502 | Avaliar | Avaliar interpretações | resposta_aberta | critica | 2 | 10 |  | Fundamenta a posição; Usa exemplos da obra; Considera outro ponto de vista | Apresente duas leituras críticas da ficha sobre '{obra}' e peça ao leitor que escolha uma e justifique. |
| 503 | Avaliar | Criticar o final | resposta_aberta | enredo | 2 | 10 |  | Fundamenta a posição; Usa exemplos da obra; Considera outro ponto de vista | Peça uma avaliação do final de '{obra}': resolve o que a história abriu? |
| 504 | Avaliar | Avaliar a atualidade | resposta_aberta | tema | 2 | 10 |  | Fundamenta a posição; Usa exemplos da obra; Considera outro ponto de vista | Peça se {tema} continua relevante hoje e porquê, com um exemplo. |
| 505 | Avaliar | Avaliar o estilo | resposta_aberta | estilo | 2 | 10 |  | Fundamenta a posição; Usa exemplos da obra; Considera outro ponto de vista | Peça uma avaliação de um traço de estilo da ficha: serve bem a história? |
| 506 | Avaliar | Defender uma tese | resposta_aberta | tema | 2 | 10 |  | Fundamenta a posição; Usa exemplos da obra; Considera outro ponto de vista | Dê uma tese polémica sobre {tema} em '{obra}' e peça que o leitor a defenda ou a refute. |
| 601 | Criar | Mudar a perspetiva | resposta_aberta | personagem | 1 | 11 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça a reescrita de uma cena do ponto de vista de {personagem}, mantendo o que a ficha diz da obra. |
| 602 | Criar | Imaginar um final | resposta_aberta | enredo | 1 | 11 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça um final alternativo coerente com as personagens, e que explique o que muda. |
| 603 | Criar | Escrever uma carta | resposta_aberta | personagem | 1 | 11 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça uma carta ou página de diário de {personagem} depois de um momento-chave. |
| 604 | Criar | Entrevistar | resposta_aberta | autor | 2 | 12 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça três perguntas que o leitor faria a {autor} sobre '{obra}' e o motivo de cada uma. |
| 605 | Criar | Adaptar | resposta_aberta | enredo | 2 | 12 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça uma adaptação em outro meio (guião de um minuto, capa e sinopse, banda desenhada em seis quadros). |
| 606 | Criar | Compor | resposta_aberta | tema | 2 | 12 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça um pequeno poema ou epígrafe inspirado em {tema}, com uma linha a explicar a ligação à obra. |
| 607 | Criar | Inventar uma personagem | resposta_aberta | tema | 2 | 12 |  | Coerência com a obra; Originalidade; Qualidade da escrita | Peça uma personagem nova que dialogue com {tema} e como interagiria com {personagem}. |
