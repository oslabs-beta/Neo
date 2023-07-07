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
  //FILE CLEANUP on post
  .use(async(req, event, next) => {
    return next()
  })

  /* POST for Zip Files */
  .post(async(req, event, next) => {
    return NextResponse.json('Process complete');
  }) 

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}