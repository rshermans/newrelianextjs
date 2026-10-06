'use client';

import React, { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginProfessorAction } from './actions';
import { Button } from '@relia/ui';

function EntrarProfessorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const erroParam = searchParams.get('erro');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(
    erroParam === 'nao_autorizado'
      ? 'A sua conta não tem privilégios de docente ou administrador.'
      : null
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    startTransition(async () => {
      const res = await loginProfessorAction({ email, senha });
      if (!res.ok) {
        setErro(res.erro);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-8 text-center space-y-2">
        <span className="text-3xl">🎓</span>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Painel Docente & Investigação
        </h1>
        <p className="text-sm text-neutral-400">
          Acesso reservado a professores e investigadores
        </p>
      </div>

      {erro && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-neutral-300 mb-1"
          >
            Email Institucional
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="docente@escola.pt"
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label
            htmlFor="senha"
            className="block text-xs font-medium text-neutral-300 mb-1"
          >
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 mt-2"
        >
          {isPending ? 'A autenticar...' : 'Entrar no Painel'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-neutral-500">
        <p>
          Necessário perfil com <code className="text-neutral-400">is_professor = 1</code> ou <code className="text-neutral-400">is_admin = 1</code>.
        </p>
      </div>
    </div>
  );
}

export default function EntrarProfessorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-neutral-100">
      <Suspense fallback={<div className="text-sm text-neutral-400">A carregar formulário...</div>}>
        <EntrarProfessorForm />
      </Suspense>
    </main>
  );
}

