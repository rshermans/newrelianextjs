---
trigger: always_on
---

# Internacionalização (i18n)

- Todos os textos visíveis ao utilizador devem estar em `messages/pt-PT.json` (e opcionalmente `pt-BR.json`).
- **Nenhum texto** fixo no código TypeScript/TSX. Usar sempre `useTranslations()` de `next-intl`.
- Conteúdo partilhado (fichas das obras) é sempre em PT-PT.
- A IA responde na variante do leitor (`usuarios.variante_pt`).
- Exceções: nomes de variáveis, logs técnicos, comentários no código.
