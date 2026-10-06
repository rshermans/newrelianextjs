import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { buscarUltimoRoteiroAtivo } from '@relia/db';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/entrar');
  }

  // Buscar última leitura ativa
  const userId = Number(session.user.id);
  const ultimoRoteiro = !isNaN(userId) ? await buscarUltimoRoteiroAtivo(userId) : null;

  const obraAtual = ultimoRoteiro
    ? {
        id: ultimoRoteiro.obraId,
        titulo: ultimoRoteiro.titulo,
        autor: ultimoRoteiro.autor,
        nivel: 'Nível 1 · Recordar',
        pontos: 45,
        progressoPercentual: 60,
      }
    : null;

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <Sidebar
        usuario={{
          nome: session.user.name || 'Leitor',
          email: session.user.email || '',
          isAdmin: Boolean('isAdmin' in session.user && session.user.isAdmin),
          pontos: 80,
          leiturasAtivas: ultimoRoteiro ? 1 : 0,
        }}
        obraAtual={obraAtual}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
