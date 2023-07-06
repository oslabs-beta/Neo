import { NextRequest, NextResponse } from 'next/server';

const puppeteer = require('puppeteer');
// import puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

export async function GET(request: NextRequest) {

  console.log('entered screenshot')
  console.log('req', request.nextUrl);

  const { searchParams } = request.nextUrl;
  const url: string | null = searchParams.get('url');

  console.log('url: ', url);

  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url as string);
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

  return new Response(screenshot);
} 
