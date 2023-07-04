'use client'

import { NextResponse } from 'next/server';

// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer';

export async function GET(request: Request) {

  console.log('entered screenshot')
  console.log('req', request);

  const { url } = request;

  console.log('url: ', url);

  if (!url) {
    return NextResponse.json(
      { error: "URL Parameter Required" },
      {
        status: 400,
      }
    );
  }

  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ type: 'png' });

    return NextResponse.json(screenshot, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {error: error.message},
      {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};