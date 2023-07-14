import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { createEdgeRouter } from "next-connect";
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
  .get(async(req, event, next) => {
    console.log('in router')
    fsX.emptyDirSync('./upload/zip');
    fsX.emptyDirSync('./upload/unzip');
    return NextResponse.json('File upload deleted')
  })

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}