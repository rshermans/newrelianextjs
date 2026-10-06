'use server';

import { signIn } from '@/lib/auth';
import { entrarSchema, type EntrarInput } from '@relia/validation';
import { AuthError } from 'next-auth';

export type ActionResult<T = unknown> =
  | { ok: true; dados?: T }
  | { ok: false; erro: string; campos?: Record<string, string[]> };

export async function loginAction(formData: EntrarInput): Promise<ActionResult> {
  const parsed = entrarSchema.safeParse(formData);

  if (!parsed.success) {
    const formatado = parsed.error.format();
    const campos: Record<string, string[]> = {};
    if (formatado.email?._errors) campos.email = formatado.email._errors;
    if (formatado.senha?._errors) campos.senha = formatado.senha._errors;
    return {
      ok: false,
      erro: 'Dados de formulário inválidos',
      campos,
    };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      senha: parsed.data.senha,
      redirect: false,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { ok: false, erro: 'Email ou senha incorretos' };
        default:
          return { ok: false, erro: 'Erro durante o início de sessão' };
      }
    }
    // Re-lança outros erros para permitir redirecionamento do Next
    throw error;
  }
}
