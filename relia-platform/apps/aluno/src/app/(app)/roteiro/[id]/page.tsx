import React from 'react';
import { buscarObraPorId, buscarFichaObra } from '@relia/db';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@relia/ui';
import Link from 'next/link';

interface RoteiroPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoteiroLeituraPage({ params }: RoteiroPageProps) {
  const { id } = await params;
  const obraId = Number(id);

  if (isNaN(obraId)) notFound();

  const [obra, ficha] = await Promise.all([
    buscarObraPorId(obraId),
    buscarFichaObra(obraId),
  ]);

  if (!obra) notFound();

  let dadosFicha: { resumo?: string } | null = null;
  if (ficha?.dados) {
    try {
      dadosFicha = JSON.parse(ficha.dados) as { resumo?: string };
    } catch {
      dadosFicha = null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-500 mb-1">
            <span>Roteiro de Leitura</span>
            <span>·</span>
            <span>{obra.genero || 'Literatura Clássica'}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {obra.titulo}
          </h1>
          <p className="text-sm text-neutral-400">
            {obra.autor} {obra.anoPublicacao ? `(${obra.anoPublicacao})` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/ponto-reflexao/${obra.id}`}>
            <Button variant="outline" size="sm">
              🎯 Pontos de Reflexão
            </Button>
          </Link>
          <Link href="/explorar">
            <Button variant="ghost" size="sm">
              ← Catálogo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Janela de Interação do Chat / Mediador */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-[520px] flex flex-col justify-between">
            <CardHeader className="border-b border-neutral-800 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <CardTitle className="text-sm">Mediador Socrático</CardTitle>
                    <p className="text-[11px] text-neutral-400">Pronto para dialogar sobre a obra</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">
                  Online
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-sm">
                  📖
                </div>
                <div className="rounded-2xl rounded-tl-none bg-neutral-800/80 p-3 text-sm text-neutral-200 max-w-[85%] border border-neutral-700/50">
                  <p>
                    Bem-vindo à exploração de <strong>{obra.titulo}</strong>!
                  </p>
                  <p className="mt-2 text-xs text-neutral-300">
                    Ao longo desta leitura, vou orientar as tuas reflexões sobre a estrutura, contexto histórico e temas centrais da narrativa. Como pretendes começar?
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="p-3 border-t border-neutral-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Escreve uma reflexão ou pergunta sobre a obra..."
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
              <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
                Enviar
              </Button>
            </div>
          </Card>
        </div>

        {/* Informações da Ficha e Metadados */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ficha da Obra</CardTitle>
              <CardDescription>Dados essenciais catalogados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400">Autor:</span>
                <p className="font-medium text-white">{obra.autor}</p>
              </div>
              <div>
                <span className="text-neutral-400">Domínio Público:</span>
                <p className="font-medium text-white">
                  {ficha?.dominioPublico === 1 ? 'Sim (Verificado)' : 'Consultar estatuto'}
                </p>
              </div>
              {dadosFicha?.resumo && (
                <div>
                  <span className="text-neutral-400">Enquadramento:</span>
                  <p className="mt-1 text-neutral-300 leading-relaxed">
                    {dadosFicha.resumo}
                  </p>
                </div>
              )}
              {ficha?.linkTexto && (
                <div className="pt-2">
                  <a
                    href={ficha.linkTexto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline block truncate"
                  >
                    🔗 Ler texto integral original
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
