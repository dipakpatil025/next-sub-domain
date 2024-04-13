import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { env } from "@/env";
import { db } from "@/server/db";
import Cognito from "next-auth/providers/cognito";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
            id: string;
            // ...other properties
            // role: UserRole;
          } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions = ({ iceoCode }: { iceoCode: string }): NextAuthOptions =>
  ({
    debug: true,
    callbacks: {
      session: ({ session, user }) => ({
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }),
    },
    adapter: PrismaAdapter(db) as Adapter,
    // secret: env.NEXTAUTH_SECRET,
    providers: [
      /**
       * The Discord provider is the simplest to set up. You only need the client ID and secret.
       *
       * @see https://next-auth.js.org/providers/cognito
       */
      Cognito({
        clientId: env.AUTH_COGNITO_ID,
        clientSecret: env.AUTH_COGNITO_SECRET,
        issuer: env.AUTH_COGNITO_ISSUER,
        authorization: {
          params: {
            redirect_uri: `https://${iceoCode}.localhost:3000/api/auth/callback/cognito`
          }
        }
      }),
      /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */
    ],

    // session: {
    //   maxAge: 30 * 24 * 60 * 60, // 30 days
    //   updateAge: 24 * 60 * 60, // 24 hours
    // },
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: false,
          sameSite: 'lax',
          path: '/',
          domain: `${iceoCode}.localhost`, // replace with your domain, without subdomains
          secure: process.env.NODE_ENV === 'production', // set to true in production
        },
      },
    },
  })
;

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions({ iceoCode: 'test2' }));
