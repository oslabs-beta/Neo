// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   return NextResponse.json({message: 'Testing from Puppeteer'});
// }

// import puppeteer from 'puppeteer-core';


// console.log('entered puppeteer file');

// const handler = async (req: Request, res: Response) => {
//   console.log('entered puppeteer file');
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.freecodecamp.org/');
//   // Perform other actions

//   await browser.close();
//   res.status(200).end();
// };

// export default (req: Request, res: Response) => {
//   console.log('entered puppeteer file');
//   // Wrap the handler in an Express server
//   const app = express();
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//   app.all('*', handler);
//   app(req, res);
// };
// import express, {Request, Response} from 'express';
// import { NextApiRequest, NextApiResponse } from 'next';
// import puppeteer from 'puppeteer';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.google.com');
//     await browser.close();

//     res.status(200).json({ message: 'Website loaded successfully' });
//   } catch (error) {
//     console.log('Error executing Puppeteer:', error);
//     res.status(500).json({ error: 'Failed to load website' });
//   }
// }

import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.example.com');
    
    // Perform other Puppeteer actions as needed
    
    await browser.close();
    
    res.status(200).json({ message: 'Puppeteer operation completed successfully' });
  } catch (error) {
    console.log('Error executing Puppeteer:', error);
    res.status(500).json({ error: 'Failed to execute Puppeteer operation' });
  }
}