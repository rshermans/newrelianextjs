import { describe, it, expect } from 'vitest';
import * as schema from '../src/schema';

describe('@relia/db schema', () => {
  it('should export all 36 tables', () => {
    const tableKeys = [
      'acoes',
      'auditoria',
      'usuarios',
      'obras',
      'roteiros',
      'chatMessages',
      'checkpoints',
      'clubeMembros',
      'configuracoes',
      'consentimentos',
      'contactos',
      'desafiosAceites',
      'errosApp',
      'estrategias',
      'feedbackAutomatizado',
      'fichasObra',
      'fichasProfessor',
      'forumTopicos',
      'forumRespostas',
      'imagensObra',
      'infograficos',
      'inqueritoParticipacoes',
      'inqueritoRespostas',
      'logsUso',
      'pedidosObra',
      'pedidosProfessor',
      'perguntasProfessor',
      'reescritas',
      'relatoriosIa',
      'reportesPergunta',
      'resumosSemanais',
      'roteiroMapa',
      'turmas',
      'turmaMembros',
      'turmaObras',
      'usoLlm',
    ];

    for (const key of tableKeys) {
      expect((schema as Record<string, unknown>)[key]).toBeDefined();
    }
  });

  it('should properly configure key table columns', () => {
    expect(schema.usuarios.nome).toBeDefined();
    expect(schema.usuarios.email).toBeDefined();
    expect(schema.obras.titulo).toBeDefined();
    expect(schema.estrategias.nivelBloom).toBeDefined();
    expect(schema.checkpoints.pergunta).toBeDefined();
  });
});
