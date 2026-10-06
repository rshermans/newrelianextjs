# Inquérito interno, contacto, termos e privacidade: proposta para rever

Nada disto está no código. Vem da conversa de 3 de outubro; só avanço depois de aprovada.
A barra lateral já está implementada no [PR #15](https://github.com/rshermans/reliia/pull/15) e prevê um sítio para cada coisa: o botão do inquérito e o de ajuda passam a abrir estas páginas quando existirem.

## 1. Inquérito dentro da aplicação

**Faz sentido, e recomendo.** Os dados ficam na nossa base, cruzam-se com o uso real (nível, pontos, obras, variante do português) sem exportar nem juntar ficheiros, e não dependemos do Zoho nem de um endereço curto.

**Como funcionaria**

| Parte | Desenho |
|---|---|
| Questionário | Um ou mais inquéritos, cada um com título, introdução, estado (rascunho, ativo, arquivado) e versão. Perguntas de tipos: escala (1 a 5 ou 0 a 10), escolha única, escolha múltipla, sim/não e texto livre, obrigatórias ou não |
| Editor (Administração → 📋 Inquéritos) | Criar e ordenar perguntas, pré-visualizar como o leitor vê, ativar e arquivar. Depois de ter respostas, o inquérito não se edita: cria-se uma nova versão (para os resultados continuarem comparáveis) |
| Resposta do leitor | Página «Inquérito» (o botão do rodapé abre-a), com um formulário só; um leitor responde uma vez por versão e pode corrigir enquanto estiver ativo. Opcionalmente, um convite discreto depois de um número de Pontos de Reflexão, com «Agora não» |
| Resultados (Administração) | Por pergunta: distribuição, média, texto livre listado; filtros por data, versão e grupo (nível, variante, escolaridade) |
| **Exportação** | CSV e Excel, com uma linha por resposta e uma coluna por pergunta (e, se permitido, o perfil agregado); tudo na auditoria |
| Apagar | Apagar respostas de um inquérito ou de um leitor (direito ao apagamento) |
| Ligação externa | Fica como alternativa: em Definições escolhe-se «inquérito interno» ou «ligação externa» (o que já existe) |

**Decisões que preciso de si**
1. **Anónimo ou identificado?** Recomendo **anónimo por omissão**, que dá respostas mais sinceras e simplifica o RGPD: guarda-se só um grupo (faixa etária, escolaridade, nível) e não o utilizador. Para estudos que precisem de cruzar com o desempenho individual, o inquérito pode ser marcado «identificado», com aviso claro ao leitor antes de responder.
2. **As perguntas do inquérito atual (Zoho).** Preciso delas (copiadas, ou o export) para as recriar tal e qual e manter a continuidade com as respostas já recolhidas. Não consigo ver o conteúdo do Zoho a partir daqui.
3. As respostas antigas do Zoho: importam-se para a mesma tabela (se me der o CSV) ou ficam à parte?

Tabelas novas: `inqueritos`, `inquerito_perguntas`, `inquerito_respostas`.

## 2. Formulário de contacto

**Faz sentido.** Hoje o leitor não tem como falar connosco senão pelo email; um formulário dá contexto (quem é, onde estava) e fica registado.

- **Página «Contacto»** (rodapé da barra e ecrã de entrada, para quem ainda não tem conta): categoria (dúvida, problema técnico, sugestão, pedido de dados pessoais, outro), assunto, mensagem, e o email pré-preenchido se houver sessão. Aceita a política de privacidade.
- **Guarda-se na base** (`contactos`) e **envia-se aviso para `relia.informa@gmail.com`** pelo mesmo envio de email que já existe para a recuperação de palavra-passe (se o envio falhar, o contacto não se perde).
- **Administração → 📥 Contactos:** caixa de entrada com estado (novo, em curso, respondido), nota interna, resposta por email (abre o seu cliente de email com o assunto e o texto pré-preenchidos) e exportação.
- **Anti-spam:** limite por utilizador e por hora, campo-armadilha, tamanho máximo.
- Os pedidos de dados pessoais (acesso, correção, apagamento) ficam marcados para tratar dentro do prazo legal.

Nota: o endereço que me deu veio sem o `@` («relia.informagmail.com»). Usei **relia.informa@gmail.com** na barra e no menu; corrija-me se estiver errado.

## 3. Termos de uso e de responsabilidade, e política de privacidade

**Faz muito sentido, e é a parte mais importante dos três.** A aplicação recolhe dados pessoais (nome, email, idade, cidade, interesses, escolaridade, conversas e respostas) e envia texto a serviços externos. O que existe hoje:

- Dois textos curtos (`assets/termos.md`, 283 palavras, e `assets/privacidade.md`, 214), de outubro de 2024, em português do Brasil, e duas ligações para páginas do Notion no registo e no perfil.
- Não referem: os fornecedores a quem os dados chegam (a OpenAI recebe as perguntas e respostas dos leitores; o Turso guarda a base; o Streamlit aloja a aplicação), a duração da conservação, os direitos concretos e como os exercer, o responsável pelo tratamento e o contacto, nem as limitações da IA (pode errar; as fichas são revistas, mas não são infalíveis).
- Os termos dizem «pelo menos 13 anos» e o perfil exige 14: tem de haver um só valor.
- A política fala em «criptografia de dados» e «backup regular»: só pode afirmar o que for verdade (palavras-passe com hash bcrypt e ligações cifradas são verdade; backups regulares dependem do plano do Turso e convém confirmar).

**Proposta**
1. **Páginas dentro da aplicação**, «Termos de uso e responsabilidade» e «Política de privacidade», em PT-PT, em ficheiros do repositório com **versão e data**, abertas pelo rodapé e pelo registo (sem depender do Notion).
2. **Registo do consentimento** (`consentimentos`: utilizador, documento, versão, data). Quando a versão muda, o leitor é convidado a ler e aceitar de novo. O administrador vê quem aceitou o quê, e exporta.
3. Conteúdo que eu redijo para si rever: o que é o RELIA e os seus limites (apoio à leitura, não substitui o professor nem a leitura da obra, a IA pode errar); uso aceitável; contas e menores; conteúdos de terceiros (obras, capas, links de texto integral só em domínio público); responsabilidade; dados pessoais (responsável pelo tratamento, finalidades, bases legais, conservação, subcontratantes e transferências para fora da UE, direitos e como exercê-los, contacto); cookies/armazenamento; lei aplicável e foro.
4. Botões «Descarregar os meus dados» e «Eliminar a minha conta e dados» no perfil (a eliminação em cascata já existe na Administração).

**Aviso importante:** eu posso redigir e implementar, mas **não sou jurista**. Os textos devem ser **revistos por quem trata da proteção de dados na sua instituição** (a universidade tem um encarregado de proteção de dados), sobretudo se a aplicação for usada com estudantes e em contexto de investigação (pode exigir parecer da comissão de ética e consentimento específico para o inquérito).

## 4. Ordem de trabalho sugerida
1. **PR #15** (barra lateral, inquérito configurável com QR, variante do português): pronto para rever.
2. **Termos e privacidade** (páginas e consentimento): o que tem mais risco de ficar por fazer, e o contacto precisa da política.
3. **Contacto.**
4. **Inquérito interno**, quando me der as perguntas do Zoho.
