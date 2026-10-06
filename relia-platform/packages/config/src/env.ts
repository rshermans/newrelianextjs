import { z } from 'zod';

/**
 * Esquema de validação das variáveis de ambiente.
 * Falhar cedo com mensagem clara se faltar uma variável obrigatória.
 *
 * Baseado em anexos/configuracoes.md do dossiê de migração.
 */
const envSchema = z.object({
  // --- Base de Dados (Turso/libSQL) ---
  TURSO_DATABASE_URL: z.string().url('TURSO_DATABASE_URL deve ser um URL válido'),
  TURSO_AUTH_TOKEN: z.string().min(1, 'TURSO_AUTH_TOKEN é obrigatório'),

  // --- OpenAI ---
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY é obrigatório'),
  OPENAI_MODEL: z.string().default('gpt-6-luna'),
  OPENAI_REASONING_EFFORT: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),

  // --- Preços IA (estimativa, opcional) ---
  PRICE_IN_PER_M: z.coerce.number().optional(),
  PRICE_OUT_PER_M: z.coerce.number().optional(),

  // --- Autenticação (Auth.js) ---
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET é obrigatório'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),

  // --- Email (SMTP) ---
  EMAIL_HOST: z.string().min(1, 'EMAIL_HOST é obrigatório'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().min(1, 'EMAIL_USER é obrigatório'),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD é obrigatório'),
  EMAIL_USE_TLS: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),

  // --- Administração ---
  ADMIN_EMAILS: z.string().min(1, 'ADMIN_EMAILS é obrigatório'),

  // --- APIs externas (para testes) ---
  COMMONS_API_URL: z.string().url().optional(),
  OPENLIBRARY_URL: z.string().url().optional(),

  // --- Serviços internos ---
  FASTAPI_URL: z.string().url().default('http://localhost:8000'),
  MCP_URL: z.string().url().default('http://localhost:8001'),

  // --- Node environment ---
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Valida as variáveis de ambiente.
 * Chama no arranque da aplicação; falha com mensagem clara.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    const missing = Object.entries(formatted)
      .filter(([key]) => key !== '_errors')
      .map(([key, value]) => {
        const errors = (value as { _errors?: string[] })?._errors ?? [];
        return `  ${key}: ${errors.join(', ')}`;
      })
      .join('\n');

    throw new Error(
      `❌ Variáveis de ambiente inválidas:\n${missing}\n\nCopie .env.example para .env e preencha os valores.`
    );
  }

  return result.data;
}
