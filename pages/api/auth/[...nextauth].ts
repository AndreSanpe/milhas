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
        email: {},
        password: {}
      },
      authorize: async (credentials, req) => {
        if(credentials?.email && credentials.password) {
          const user = await api.getAuthUser(credentials.email, credentials.password);

          if(!user) {
            return null as any;    
          } 
          if(user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email
            }
          };
        }
      }
  })
  ],
  callbacks: {
    signIn: async({user}) => {
      if(user) return true;

      return false;
    },
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
    },
  },
  session: {
    maxAge: 60 * 60 * 1,
  },
  jwt: {
    maxAge: 60 * 60 * 1,
  },
  pages: {
    signIn: '/login'
  }
}

export default NextAuth(authOptions);

