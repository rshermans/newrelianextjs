import React from 'react';
import { auth } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@relia/ui';
import { buscarUltimoRoteiroAtivo, listarObrasDisponiveis } from '@relia/db';
import Link from 'next/link';
import { nivelEProgresso } from '@relia/domain';

export default async function PainelAlunoPage() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  const [ultimoRoteiro, todasObras] = await Promise.all([
    !isNaN(userId) ? buscarUltimoRoteiroAtivo(userId) : null,
    listarObrasDisponiveis(),
  ]);

  const progresso = nivelEProgresso(80);


  return (
    <div className="space-y-8">
      {/* 1. Header de Boas-Vindas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Olá, {session?.user?.name || 'Leitor'} 👋
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Continua a tua jornada literária e explora novas reflexões críticas.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-amber-400 border-amber-500/30 px-3 py-1">
            🏆 {progresso.nivel}
          </Badge>
          <Link href="/explorar">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
              Explorar Obras
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Cartões de Resumo e Estado da Leitura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-amber-500/20 bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Leitura em Curso
              </span>
              {ultimoRoteiro && (
                <span className="text-xs text-neutral-400">Ativo</span>
              )}
            </div>
            <CardTitle className="text-xl mt-1">
              {ultimoRoteiro ? ultimoRoteiro.titulo : 'Nenhuma obra em leitura ativa'}
            </CardTitle>
            <CardDescription>
              {ultimoRoteiro
                ? `Por ${ultimoRoteiro.autor}`
                : 'Escolhe um clássico literário no catálogo para iniciar o teu roteiro.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ultimoRoteiro ? (
              <>
                <p className="text-sm text-neutral-300 line-clamp-2">
                  {ultimoRoteiro.resumo ||
                    'Interage com o mediador socrático para aprofundar os teus conhecimentos e desbloquear novas reflexões.'}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Link href={`/roteiro/${ultimoRoteiro.obraId}`}>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
                      💬 Continuar Chat
                    </Button>
                  </Link>
                  <Link href={`/ponto-reflexao/${ultimoRoteiro.obraId}`}>
                    <Button size="sm" variant="outline">
                      🎯 Ponto de Reflexão
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/explorar">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
                  Explorar Catálogo
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Nível Bloom / Progresso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-neutral-200">
              Progresso Bloom
            </CardTitle>
            <CardDescription>Evolução pedagógica no RELIA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">80 pts</span>
              <span className="text-xs text-neutral-400">Próximo: 100 pts</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: '80%' }}
              />
            </div>
            <p className="text-xs text-neutral-400">
              Completa mais 1 Ponto de Reflexão para avançar para o próximo patamar!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Obras Recomendadas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Obras em Destaque
          </h2>
          <Link href="/explorar" className="text-xs text-amber-500 hover:underline">
            Ver todas ({todasObras.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {todasObras.slice(0, 4).map((obra) => (
            <Card
              key={obra.id}
              className="group hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <CardHeader className="space-y-1">
                <span className="text-[11px] font-medium text-amber-500">
                  {obra.genero || 'Literatura Clássica'}
                </span>
                <CardTitle className="text-base group-hover:text-amber-400 transition-colors">
                  {obra.titulo}
                </CardTitle>
                <CardDescription className="text-xs">
                  {obra.autor} {obra.anoPublicacao ? `(${obra.anoPublicacao})` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Link href={`/roteiro/${obra.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Iniciar Leitura
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
