import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { Pool } from "pg";
import PostgresAdapter from "../../sqlController/PostgresAdapter";
import connectToDatabase from "../../sqlController/sql";
import bcrypt from 'bcrypt';

const pg_URI = process.env.DATABASE_URL;

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

        const { dbClient, dbRelease } = await connectToDatabase();

        try {

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing Fields');
          }

          console.log(credentials.email, credentials.password);

          // check if in database
          const user = `
          SELECT * FROM users
          WHERE users.email = $1
          `;

          const response = await dbClient?.query(user, [credentials.email]);
          console.log('users password', response?.rows[0].password)
          console.log('response', response?.rows);

          if (response && response.rows.length > 0) {
            const passMatch = await bcrypt.compare(credentials.password, response.rows[0].password);
            console.log(passMatch);
            console.log(typeof credentials.password);

            if (!passMatch) throw new Error('Incorrect Password');
            else return response.rows[0];

          } else {
            throw new Error('User does not exist');
          }

        } catch (error) {
          throw error;
        } finally {
          if (dbClient && dbRelease) dbRelease();
        }

      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PostgresAdapter(pool),
  pages: {
    signIn: '/signin',
    newUser: '/signup'
  }
}