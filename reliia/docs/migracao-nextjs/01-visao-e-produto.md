# 01. Visão e produto

## O que é o RELIA

**RELIA** (Roteiro Empático de Leitura com Inteligência Artificial) é uma plataforma de apoio à leitura de obras literárias para estudantes e leitores a partir dos 14 anos. Combina:

1. um **roteiro de leitura** por obra: resumo adaptado ao perfil, conversa com uma IA e temas para explorar;
2. **Pontos de Reflexão**: perguntas de vários tipos, nos seis níveis da Taxonomia de Bloom, **construídas a partir de uma ficha validada da obra** (para serem fiéis à obra), com pontos e níveis;
3. o **Percurso de leitura**: um relatório do que o leitor fez (trajetória, níveis, voz, leitura pela IA, próximo passo);
4. **turmas e professores**, para uso escolar, com privacidade por desenho;
5. **Administração**: catálogo e fichas, perguntas, utilizadores, indicadores, consentimentos, inquérito para estudos científicos.

Está em produção (Streamlit Community Cloud + Turso + OpenAI) em `reliia.streamlit.app`. A conversão para Next.js visa: **desempenho** (a app Streamlit re-executa o ecrã inteiro a cada clique e partilha um processo entre todos os leitores), **UX** (navegação instantânea, resposta em fluxo, mobile) e **acesso direto à base de dados** (consultas pontuais em vez de reconstruir o estado).

## Personas e papéis

| Papel | Como se obtém | O que faz |
|---|---|---|
| **Visitante** | sem conta | Vê a entrada, os Termos, a Privacidade e o Contacto; pode registar-se |
| **Leitor / estudante** | regista-se (≥14 anos, aceita Termos e Privacidade) | Escolhe obras, conversa com a IA, responde a Pontos de Reflexão, vê o relatório, participa na comunidade, entra em turmas, responde ao inquérito |
| **Professor** | pede acesso; a Administração aprova (`usuarios.is_professor`); precisa do «modo professor» ligado | Cria turmas, atribui obras, vê estudantes só por número, relatório da turma, fichas e perguntas validadas por si |
| **Administrador** | `usuarios.is_admin = 1` (primeiros definidos nos segredos `[ADMIN] EMAILS`) | Gere tudo; é o **único** que identifica os números dos estudantes (auditado) |

Os papéis **acumulam-se** (um professor é também leitor). As páginas de professor e de administrador **confirmam o papel na base de dados** a cada abertura (a marca na sessão pode estar desatualizada).

## Âmbito funcional (o que existe hoje)

Leitor: registo/entrada · consentimento por versão dos Termos e da Privacidade · perfil (inclui variante do português) · descarregar os meus dados · eliminar a minha conta · início (leituras em curso) · explorar obras (catálogo em grelha, ou pesquisa livre com sugestões da IA) · pedir uma obra · roteiro (resumo, tópicos, chat com a IA, botões de interesse, mapa mental, infográficos) · Ponto de Reflexão (motor novo, atrás de interruptor; motor antigo legado) · reportar pergunta · Percurso de leitura (relatório) com leitura pela IA, «A sua voz», envio por email · desafio de reescrita · Área do Leitor (roteiros, conquistas, comunidade: fórum e clubes, desafios) · turmas · contacto · inquérito.

Professor: pedido de acesso · turmas (código de convite) · obras atribuídas (do catálogo ou novas) · estudantes por número · relatório agregado da turma · percursos partilhados · fichas próprias · banco de perguntas.

Administração: painel (indicadores + resumo semanal pela IA) · pedagogia (funil, níveis, obras onde ficam a meio) · utilizadores · obras e roteiros · catálogo e fichas (inclui imagens do Commons) · perguntas (estratégias, reportes) · professores (pedidos, turmas, fichas, identidades) · contactos · inquérito (resultados, exportação) · moderação do fórum · auditoria · sistema (uso da IA, erros, definições, consentimentos).

Ver o detalhe, ecrã a ecrã, em [02](02-fluxos-e-ecras.md).

## Fora de âmbito / não portar

