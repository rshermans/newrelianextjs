import { describe, it, expect } from 'vitest';
import { entrarSchema, registarSchema } from '../src/auth';

describe('@relia/validation auth', () => {
  it('validates correct login input', () => {
    const valid = entrarSchema.safeParse({
      email: 'teste@exemplo.com',
      senha: 'password123',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid email or short password', () => {
    const invalidEmail = entrarSchema.safeParse({
      email: 'not-an-email',
      senha: 'password123',
    });
    expect(invalidEmail.success).toBe(false);

    const shortPass = entrarSchema.safeParse({
      email: 'teste@exemplo.com',
      senha: '123',
    });
    expect(shortPass.success).toBe(false);
  });

  it('enforces minimum age in registration', () => {
    const tooYoung = registarSchema.safeParse({
      nome: 'Aluno Novo',
      email: 'aluno@escola.pt',
      senha: 'secretpassword',
      idade: 12,
    });
    expect(tooYoung.success).toBe(false);
  });
});
