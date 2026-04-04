import NextAuth, { AuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        const lowerEmail = credentials.email.toLowerCase();

        // 1. Fetch user via HTTPS (Guaranteed connection)
        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', lowerEmail)
          .single();

        // 2. Handle demo bypass
        if (credentials.password === 'password123') {
           if (user) {
             return { id: user.id, name: user.name, email: user.email, role: user.role };
           }
           // Fallback for extreme cases
           if (lowerEmail === 'admin@rkgit.edu.in') return { id: 'demo-admin-id', role: 'admin' };
           return { id: 'demo-student-id', role: 'student' };
        }

        // 3. Standard Login
        if (!user || !user.password) {
          throw new Error('No account found with this email address.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Incorrect password.');

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as NextAuthUser & { role: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as NextAuthUser & { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
