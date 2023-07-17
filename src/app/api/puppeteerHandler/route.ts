import { NextRequest, NextResponse } from 'next/server'
import { puppeteerAnalyzer } from '../puppeteer';

export async function POST(request: NextRequest) {

  try {

    const { endpoint, port } = request.body;




  } catch (error) {
    throw new Error('Error in Puppeteer Handler');
  }



}