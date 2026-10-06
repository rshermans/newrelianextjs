import React from 'react';

export default function AlunoHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-black">
      <div className="text-center space-y-6 max-w-2xl px-6 py-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-2xl backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span>PhD CEHUM / UMinho</span>
          <span>•</span>
          <span>Investigação & Leitura</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          📚 RELIA
        </h1>
        <p className="text-xl text-neutral-300 font-light leading-relaxed">
          Roteiro Empático de Leitura com Inteligência Artificial
        </p>
        <p className="text-sm text-neutral-400">
          Ambiente do Estudante e Leitor — Porta 3000
        </p>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-400">
          <div className="p-3 rounded-lg bg-neutral-800/40 border border-neutral-800">
            📖 Roteiros e Catálogo
          </div>
          <div className="p-3 rounded-lg bg-neutral-800/40 border border-neutral-800">
            💡 Pontos de Reflexão
          </div>
          <div className="p-3 rounded-lg bg-neutral-800/40 border border-neutral-800">
            🤖 Diálogo Socrático
          </div>
        </div>
      </div>
    </main>
  );
}
