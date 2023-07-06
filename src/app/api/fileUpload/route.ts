import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
const path = require('Path');
import { createEdgeRouter } from "next-connect";
import fs from 'fs';

// disable nextjs bodyparser
  // Used to allow form parsing from apps like formidable
  //possibly depracted with discovery of req.formData() function
export const config = {
  api: {
    bodyParser: false,
  }
};

//SETUP FOR NEXT-CONNECT ROUTER
interface RequestContext {
  params: {
    id: string;
  };
}

//NEXT-CONNECT ROUTER
const router = createEdgeRouter<NextRequest, RequestContext>();

router
  /* POST for Form Data */
  // .post(async(req, event, next) => {
  //   const data = await req.formData();
  //   return NextResponse
  // }) 

  /* POST for Zip Files */
  .post(async(req, event, next) => {
    const blobZip = await req.blob()
    const fileBuffer: any = await blobZip.arrayBuffer()
    const data = await new DataView(fileBuffer);
    console.log('test run', data)
    fs.writeFileSync('files.zip', data)

    return NextResponse
  }) 

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

//BASE NEXTJS13 ROUTER
//POST request: Write a file that was sent in the request
// export async function POST( req: NextRequest | any, res: NextResponse | any) {
//   fs.writeFile('src/app/api/fileUpload/upload/text.txt', 'hi', (err) => {
//     console.log('an error occurred', err)
//   })
//   const data = await req.formData();
//   console.log('test', data.keys());
//   return NextResponse.json("Return from post request");
// }

//NOTES
/*
New modules on this page
1. Multer - for writing directories to application
2. Next-connect - for creating a more expresslike server
3. Path - for merging pathing
*/