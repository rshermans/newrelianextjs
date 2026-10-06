# Professores e turmas

Modo atrás de um interruptor (Administração → 🏫 Professores → «Modo professor ligado»), desligado por omissão. Desligar não apaga nada.

## Quem é professor
O utilizador pede acesso em «As minhas turmas → Sou professor/a» (escola e motivo). A Administração aprova ou recusa em 🏫 Professores → Pedidos. Retirar o acesso arquiva as turmas do professor.

## O que o professor faz (Painel do professor)
- Cria turmas, cada uma com um código de 6 letras e números (sem 0/O/1/I). Pode trocar o código, arquivar, reabrir e apagar.
- Atribui obras do catálogo à turma, com prazo e orientação opcionais.
- Vê os estudantes **só por um número aleatório da turma** («Aluno 154»), com obras iniciadas, respostas, pontos e última resposta **nas obras atribuídas**.

## Privacidade por desenho
- Os estudantes entram com o código, depois de lerem e confirmarem o aviso. Podem sair quando quiserem.
- Cada estudante recebe um número aleatório (100 a 999) único na turma, sorteado sem relação com a ordem de entrada.
- O professor **nunca** vê nome, email, mensagens nem o texto das respostas. `utils/professor.estudantes_da_turma` não devolve identidade.
- **Só a Administração** vê quem é cada número (Administração → Professores → Turmas → «Ver a identidade dos estudantes»), e cada consulta fica na auditoria (`ver_identidades_turma`).
- Em turmas pequenas, quem conhece bem a turma pode deduzir quem é um número; a Política di-lo.
- Termos e Política de Privacidade passaram à versão 2026-10-04: todos voltam a aceitar.

## Dados
Tabelas `pedidos_professor`, `turmas`, `turma_membros` (número aleatório), `turma_obras`; coluna `usuarios.is_professor`. Entram em «Descarregar os meus dados» e apagam-se com a conta (a conta de um professor leva as suas turmas).

## Parte 2
- **Relatório da turma** (separador «Relatório da turma», por obra): estudantes que já responderam, nota média, estudantes por nível atingido, média por nível de Bloom, tendência, onde a turma tem mais dificuldade (tipos de pergunta com pelo menos 3 respostas), estudantes sem respostas, reportes por motivo, cobertura da ficha e tabela por número com exportação CSV. Nunca mostra nomes, emails, mensagens nem texto das respostas. A cobertura da ficha, que se calcula sobre o texto, só aparece com pelo menos 5 estudantes com respostas escritas.
- **Fichas do professor** (separador «Fichas»): o professor gera um rascunho com IA, preenche à mão ou parte da ficha do catálogo, e valida. Vale **só para os estudantes das suas turmas** (com a turma aberta e a obra atribuída) e substitui a do catálogo para eles; as perguntas passam a usá-la (`utils/professor.ficha_efetiva`). A Administração pode **promover** a ficha para o catálogo (Administração → Professores → Fichas, com auditoria).
- **Obras fora do catálogo:** o professor pode adicionar uma obra (título e autor) e atribuí-la; fica disponível aos estudantes da turma mesmo com o catálogo restrito.

## Parte 3
- **Partilha opcional do percurso:** em «As minhas turmas», cada estudante pode ligar «Partilhar o meu percurso com o professor» (desligado por omissão, reversível). O professor passa então a ver, em «Percursos partilhados», a trajetória, a média por nível, as respostas escritas, as notas e o feedback desse estudante nas obras da turma, sempre com o número. A Política de Privacidade diz isto; como a opção tem o seu próprio aviso e consentimento, não foi preciso subir a versão dos documentos.
- **Banco de perguntas do professor** (separador «Perguntas»): o professor pede propostas (feitas pelo mesmo motor das perguntas dos estudantes, a partir da ficha dele ou do catálogo; só duas por pedido usam IA), aprova ou rejeita cada uma, e pode escrever perguntas abertas suas, com pontos-chave. As aprovadas passam a ter **prioridade** para os estudantes das suas turmas (turma aberta, obra atribuída), **uma vez por estudante**; sem pergunta aprovada para o tipo escolhido, o motor gera como sempre (`utils/banco_perguntas.py`, `escolher_pergunta`). Limite de 60 perguntas por obra.

## Por fazer
Desafio de reescrita, imagens das obras e documentação geral.
