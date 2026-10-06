import { db } from '../client';
import { obras, roteiros, checkpoints, fichasObra } from '../schema';
import { eq, desc } from 'drizzle-orm';

export async function listarObrasDisponiveis() {
  return db
    .select()
    .from(obras)
    .orderBy(obras.titulo);
}

export async function buscarObraPorId(id: number) {
  const res = await db
    .select()
    .from(obras)
    .where(eq(obras.id, id))
    .limit(1);
  return res[0] ?? null;
}

export async function buscarUltimoRoteiroAtivo(usuarioId: number) {
  const res = await db
    .select({
      roteiroId: roteiros.id,
      obraId: roteiros.obraId,
      status: roteiros.status,
      dataCriacao: roteiros.dataCriacao,
      resumo: roteiros.resumo,
      titulo: obras.titulo,
      autor: obras.autor,
      capa: obras.capa,
    })
    .from(roteiros)
    .innerJoin(obras, eq(roteiros.obraId, obras.id))
    .where(eq(roteiros.usuarioId, usuarioId))
    .orderBy(desc(roteiros.id))
    .limit(1);

  return res[0] ?? null;
}

export async function listarCheckpointsPorRoteiro(roteiroId: number) {
  return db
    .select()
    .from(checkpoints)
    .where(eq(checkpoints.roteiroId, roteiroId))
    .orderBy(checkpoints.id);
}

export async function buscarFichaObra(obraId: number) {
  const res = await db
    .select()
    .from(fichasObra)
    .where(eq(fichasObra.obraId, obraId))
    .limit(1);
  return res[0] ?? null;
}
