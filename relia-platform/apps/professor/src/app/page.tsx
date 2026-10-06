import React from 'react';

export default function ProfessorHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-neutral-900 text-neutral-100">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          🎓 RELIA Skills
        </h1>
        <p className="text-xl text-neutral-300">
          Painel do Professor & Protocolo Científico de Investigação
        </p>
        <p className="text-sm text-neutral-400">
          App do Professor — Porta 3001
        </p>
        <div className="p-4 rounded-lg bg-neutral-800 border border-neutral-700 text-left text-xs text-neutral-300 space-y-1">
          <p><strong>Módulos Disponíveis:</strong></p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Gestão de Turmas e Obras</li>
            <li>Banco de Perguntas & Matriz de Bloom</li>
            <li>Extrator Discursivo (Skill Agêntica)</li>
            <li>Formulador Socrático (Skill Agêntica)</li>
            <li>Avaliador Metacognitivo (Skill Agêntica)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
