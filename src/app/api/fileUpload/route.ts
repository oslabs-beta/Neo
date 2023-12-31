/* 
File Upload API Connection:
  - Clears Upload Directory and Uploads New File as a Zip
  - Creates Docker Image and Runs Docker Container
  - Assigns Docker Container Port to User based on Credentials 
*/

import { NextResponse, NextRequest } from 'next/server'
import { createEdgeRouter } from "next-connect";
import decompress from 'decompress';
import fs from 'fs';
import * as fsX from 'fs-extra';
import { dockerFuncs } from './dockerController';
import connectToDatabase from '../sqlController/sql';
const { AddFiles, BuildAndRun } = dockerFuncs;

//SETUP FOR NEXT-CONNECT ROUTER
interface RequestContext {
  params: {
    id: string;
  };
};

// EXTEND NEXT-REQUEST TO TAKE A LOCALS OBJECT FOR DATA PASSING
interface ExtraNextReq extends NextRequest {
  locals: {
    [key: string]: unknown; // use like res.locals, now req.locals
  }
};

const ports: number[] = [9090, 16686, 14268, 14250, 9411, 1888, 8888, 8889, 13133, 4317, 4318, 55679];

//NEXT-CONNECT ROUTER
const router = createEdgeRouter<ExtraNextReq, RequestContext>();

router
  //FILE CLEANUP
  .post(async (req, event, next) => {
    fsX.emptyDirSync('./upload/zip');
    fsX.emptyDirSync('./upload/unzip');
    return next();
  })

  //CREATE ZIP
  .post(async (req, event, next) => {
    const blobZip: Blob = await req.blob();
    const fileBuffer: ArrayBuffer = await blobZip.arrayBuffer();
    const data: DataView = new DataView(fileBuffer);
    fs.writeFileSync('upload/zip/files.zip', data);
    return next();
  })

  /* UNPACK ZIP FILE */
  .post(async (req, res, next) => {
    await decompress('upload/zip/files.zip', 'upload/unzip');
    fsX.emptyDirSync('upload/zip');
    fs.rmdirSync('upload/zip');

    // intitialize req.locals
    req.locals = {};

    // save name of App
    req.locals.appname = fs.readdirSync('upload/unzip')[0].toLowerCase();

    // save users name
    const searchParams: URLSearchParams = new URL(req.url).searchParams;
    const email: string | null = new URLSearchParams(searchParams).get('email');
    req.locals.email = email;

    return next();
  })

  // DOCKER PROCESS

  // ADD DOCKERFILE, .DOCKERIGNORE, AND INSTRUMENTATION FILE
  .post(async (req, event, next) => {

    const { appname } = req.locals;
    req.locals.newAppPath = `upload/unzip/${appname}`;
    req.locals.dockerFilePath = `upload/unzip/${appname}/Dockerfile.user`;

    AddFiles(req.locals);

    return next();
  })

  // BUILD AND DEPLOY DOCKER CONTAINER AT RANDOMIZED PORT
  .post(async (req, event, next) => {

    const generatePort = (): number => Math.round(Math.random() * 10000 + 1000);

    let bool: boolean = true;
    while (bool) {
      const port: number = generatePort();
      if (ports.includes(port)) continue;
      else {
        ports.push(port)
        bool = false;
      };
    }

    // assign port name and save to memory
    const port: number = ports[ports.length - 1];
    req.locals.port = port;

    await BuildAndRun(req.locals);

    return next()
  })

  // UPDATE DATABASE WITH USER'S PORT
  .post(async (req, event, next) => {

    const { email, port } = req.locals;

    const { dbClient, dbRelease } = await connectToDatabase();

    try {

      const updatePort = `
      UPDATE users
      SET port = $1
      WHERE users.email = $2
      RETURNING *
      `;

      await dbClient?.query(updatePort, [port, email]);

    } catch (error) {
      throw new Error('Error Updating database with User and Port')
    } finally {
      if (dbClient && dbRelease) dbRelease();
    }

    await new Promise(wait => setTimeout(wait, 3000));

    return NextResponse.json({ message: 'Files successfully loaded', port });

  })

export async function POST(request: ExtraNextReq, ctx: RequestContext) {
  return router.run(request, ctx);
}