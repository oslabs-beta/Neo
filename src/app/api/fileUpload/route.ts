import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import multer from 'multer';
import formidable from 'formidable';

//Setup Multer storage location
const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, './');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

//define Multer upload function
const upload = multer({
  storage: storage
}).any();

//disable nextjs bodyparser
export const config = {
  api: {
    bodyParser: false,
  }
}


//POST request: Write a file that was sent in the request
export async function POST( req: NextRequest | any, res: NextResponse | any) {
  console.log('In post request', req.body);
const data = await new Promise((resolve, reject) => {
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if (err) reject({ err })
    resolve({ err, fields, files })
  })
})
console.log('end of parse: ', data)

  // upload(req, res, err => {
  //   console.log('the res', req.file)
  //   if(err instanceof multer.MulterError) {
  //     console.error('an error occurred with Multer: ', err)
  //   } else if (err) {
  //     console.error('an error occurred during file upload: ', err)
  //   }
  //   console.log('exiting multer function');
  // })
  return NextResponse.json("Return from post request");
}