import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql/web';
import * as schema from './schema';

/**
 * Cria ou obtém o cliente libSQL (Turso via HTTP/Web Client compatível com Next.js)
 */
export function getDbClient() {
  const url = process.env.TURSO_DATABASE_URL || 'http://127.0.0.1:8080';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  const safeUrl = url.startsWith('file:') ? 'http://127.0.0.1:8080' : url;

  const client = createClient({
    url: safeUrl,
    authToken,
  });

  return drizzle(client, { schema });
}

export const db = getDbClient();
export type Database = typeof db;
