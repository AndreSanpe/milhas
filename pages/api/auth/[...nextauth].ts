import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import api from "../../../libs/api";
import { AuthUser } from "../../../types/AuthUser";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text' },
        password: { label: 'senha', type: 'password' }
      },
      authorize: async (credentials, req) => {
        if(credentials && credentials.email && credentials.password){
          const user = await api.getAuthUser(credentials.email, credentials.password);
          if(user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email      
            } as any
          }
          }
          return null;
        } 
    })
  ],
  session: {
    maxAge: 60 * 60 * 1,
  },
  jwt: {
    maxAge: 60 * 60 * 1,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
   session: async ({ session, token }) => {
    if(token) {
      session.user = token.user as AuthUser;
      return session as any;
    }
  }
  },
  pages: {
    signIn: '/login'
  }
}

export default NextAuth(authOptions);

