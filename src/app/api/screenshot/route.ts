import { NextResponse } from 'next/server';

const puppeteer = require('puppeteer');
// import puppeteer from 'puppeteer';
import { Browser } from 'puppeteer'; 

export async function GET(request: Request) {

  console.log('entered screenshot')
  console.log('req', request.nextUrl);

  const {searchParams} = request.nextUrl;
  const url = searchParams.get('url');

  console.log('url: ', url);

  const browser: Browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url);
  const screenshot = await page.screenshot({ type: 'png' });

  setTimeout(() => browser.close(), 5000);

  // open(url);

  if (!url) {
    return NextResponse.json(
      { error: "URL Parameter Required" },
      {
        status: 400,
      }
    );
  } 

  // Window.open(url);

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(url);

  // return NextResponse.json(screenshot, {
  //   status: 200
  // })
  return new Response(screenshot);
} 
  // let browser: any;

  // try {

  //   browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto(url);

    
  // } catch (error) {
  //   return NextResponse.json({
  //     error
  //   }, {
  //     status: 501
  //   })
  // } finally {
  //   if (browser) setTimeout(() => browser.close(), 5000);
  // }


//   let browser;

//   try {
//     browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);
//     const screenshot = await page.screenshot({ type: 'png' });

//     return NextResponse.json(screenshot, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {error: error.message},
//       {
//       status: 500,
//     });
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };