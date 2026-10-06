/**
 * @relia/db — Camada de acesso à base de dados
 *
 * Usa Drizzle ORM com @libsql/client (Turso / SQLite).
 * O esquema mapeia as 36 tabelas existentes do RELIA.
 */

export * from './schema';
export * from './client';
export * from './queries/usuarios';
