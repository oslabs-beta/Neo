import puppeteer, { Browser, Page } from 'puppeteer';

export const puppeteerAnalyzer = async (port: number): Promise<void> => {

  try {

    console.log('entered puppeteer');
    const browser: Browser = await puppeteer.launch({ headless: 'new' });
    const page: Page = await browser.newPage();

    console.log(port);
    // wait until parameter waits for page to load
    

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
    console.log('navigated to port')


    // Perform Metrics Here
    //get entries returns an array of all performance API metrics    
    const getEntries = await page.evaluate(function (): string {
      return JSON.stringify(window.performance.getEntries());
    })
    //parsing the object provides the array
    const parseEntries: { [key: string]: unknown } = JSON.parse(getEntries);
    console.log('performance metrics on user app:', parseEntries);

    await browser.close();

  } catch (error) {

    console.error('error in puppeteer middleware handler');
    console.error(error);
    throw error;

  }
};
