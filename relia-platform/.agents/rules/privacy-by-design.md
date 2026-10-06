---
trigger: always_on
---

# Privacidade por Desenho

Regras de privacidade inegociáveis no RELIA:

1. **IA**: Nome e email do leitor **nunca** são enviados à IA. Usar apenas `perfilParaIA()` que devolve idade, cidade e interesses.
2. **Professor**: `utils/professor.estudantes_da_turma` e equivalentes **nunca** devolvem nome, email nem texto das respostas.
3. **Administração**: Consultar a identidade dos estudantes (número → nome) **grava na auditoria** (`ver_identidades_turma`).
4. **Menores**: Idade mínima de 14 anos no registo.
5. **Consentimento**: Termos e Privacidade aceites por versão; nova versão obriga a novo aceite.
6. **Exportar/Eliminar**: O leitor pode descarregar (JSON) e eliminar a sua conta (cascata completa).
