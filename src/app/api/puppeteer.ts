import puppeteer, { Browser, Page } from 'puppeteer';

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
    const parseEntries: { [key: string]: unknown } = JSON.parse(getEntries);
    console.log('Performance Metrics on User App at ' + endpoint, parseEntries);

    await browser.close();

  } catch (error) {

    console.error('error in puppeteer middleware handler');
    console.error(error);
    throw error;

  }
};
