# RELIA Platform

**Roteiro Empático de Leitura com Inteligência Artificial**

Plataforma agêntica de mediação leitora para o ensino secundário e investigação em Ciências da Linguagem / Humanidades Digitais (CEHUM / Universidade do Minho).

---

## 🏛️ Arquitectura

| Serviço | Tecnologia | Porta | Descrição |
|---------|-----------|-------|-----------|
| **App Aluno** | Next.js (App Router) | 3000 | Leitura, chat com IA, Pontos de Reflexão, percurso |
| **App Professor** | Next.js (App Router) | 3001 | Turmas, fichas, banco de perguntas, Relia Skills |
| **FastAPI** | Python FastAPI | 8000 | 3 Skills Agênticas + orquestrador |
| **MCP Server** | Python FastMCP | 8001 | Corpus literário (obras, exames) |

### 3 Skills Agênticas

| Skill | Competência | Mecanismo |
|-------|-------------|-----------|
| **Extrator Discursivo** | Análise estilística e retórica | spaCy/PLN + figuras de estilo |
| **Formulador Socrático** | Perguntas interpretativas (Bloom) | RAG sobre corpus + exames |
| **Avaliador Metacognitivo** | Análise de respostas + feedback | Embeddings + validação |

### Pacotes Partilhados

| Pacote | Descrição |
|--------|-----------|
| `@relia/domain` | Lógica pura (níveis, fichas, perguntas, relatório, linguística) |
| `@relia/db` | Drizzle ORM + Turso/libSQL (36 tabelas) |
| `@relia/ui` | Componentes shadcn/ui + design system |
| `@relia/validation` | Esquemas Zod (auth, obras, IA contracts) |
| `@relia/config` | Variáveis de ambiente + constantes |

---

## 🚀 Como Executar

### Opção A: Docker Compose (Recomendado)

```bash
# Windows
Iniciar-Relia.bat

# Linux/macOS
chmod +x Iniciar-Relia.sh && ./Iniciar-Relia.sh
```

Ou diretamente:

```bash
cp .env.example .env   # Preencher os valores
docker compose up -d --build
```

### Opção B: Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar ambas as apps em modo dev
pnpm dev

# Ou apenas uma
pnpm dev:aluno
pnpm dev:professor
```

### Parar

```bash
# Windows
Parar-Relia.bat

# Linux/macOS
./Parar-Relia.sh

# Ou
docker compose down
```

---

## 🌐 Endereços de Acesso

| Serviço | URL |
|---------|-----|
| App Aluno | http://localhost:3000 |
| App Professor | http://localhost:3001 |
| FastAPI Docs | http://localhost:8000/docs |
| MCP Server | http://localhost:8001 |

---

## 📂 Estrutura do Monorepo

```
relia-platform/
├── apps/
│   ├── aluno/              # Next.js — App do Aluno/Leitor
│   └── professor/          # Next.js — App do Professor (Relia Skills)
├── packages/
│   ├── domain/             # Lógica pura de negócio
│   ├── db/                 # Drizzle ORM + Turso
│   ├── ui/                 # Componentes partilhados
│   ├── validation/         # Esquemas Zod
│   └── config/             # Env + constantes
├── services/
│   ├── fastapi/            # Backend FastAPI + 3 Skills
│   └── mcp/                # Servidor MCP de Corpus
├── docs/
│   ├── migracao-nextjs/    # Dossiê de migração (11 docs + anexos)
│   ├── cientifico/         # Documentação científica do PhD
│   ├── professor/          # Docs do professor
│   └── pontos-de-reflexao/ # Pontos de Reflexão
├── data/                   # Dados locais (dev)
├── scripts/                # Scripts auxiliares
├── docker-compose.yml      # Orquestra tudo
├── Iniciar-Relia.bat       # Arranque Windows
├── Parar-Relia.bat         # Paragem Windows
├── turbo.json              # Turborepo
└── .agents/                # Customizações Antigravity
```

---

## 🧪 Testes

```bash
pnpm test           # Vitest (todos os pacotes)
pnpm lint            # ESLint
pnpm typecheck       # TypeScript
pnpm e2e             # Playwright (apps)
```

---

## 📚 Documentação

- [Dossiê de migração](docs/migracao-nextjs/README.md) — Especificação completa da conversão Streamlit → Next.js
- [Documentação científica](docs/cientifico/README.md) — Protocolo experimental, hipóteses, métricas
- [Modelo do professor](docs/professor/modelo.md) — Turmas, fichas, privacidade
- [Pontos de Reflexão](docs/pontos-de-reflexao/proposta.md) — Estratégias e formatos

---

## 📄 Licença

Projeto académico — CEHUM / Universidade do Minho.
