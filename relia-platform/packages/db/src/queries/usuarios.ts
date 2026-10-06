import { eq } from 'drizzle-orm';
import { db } from '../client';
import { usuarios, type Usuario, type NovoUsuario } from '../schema';

export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | undefined> {
  const [user] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email.trim().toLowerCase()))
    .limit(1);
  return user;
}

export async function buscarUsuarioPorId(id: number): Promise<Usuario | undefined> {
  const [user] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);
  return user;
}

export async function criarUsuario(dados: NovoUsuario): Promise<Usuario> {
  const [user] = await db
    .insert(usuarios)
    .values({
      ...dados,
      email: dados.email.trim().toLowerCase(),
    })
    .returning();
  if (!user) {
    throw new Error('Falha ao registar utilizador');
  }
  return user;
}
