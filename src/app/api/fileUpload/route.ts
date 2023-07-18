import { NextResponse, NextRequest } from 'next/server'
import { createEdgeRouter } from "next-connect";
import decompress from 'decompress';
import fs from 'fs';
import * as fsX from 'fs-extra';
import { puppeteerAnalyzer } from './puppeteer';
import { dockerFuncs } from './dockerController';
const { AddFiles, BuildAndRun } = dockerFuncs;

//SETUP FOR NEXT-CONNECT ROUTER
interface RequestContext {
  params: {
    id: string;
  };
}

// EXTEND NEXT-REQUEST TO TAKE A LOCALS OBJECT FOR DATA PASSING
interface ExtraNextReq extends NextRequest {
  locals: {
    [key: string]: unknown; // use like res.locals, now req.locals
  }
}

const ports: number[] = [9090, 16686, 14268, 14250, 9411, 1888, 8888, 8889, 13133, 4317, 4318, 55679];
const portsCopy: number[] = [...ports]; // save original copy for reset

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
    const blobZip = await req.blob()
    const fileBuffer: any = await blobZip.arrayBuffer()
    const data = new DataView(fileBuffer);
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
    req.locals.appname = fs.readdirSync('upload/unzip')[0];

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
    console.log('ports array: ', ports);
    console.log('new port: ', port);

    await BuildAndRun(req.locals);

    return next()
  })

  // Puppeteer Call
  .post(async (req, event, next) => {

    const { port } = req.locals;
    let metrics = 'test string';

  //   try {
  //     await new Promise( wait => setTimeout(wait, 1000));

  //     // call puppeteerAnalyzer and await results
  //     metrics = await puppeteerAnalyzer(port as number);
  //     console.log('from route 111 ' + metrics);

  //     return NextResponse.json({message:'Files successfully loaded', test1: 'test', test2: 'test2', metrics: metrics});
  //   } catch (error) {
  //     console.log('Error fetching metrics ' + error)
  //     return NextResponse.json({ message: 'Error fetching metrics' + error })
  //   }
  // })

    await new Promise( wait => setTimeout(wait, 3000));
    // add 1 second delay in case container isn't fully spun up
    // await setTimeout(async () => {
    //   // metrics = await puppeteerAnalyzer(port as number);
      
    //   // return NextResponse.json({message:'Files successfully loaded', test1: 'test', test2: 'test2', metrics});

    // }, 1000);
    metrics = await puppeteerAnalyzer(port as number);
    console.log("line 131 " + metrics)
    return NextResponse.json({message:'Files successfully loaded', test1: 'test', test2: 'test2', metrics: metrics});
    // await puppeteerAnalyzer(port as number);
  });

export async function POST(request: ExtraNextReq, ctx: RequestContext) {
  return router.run(request, ctx);
}