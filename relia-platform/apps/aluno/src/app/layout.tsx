import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RELIA — Roteiro Empático de Leitura com Inteligência Artificial',
  description:
    'Plataforma de apoio à leitura de obras literárias para estudantes. Combine roteiros de leitura, Pontos de Reflexão e conversas com IA para uma experiência de leitura enriquecida.',
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
