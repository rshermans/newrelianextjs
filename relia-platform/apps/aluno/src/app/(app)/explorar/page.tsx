import React from 'react';
import { listarObrasDisponiveis } from '@relia/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@relia/ui';
import Link from 'next/link';

export default async function ExplorarObrasPage() {
  const obras = await listarObrasDisponiveis();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
          Catálogo de Obras
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Descobre textos literários completos e roteiros pedagógicos orientados.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {obras.map((obra) => (
          <Card
            key={obra.id}
            className="flex flex-col justify-between hover:border-neutral-700 transition-all bg-neutral-900/60"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-[10px] text-neutral-300">
                  {obra.genero || 'Literatura'}
                </Badge>
                {obra.noCatalogo === 1 && (
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Oficial
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{obra.titulo}</CardTitle>
              <CardDescription>
                {obra.autor} {obra.anoPublicacao ? `· ${obra.anoPublicacao}` : ''}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <p className="text-xs text-neutral-400">
                Disponível para leitura assistida com mediador socrático, mapa conceitual e pontos de reflexão.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Link href={`/roteiro/${obra.id}`} className="flex-1">
                  <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs py-2">
                    💬 Abrir Roteiro
                  </Button>
                </Link>
                <Link href={`/ponto-reflexao/${obra.id}`}>
                  <Button variant="outline" className="text-xs py-2">
                    🎯 Questões
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {obras.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500 text-sm">
            Nenhuma obra disponível no catálogo de momento.
          </div>
        )}
      </div>
    </div>
  );
}
