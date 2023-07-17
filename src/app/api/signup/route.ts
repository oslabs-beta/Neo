import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import connectToDatabase from '../sqlController/sql';

export async function POST(request: NextResponse) {

  const { dbClient, dbRelease } = await connectToDatabase();

  try {

    const body = await request.json();
    const { name, email, password }: { name: string, email: string, password: string } = body;

    if (!name || !email || !password) {
      return new NextResponse('Missing Fields', { status: 400 });
    }

    // check if in database
    const checkUser = `
    SELECT * FROM users
    WHERE users.email = $1
    `;

    const response = await dbClient?.query(checkUser, [email]);

    if (response && response.rows.length > 0) {
      return new NextResponse('Account already exists', { status: 401 });
    }

    // hash the password for security
    const hashPass = await bcrypt.hash(password, 10);

    // create user in database with hashed password
    const addUser = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

    const addResponse = await dbClient?.query(addUser, [name, email, hashPass]);

    if (addResponse) {

      console.log('addresponse: ', addResponse)
      return NextResponse.json(addResponse.rows[0], { status: 200 });
    }

    return new NextResponse('Failed to create account', { status: 500 });

  } catch (error) {

    console.error('Error in sign up')
    console.error(error);

    return NextResponse.json({ Error: error }, { status: 500 })

  } finally {
    if (dbClient && dbRelease) dbRelease();
  }

}

