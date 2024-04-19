import NextAuth, { type NextAuthConfig } from "next-auth"
import Cognito from "next-auth/providers/cognito";
import { env } from "@/env";


const authOptions: NextAuthConfig = {
  debug: true,
  providers: [
    Cognito({
      clientId: env.AUTH_COGNITO_ID,
      clientSecret: env.AUTH_COGNITO_SECRET,
      issuer: env.AUTH_COGNITO_ISSUER,
      authorization: {
        params: {
          scope: "openid email phone",
        }
      }
    }),
  ],
}

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)
