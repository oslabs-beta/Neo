/* Server route for emptying uploaded file storage folders */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { createEdgeRouter } from "next-connect";
import * as fsX from 'fs-extra';

//setup for router
interface RequestContext {
  params: {
    id: string;
  };
}

//create router
const router = createEdgeRouter<NextRequest, RequestContext>();

router
  //target and delete uploaded files in containing folders
  .get(async(req, event, next) => {
    console.log('in router')
    fsX.emptyDirSync('./upload/zip');
    fsX.emptyDirSync('./upload/unzip');
    return NextResponse.json('File upload deleted')
  })

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}