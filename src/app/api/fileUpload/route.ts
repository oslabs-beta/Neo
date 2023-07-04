import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import multer from 'multer';

//Multer setup
const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, '/upload');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({
  storage: storage
}).any();


//POST request: Write a file that was sent in the request
export async function POST( req: NextRequest | any, res: NextResponse | any) {
  console.log('in post request')
  upload(req, res, err => {
    console.log('headers: ', req.body)
    if(err instanceof multer.MulterError) {
      console.error('an error occurred with Multer: ', err)
    } else if (err) {
      console.error('an error occurred during file upload: ', err)
    }
    console.log('exiting multer function');
  })
  return NextResponse.json("Return from post request");
}