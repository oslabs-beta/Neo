import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
const path = require('Path');
import { createEdgeRouter } from "next-connect";
import fs from 'fs';
import decompress from 'decompress';
import * as fsX from 'fs-extra';

//SETUP FOR NEXT-CONNECT ROUTER
interface RequestContext {
  params: {
    id: string;
  };
}

//NEXT-CONNECT ROUTER
const router = createEdgeRouter<NextRequest, RequestContext>();

router
  //FILE CLEANUP
  .post(async(req, event, next) => {
      fsX.emptyDirSync('./upload/zip');
      fsX.emptyDirSync('./upload/unzip');
    return next()
  })

  //CREATE ZIP
  .post(async(req, event, next) => {
    const blobZip = await req.blob()
    const fileBuffer: any = await blobZip.arrayBuffer()
    const data = new DataView(fileBuffer);
    fs.writeFileSync('upload/zip/files.zip', data);
    return next()
  })

  /* UNPACK ZIP FILE */
  .post(async(req, event, next) => {
    await decompress('upload/zip/files.zip', 'upload/unzip');
    fsX.emptyDirSync('./upload/zip');
    return NextResponse.json('Files successfully loaded');
  }) 

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}