- **Motor antigo de perguntas** (tabela `acoes`, `views/checkpoint.py`, `utils/bloom_level_info.py`): é legado; a conversão deve implementar **só o motor novo** (tabela `estrategias`). Atenção: **as respostas antigas existem na base** (`checkpoints` sem `formato`) e o relatório tem de as ler (ver doc 04, secção «Relatório»).
- `feedback_automatizado` (relatório antigo), `views/auth_config.py` (streamlit-authenticator, não usado), `utils/estruturas_de_dados.py`, `utils/chkFuncoes.py`, `utils/popup.py`, `utils/criar_dataframes.py`, `utils/api.py` (partes antigas): ver [11](11-problemas-conhecidos-e-divida.md).
- Gerar imagens por IA (adiado), PDF do relatório (nunca existiu na versão atual; só email HTML), relatório de turma por email.

## Requisitos não funcionais a respeitar

- **Idioma:** interface em PT-PT. A IA responde na variante do leitor (PT-PT por omissão, PT-BR opcional); fichas partilhadas são sempre em PT-PT.
- **Menores:** idade mínima 14 anos; RGPD/Política de Privacidade são parte do produto (doc 08).
- **Disponibilidade das fichas:** nenhuma pergunta nova é gerada para uma obra **sem ficha validada** (o ecrã explica porquê).
- **Custos de IA contidos:** gerar só a pedido quando possível (leitura pela IA, infográfico, mapa), guardar resultados (cache em base de dados) e limitar por leitor/dia.
- **Reversibilidade:** interruptores em `configuracoes`; nada se apaga ao desligar.
- **Auditável:** ações de administração na tabela `auditoria`; uso da IA na tabela `uso_llm`.

## Números úteis (ordem de grandeza)

- 36 tabelas; ~40 ecrãs; 42 estratégias de pergunta; 7 formatos de pergunta; 6 níveis de Bloom; 11 secções de administração.
- Um leitor tem **um roteiro por obra**. Mensagens de chat e Pontos de Reflexão crescem por roteiro.
- Escala atual: dezenas de leitores simultâneos no máximo (ver `docs/escala.md`); o objetivo do Next.js é centenas, com a IA e a base de dados como limites.

## Glossário

- **Roteiro**: registo da leitura de uma obra por um leitor (`roteiros`); contém conversa, resumo, mapa mental, infográficos, Pontos de Reflexão.
- **Ficha (da obra)**: JSON factual validado por uma pessoa (resumo, personagens, temas, acontecimentos pela ordem, símbolos…). É a **única fonte de factos** das perguntas. Estados: `rascunho`, `validada`. Há fichas **do catálogo** (`fichas_obra`) e fichas **de professor** (`fichas_professor`), estas válidas só para as suas turmas.
- **Catálogo**: obras com `no_catalogo = 1` e ficha validada. Quando ativo, o leitor só escolhe obras novas do catálogo.
- **Estratégia**: tipo de pergunta (verbo + nível + formato + foco + pontos); 42 na tabela `estrategias`.
- **Ponto de Reflexão**: uma pergunta respondida (linha em `checkpoints`), com nota em pontos.
- **Níveis de Bloom** (por esta ordem): Lembrar, Compreender, Aplicar, Analisar, Avaliar, Criar.
- **Percurso de leitura**: o relatório do leitor numa obra.
- **A sua voz**: indicadores linguísticos por contagem sobre as respostas escritas.
- **Desafio de reescrita**: reescrever uma resposta aberta fraca (sem pontos).
- **Turma / código de convite / número**: o professor cria turmas; o estudante entra com o código e recebe um **número aleatório** (100–999) único na turma («Aluno 154»).
- **Partilha do percurso**: opção do estudante, por turma, que deixa o professor ver as suas respostas escritas, notas e feedback (sempre pelo número).
- **Modo professor**: interruptor global (`configuracoes.modo_professor`).
- **Motor novo / antigo de perguntas**: interruptor `configuracoes.motor_perguntas` (`novo`/`antigo`); muda os limiares dos níveis.
