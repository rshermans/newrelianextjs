'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@relia/ui';

interface SidebarProps {
  usuario?: {
    nome: string;
    email: string;
    isAdmin?: boolean;
    nivelBloom?: string;
    pontos?: number;
    leiturasAtivas?: number;
  };
  obraAtual?: {
    id: number;
    titulo: string;
    autor: string;
    nivel: string;
    pontos: number;
    progressoPercentual: number;
  } | null;
}

export function Sidebar({ usuario, obraAtual }: SidebarProps) {
  const pathname = usePathname();

  const linksPrincipais = [
    { href: '/painel', label: 'Início', icon: '🏠' },
    { href: '/explorar', label: 'Explorar Obras', icon: '🔎' },
    { href: '/area-do-leitor', label: 'Área do Leitor', icon: '📚' },
  ];

  function isActive(href: string) {
    if (href === '/painel') return pathname === '/painel' || pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950/90 flex flex-col h-screen sticky top-0 text-neutral-200 select-none backdrop-blur-md">
      {/* 1. Header do RELIA */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <Link href="/painel" className="flex items-center space-x-2.5">
          <span className="text-2xl">📖</span>
          <span className="font-bold text-lg tracking-wider text-white">RELIA</span>
        </Link>
        <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
          v2.0
        </Badge>
      </div>

      {/* 2. Cartão do Usuário */}
      {usuario && (
        <div className="p-4 mx-3 my-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white truncate max-w-[130px]">
              {usuario.nome}
            </span>
            {usuario.isAdmin && (
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800/50 px-1.5 py-0.5 rounded font-mono">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            {usuario.leiturasAtivas ?? 1} leituras · {usuario.pontos ?? 0} pts
          </p>
        </div>
      )}

      {/* 3. Navegação Principal */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Navegação
          </p>
          <nav className="space-y-1">
            {linksPrincipais.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 4. A Ler Agora (se houver obra aberta) */}
        {obraAtual && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                A Ler Agora
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {obraAtual.progressoPercentual}%
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-white truncate" title={obraAtual.titulo}>
                {obraAtual.titulo}
              </p>
              <p className="text-xs text-neutral-400 truncate">{obraAtual.autor}</p>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${obraAtual.progressoPercentual}%` }}
              />
            </div>

            <div className="pt-1 space-y-1 text-xs">
              <Link
                href={`/roteiro/${obraAtual.id}`}
                className="flex items-center space-x-2 p-1.5 rounded hover:bg-neutral-800/80 text-neutral-300 hover:text-white"
              >
                <span>💬</span>
                <span>Roteiro de Leitura</span>
              </Link>
              <Link
                href={`/ponto-reflexao/${obraAtual.id}`}
                className="flex items-center space-x-2 p-1.5 rounded hover:bg-neutral-800/80 text-neutral-300 hover:text-white"
              >
                <span>🎯</span>
                <span>Ponto de Reflexão</span>
              </Link>
            </div>
          </div>
        )}

        {/* 5. Gestão (Se Admin) */}
        {usuario?.isAdmin && (
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Gestão
            </p>
            <Link
              href="/admin"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              <div className="flex items-center space-x-3">
                <span>⚙️</span>
                <span>Administração</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Novo
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* 6. Conta & Rodapé */}
      <div className="p-3 border-t border-neutral-800/80 space-y-1">
        <Link
          href="/perfil"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-900"
        >
          <span>👤</span>
          <span>O meu perfil</span>
        </Link>
        <Link
          href="/api/auth/signout"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/30"
        >
          <span>🚪</span>
          <span>Terminar sessão</span>
        </Link>

        <div className="pt-3 px-3 flex items-center justify-between text-[11px] text-neutral-400">
          <Link href="/ajuda" className="hover:text-neutral-400">
            ❓ Ajuda
          </Link>
          <Link href="/inquerito" className="hover:text-neutral-400">
            ⭐ Inquérito
          </Link>
        </div>
      </div>
    </aside>
  );
}
