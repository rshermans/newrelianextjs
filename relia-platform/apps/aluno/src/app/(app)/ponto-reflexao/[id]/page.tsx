import React from 'react';
import { buscarObraPorId } from '@relia/db';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@relia/ui';
import Link from 'next/link';

interface PontoReflexaoProps {
  params: Promise<{ id: string }>;
}

export default async function PontoReflexaoPage({ params }: PontoReflexaoProps) {
  const { id } = await params;
  const obraId = Number(id);

  if (isNaN(obraId)) notFound();

  const obra = await buscarObraPorId(obraId);
  if (!obra) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-500 mb-1">
            <span>Ponto de Reflexão</span>
            <span>·</span>
            <span>Taxonomia de Bloom</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {obra.titulo}
          </h1>
          <p className="text-sm text-neutral-400">
            Responde criticamente às questões formuladas para validar a tua compreensão.
          </p>
        </div>

        <Link href={`/roteiro/${obra.id}`}>
          <Button variant="outline" size="sm">
            ← Voltar ao Roteiro
          </Button>
        </Link>
      </div>

      <Card className="border-amber-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="default" className="bg-amber-600 text-white">
              Nível 2 · Compreender
            </Badge>
            <span className="text-xs text-amber-400 font-mono">+15 pontos</span>
          </div>
          <CardTitle className="text-lg mt-3">
            Questão 1: Motivações e Dinâmica dos Personagens
          </CardTitle>
          <CardDescription>
            Com base nos capítulos iniciais da narrativa, identifica as principais tensões que impulsionam as decisões dos protagonistas.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <textarea
            rows={5}
            placeholder="Escreve aqui a tua reflexão fundamentada no texto..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-neutral-400">
              A resposta será avaliada pedagogicamente com base nos critérios de Bloom.
            </span>
            <Button className="bg-amber-600 hover:bg-amber-500 text-white text-xs py-2 px-4">
              Submeter Reflexão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
