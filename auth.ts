import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db/index"
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt", 
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if(!credentials.email || !credentials.password) {
          throw new CustomError("Invalid Credentials Account");
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1)

        if(user.length === 0) {
          throw new CustomError("Invalid Email Account")
        }

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password ?? ''
        )

        if(!isPasswordValid) {
          throw new CustomError("Invalid Password Account")
        }

        return user[0]
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  }
})