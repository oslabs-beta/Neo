/* 
Puppeteer API Route:
  - Obtains data from Front End to gain metrics from Puppeteer Analyzer Function
*/

import { NextRequest, NextResponse } from 'next/server'
import { puppeteerAnalyzer } from './puppeteer';

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const { endpoint, port, host, protocol }: { endpoint: string, port: number, host: string, protocol: string } = body;

    // CREATE METRICS OBJECT & INVOKE PUPPETEER HEADLESS BROWSER FOR METRICS GATHERING
    const metrics = await puppeteerAnalyzer(endpoint, port, host, protocol);

    return NextResponse.json({ message: 'Puppeteer Analyzer Complete!', metrics });

  } catch (error) {
    throw new Error('Error in Puppeteer Handler');
  }

}