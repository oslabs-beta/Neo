import puppeteer, { Browser, Page } from 'puppeteer';
import { algoMetrics } from '../fileUpload/algoMetrics';


let algoMetricsResult: any;

export const puppeteerAnalyzer = async (endpoint: string, port: number): Promise<void> => {

  try {

    console.log('entered puppeteer');
    const browser: Browser = await puppeteer.launch({ headless: 'new' });
    const page: Page = await browser.newPage();

    console.log(port);

    let bool = true;
    while (bool) {
      try {
            await Promise.all([
              page.goto(`http://localhost:${port}${endpoint}`),
              page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            ]);
        bool = false;
      } catch (error) {
        if (error) await page.reload();
      }
    }

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
    const filteredEntries = parseEntries.filter((e: any) => {
      return e.entryType === 'navigation' || e.entryType === 'paint' || e.entryType === 'measure'
    });

    let resStartTime: number = 0;
    let FCP: number = 0;
    let reqTotal: number = 0;
    let hydrationTotal: number = 0
    let domCompleteTime: number = 0

    for (let i = 0; i < filteredEntries.length; i++) {
      if (filteredEntries[i].entryType === 'navigation') {
        resStartTime = filteredEntries[i].responseStart;
        reqTotal = filteredEntries[i].responseEnd - filteredEntries[i].requestStart;
        domCompleteTime = filteredEntries[i].domComplete - filteredEntries[i].requestStart
      }
      if (filteredEntries[i].name === 'first-contentful-paint') {
        FCP = filteredEntries[i].startTime - resStartTime;
      }
      if (filteredEntries[i].name === 'Next.js-hydration') {
        hydrationTotal = filteredEntries[i].duration
      }
    }
    
    algoMetricsResult = await algoMetrics({
      // startTime: parseEntries[8].startTime, 
      // responseStart: parseEntries[0].responseStart, 
      // FCP: parseEntries[8].startTime - parseEntries[0].responseStart 
      FCP: FCP,
      RequestTime: reqTotal,
      HydrationTime: hydrationTotal,
      DOMCompletion: domCompleteTime
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
