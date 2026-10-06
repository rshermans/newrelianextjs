import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { buscarUsuarioPorEmail } from '@relia/db';
import { entrarSchema } from '@relia/validation';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsed = entrarSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, senha } = parsed.data;
        const usuario = await buscarUsuarioPorEmail(email);
        if (!usuario) return null;

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return null;

        return {
          id: String(usuario.id),
          name: usuario.nome,
          email: usuario.email,
          isAdmin: usuario.isAdmin === 1,
          isProfessor: usuario.isProfessor === 1,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        token.isProfessor = (user as { isProfessor?: boolean }).isProfessor ?? false;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        const u = session.user as typeof session.user & {
          isAdmin?: boolean;
          isProfessor?: boolean;
        };
        u.isAdmin = Boolean(token.isAdmin);
        u.isProfessor = Boolean(token.isProfessor);
      }
      return session;
    },
  },
  pages: {
    signIn: '/entrar',
  },
  secret: process.env.NEXTAUTH_SECRET || 'relia-secret-default-key-development-mode',
});
