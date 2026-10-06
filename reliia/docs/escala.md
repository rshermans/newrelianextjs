# Quantos leitores em simultâneo aguenta o RELIA?

Resposta curta: **o Streamlit não tem um limite fixo, mas não escala sozinho**. Cada leitor ocupa uma sessão num único processo Python, por isso o limite é o que a máquina aguenta (memória e processador) e o que os serviços externos aceitam (base de dados e IA). Mede-se, não se adivinha: há um script para isso.

## 1. Como funciona, e porque "escalar" é diferente do habitual
- Cada separador aberto é uma **sessão** com o seu estado em memória, ligada por websocket a **um processo** Python. Não há estado partilhado entre processos.
- Para aguentar mais gente há duas saídas: **uma máquina maior** ou **várias réplicas** atrás de um balanceador com *sessões fixas* (cada leitor volta sempre à mesma réplica). O Streamlit Community Cloud não permite réplicas; só uma máquina limitada.
- O Python executa código de uma sessão de cada vez por processo (GIL). A espera pela IA e pela base de dados não bloqueia os outros (são pedidos de rede), mas o desenho dos ecrãs e as contas sim.

## 2. O que a plataforma atual dá
Segundo a documentação do Streamlit Community Cloud (valores que **podem mudar sem aviso**):
- **Processador:** de 0,078 a 2 núcleos. **Memória:** de 690 MB a 2,7 GB. Disco: até 50 GB.
- Não há limite fixo de utilizadores em simultâneo: depende de quanta memória e processador cada sessão usa.
- Apps sem tráfego durante 12 horas **hibernam**; o primeiro leitor espera que arranquem.
- Ao ultrapassar os limites, a app abranda (limitação de processador) ou reinicia (memória).

Fonte: [documentação](https://docs.streamlit.io/deploy/streamlit-community-cloud/manage-your-app) e a discussão dos [limites de recursos](https://discuss.streamlit.io/t/common-app-problems-resource-limits/16969).

## 3. O que medi (cópia local, IA e capas simuladas)
Script: [`scripts/teste_carga.js`](../scripts/teste_carga.js). Cada leitor simulado faz: entrar, abrir «Explorar obras», pesquisar uma obra, abri-la e perguntar no chat. Máquina de teste: 4 núcleos e 16 GB, **partilhados com os 30 navegadores que simulam os leitores**, o que penaliza os tempos medidos.

| Leitores em simultâneo | Entrar (mediana / pior 5%) | Abrir a obra | Memória do servidor | Falhas |
|---|---|---|---|---|
| 3 | 1,5 s | 2,4 s | | 0 |
| 10 | 5,9 s / 9,1 s | 4,6 s / 5,4 s | 58 → 356 MB | 0 |
| 30 | 24 s / 28 s | 7 s / 16 s | 58 → 394 MB | o passo do chat não terminou em 120 s |

O que se tira disto:
1. **A memória não é o problema.** O processo passa de 58 MB para cerca de 350 MB logo na primeira sessão (é o custo de carregar as bibliotecas) e depois cada sessão acrescenta pouco: 30 leitores ficaram em 394 MB, bem abaixo dos 2,7 GB. A base de 350 MB é, sim, perto do mínimo garantido (690 MB), por isso convém não a engordar.
2. **O processador é o primeiro limite.** Entrar custa processador (verificação da palavra-passe com bcrypt, de propósito) e uma turma a entrar toda ao mesmo tempo é o pior momento. Com 10 leitores tudo ficou abaixo de 6 s (mediana); com 30, entrar demorou 24 s, mas este número está inflacionado porque a mesma máquina corria 30 navegadores.
3. **Não consigo dizer, a partir deste teste, qual é o limite real do passo do chat** com 30 leitores, porque a máquina de teste estava saturada pelos simuladores. O teste que conta é feito numa cópia com a máquina e a base de dados reais.

## 4. Os outros dois limites, que não são do Streamlit
- **A IA (OpenAI):** limites de pedidos e de tokens por minuto da chave. Com o modelo atual (de raciocínio, lento), uma turma a pedir resumos em simultâneo é o mais provável gargalo e o que mais custa. Já guardamos resumos, mapas e infográficos para não repetir pedidos.
- **A base de dados (Turso, remota):** cada interação faz várias consultas pela rede. Mais leitores = mais viagens de ida e volta; a região do Turso perto de onde corre a app faz diferença.

## 5. O que se pode fazer, por ordem de custo
1. **Já, sem mexer na plataforma:** carregar menos coisas no arranque (importar só quando se usa as bibliotecas pesadas dos relatórios: `sklearn`, `nltk`, `seaborn`, `wordcloud`) para baixar os ~350 MB de base, e continuar a pôr em cache as consultas repetidas. É uma tarefa pequena e mede-se antes e depois.
2. **Antes de uma turma grande:** pedir aos alunos que entrem escalonados (não todos no mesmo segundo) e ter o modelo e os limites da chave da OpenAI dimensionados para o pico.
3. **Medir a sério:** correr o script contra uma cópia da aplicação, na plataforma onde vai viver, com a IA real mas com limite de custo, e com 10, 25 e 50 leitores. Dá-nos o limite verdadeiro, sem adivinhar.
4. **Se não chegar:** passar para uma máquina nossa (contentor com 2 a 4 GB, na universidade ou num fornecedor) e, se for preciso, mais do que uma réplica com sessões fixas. A aplicação não precisa de mudar para isso; só o sítio onde corre.

**Em ordens de grandeza (estimativa, a confirmar com a medição 3):** para turmas de algumas dezenas de leitores a plataforma atual deve servir, com entradas escalonadas; para centenas em simultâneo, convém uma máquina própria.

## 6. Arranque mais leve (medido)
Depois do primeiro teste, as bibliotecas pesadas que só os relatórios usam (`scikit-learn`, `wordcloud`, `matplotlib`, `pandas`, `plotly.express`, `pdfkit`, `tiktoken`, `google.generativeai`) passaram a carregar-se **só quando se usam**, e saíram três importações que nem sequer eram usadas (`networkx`, `nltk` e um `vectorizer` global). Medido na mesma máquina, duas execuções de cada versão, com o mesmo leitor a entrar e a abrir o relatório de leitura:

| | Antes | Depois |
|---|---|---|
| Memória do servidor logo depois de um leitor entrar | 332 MB | **106 MB** |
| Tempo de carregamento dos módulos no arranque | 2,6 s | **0,4 s** |
| Primeiro acesso a frio (entrar) | 10,1 s | **8,2 s** |
| Primeiro relatório de leitura (uma vez por servidor) | 6,8 s | 9,2 s (**+2,4 s**) |
| Relatórios seguintes | 3,8 s | 3,8 s |
| Memória depois do primeiro relatório | 360 MB | **276 MB** |
| Conteúdo do relatório (gráficos, imagens, erros) | 2 gráficos, 3 imagens, sem erros | igual |

Em resumo: o arranque (e o despertar depois de 12 horas de hibernação) ficam cerca de 2 segundos mais rápidos e a base de memória cai dois terços; o único custo é que **o primeiro leitor que abrir um relatório depois de o servidor arrancar espera mais ~2,4 segundos**, e só nessa vez.

**Nota sobre os testes de carga:** um robô que escreve o email e a palavra-passe com milissegundos de intervalo perde o texto da palavra-passe quando a aplicação responde depressa (a execução disparada pelo email repõe o campo antes de o Tab o confirmar). Um leitor humano não escreve tão depressa. O script `scripts/teste_carga.js` já espera entre campos.
