import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { Pool } from "pg";
import PostgresAdapter from "../../sqlController/PostgresAdapter";

const pg_URI = 'postgres://gymssbhl:nN2Eg1LZKQ-liUJdig1ZIgVNQTJ_5kvc@mahmud.db.elephantsql.com/gymssbhl';

const pool = new Pool({
  connectionString: pg_URI
})

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        name: { label: "Name", type: "name" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        // query database in actual implementation

        // temporary
        if (credentials?.email === "admin@example.com" && credentials.password === "admin") {
          return {
            id: "1",
            email: "admin@example.com"
          };
        }

        return null;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PostgresAdapter(pool),
  pages: {
    signIn: '/signin',
    newUser: '/signup'
  }
}