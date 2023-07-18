import puppeteer, { Browser, Page } from 'puppeteer';
import { algoMetrics } from './algoMetrics';


let algoMetricsResult: any;

export const puppeteerAnalyzer = async (port: number): Promise<any> => {

  try {

    console.log('entered puppeteer');
    const browser: Browser = await puppeteer.launch({ headless: 'new' });
    const page: Page = await browser.newPage();

    console.log(port);

    let bool = true;
    while (bool) {
      try {
        // await page.goto(`http://localhost:${port}`, { waitUntil: 'domcontentloaded' });
            await Promise.all([
              page.goto(`http://localhost:${port}`),
              page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            ]);
        bool = false;
        
      } catch (error) {
        if (error) await page.reload();
      }
    }

    // wait until parameter waits for page to load
    // await page.waitForTimeout(9000); // wait for 2 seconds
    // await page.goto(`http://localhost:${port}`, { waitUntil: 'domcontentloaded' });
    // await Promise.all([
    //   page.goto(`http://localhost:${port}`),
    //   page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    // ]);
    
    console.log('navigated to port')

    // Perform Metrics Here
    //get entries returns an array of all performance API metrics    
    const getEntries = await page.evaluate(function (): string {
      return JSON.stringify(window.performance.getEntries());
    })
    console.log('entries stringified')
    //parsing the object provides the array
    const parseEntries: { [key: string]: any } = JSON.parse(getEntries);
    // console.log('performance metrics on user app:', parseEntries);

    algoMetricsResult = await algoMetrics({
      startTime: parseEntries[8].startTime, 
      responseStart: parseEntries[0].responseStart, 
      FCP: parseEntries[8].startTime - parseEntries[0].responseStart 
    });
    console.log('from puppeteer 53 ' + algoMetricsResult)
    await browser.close();

    return algoMetricsResult;

  } catch (error) {

    console.error('error in puppeteer middleware handler');
    console.error(error);
    throw error;

  }
};




