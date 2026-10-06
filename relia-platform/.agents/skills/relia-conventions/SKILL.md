---
name: relia-conventions
description: >-
  Convenções de código, arquitectura e padrões do RELIA Platform.
  Activar quando for necessário criar componentes, Server Actions,
  Route Handlers ou consultas à base de dados.
---

# Convenções do RELIA Platform

## Server Actions
Devolvem sempre um objecto tipado:
```typescript
type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; erro: string; campos?: Record<string, string> };
```

## Componentes UI
- Usar shadcn/ui (Radix) de `@relia/ui`.
- Tema escuro como opção; Tailwind CSS.
- Icons: `lucide-react`.
- Toasts: Sonner.
- Formulários: React Hook Form + esquema Zod de `@relia/validation`.

## Consultas à Base
- Drizzle ORM via `@relia/db`.
- Consultas tipadas em `packages/db/src/queries/`.
- Nunca N+1; usar joins e subconsultas.
- Cache com revalidação por etiqueta para dados quase estáticos.

## Testes
- Domínio: Vitest com vetores de `vetores-de-teste.json`.
- E2E: Playwright.
- IA: MSW (Mock Service Worker) para servidor falso da OpenAI.

## Estrutura de Ficheiros (Apps)
```
src/
  app/           → Rotas App Router
  components/    → Componentes específicos da app
  lib/           → Utilitários específicos
  messages/      → i18n (pt-PT.json, pt-BR.json)
```
