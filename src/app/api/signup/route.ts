import bcrypt from 'bcrypt';
import { NextResponse, NextRequest } from 'next/server';
import NextFunction from 'next';

export async function POST(request: NextResponse) {

  const body = await request.json();
  const { name, email, password }: { name: string, email: string, password: string } = body;

  if (!name || !email || !password) {
    return new NextResponse('Missing Fields', { status: 400 });
  }

  // check if in database
  let exists;
  if (exists) {
    return new NextResponse('Account already exists', { status: 401 });
  }

  // hash the password for security
  const hashPass = await bcrypt.hash(password, 10);

  // create user in database with hashed password
  const addUser = `

  `

  const user = {}; // after


  return NextResponse.json(user);

}

