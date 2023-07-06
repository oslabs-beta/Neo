import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import multer from 'multer';
const path = require('Path');
import { createEdgeRouter } from "next-connect";

//DEFINE MULTER STORAGE
// const upload = multer({ dest: './uploads' });

// disable nextjs bodyparser
  // Used to allow form parsing from apps like formidable
  //possibly depracted with discovery of req.formData() function
export const config = {
  api: {
    bodyParser: false,
  }
};

//SETUP FOR NEXT-CONNECT ROUTER
// interface RequestContext {
//   params: {
//     id: string;
//   };
// }

//NEXT-CONNECT ROUTER
// const router = createEdgeRouter<NextRequest, RequestContext>();

// router
//   .use() 

// export async function POST(request: NextRequest, ctx: RequestContext) {
//   return router.run(request, ctx);
// }

//BASE NEXTJS13 ROUTER
//POST request: Write a file that was sent in the request
export async function POST( req: NextRequest | any, res: NextResponse | any) {
  //TESTING MULTER FUNCTIONALITY
  // upload(req, res, err => {
  //   if(err instanceof multer.MulterError) {
  //     console.error('an error occurred with Multer: ', err)
  //   } else if (err) {
  //     console.error('an error occurred during file upload: ', err)
  //   }
  //   console.log('exiting multer function');
  // })
  return NextResponse.json("Return from post request");
}

//NOTES
/*
New modules on this page
1. Multer - for writing directories to application
2. Next-connect - for creating a more expresslike server
3. Path - for merging pathing
*/