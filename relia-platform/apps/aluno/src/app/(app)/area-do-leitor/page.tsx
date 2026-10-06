import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@relia/ui';

export default function AreaDoLeitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
          Área do Leitor
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Acompanha o teu histórico de leituras, conquistas e reflexões acumuladas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-400">
              Total de Leituras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">3</div>
            <p className="text-xs text-neutral-400 mt-1">Obras exploradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-400">
              Pontuação Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">81 pts</div>
            <p className="text-xs text-neutral-400 mt-1">Acumulados em reflexões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-400">
              Nível Pedagógico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">Nível 2</div>
            <p className="text-xs text-neutral-400 mt-1">Compreensão & Análise</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
          <CardDescription>
            Registos recentes de interação com o mediador e checkpoints respondidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <p className="font-medium text-white">Os Lusíadas · Canto I</p>
                <p className="text-xs text-neutral-400">Ponto de Reflexão validado com nota máxima</p>
              </div>
              <span className="text-xs text-amber-500 font-mono">+15 pts</span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <p className="font-medium text-white">Mensagem · Mar Português</p>
                <p className="text-xs text-neutral-400">Sessão socrática concluída</p>
              </div>
              <span className="text-xs text-amber-500 font-mono">+10 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Amor de Perdição</p>
                <p className="text-xs text-neutral-400">Roteiro iniciado</p>
              </div>
              <span className="text-xs text-neutral-400 font-mono">Em curso</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
