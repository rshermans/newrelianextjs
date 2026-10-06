import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RELIA Skills — Painel do Professor & Investigação',
  description:
    'Painel de gestão pedagógica, análise de leitura e orquestração de agentes de IA para professores e investigadores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
