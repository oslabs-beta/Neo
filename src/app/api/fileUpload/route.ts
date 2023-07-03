import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as fs from 'fs';

//GET Request with no parameters
export async function GET() {
  console.log('in route');
  fs.writeFile('./src/app/upload/test.txt', 'this is a test', (err) => {
    console.error(err);
  });
  return NextResponse.json("Get request successfuly made");
}