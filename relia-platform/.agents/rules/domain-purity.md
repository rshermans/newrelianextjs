---
trigger: always_on
---

# Pureza do Domínio

O pacote `packages/domain/` contém lógica pura de negócio. **Nunca** importar:
- React ou qualquer biblioteca de UI
- `server/`, `@libsql/client`, ou qualquer acesso à rede/base de dados
- `next`, `next-intl`, ou qualquer framework

Os ficheiros em `domain/` devem ser **testáveis com Vitest** sem mocks de rede.
Os testes usam os vetores de `docs/migracao-nextjs/anexos/vetores-de-teste.json`.
