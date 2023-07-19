import { NextRequest, NextResponse } from 'next/server'
import { puppeteerAnalyzer } from './puppeteer';

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();
    console.log('request body', body);

    const { endpoint, port }: { endpoint: string, port: number } = body;

    setTimeout(async () => {
      await puppeteerAnalyzer(endpoint, port);
    }, 1000);

    const metrics = await puppeteerAnalyzer('/', port as number);

    return NextResponse.json({ message: 'Puppeteer Analyzer Complete!', metrics });

  } catch (error) {
    throw new Error('Error in Puppeteer Handler');
  }

}