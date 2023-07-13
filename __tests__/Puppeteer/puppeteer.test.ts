import puppeteer from "puppeteer";

const APP = `http://localhost:3000`;

describe('Client side features', () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new'});
    page = await browser.newPage();
  });

  afterAll(() => {
    browser.close();
  });

  describe('Initial load', () => {
    it('loads successfully, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#pageHeaderHome');
      const label: string = await page.$eval('#pageHeaderHome', (el: any) => el.innerText);
      expect(label).toBe('Home');
    });
  });

  describe('Nav bar should navigate to and load correct pages', () => {
    it('navbar "App" button navigates to /neo page, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#navApp');
      await page.click('#navApp');
      await page.waitForSelector('#pageHeaderNeo');
      const label: string = await page.$eval('#pageHeaderNeo', (el: HTMLElement) => el.innerText)
      expect(label).toBe('Neo');
    });

    it('navbar "Contact" button navigates to /contact page, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#navContact');
      await page.click('#navContact');
      await page.waitForSelector('#pageHeaderContact');
      const label: string = await page.$eval('#pageHeaderContact', (el: HTMLElement) => el.innerText)
      expect(label).toBe('Contact');
    });

    it('navbar "Home" button navigates to / page, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#navHome');
      await page.click('#navHome');
      await page.waitForSelector('#pageHeaderHome');
      const label: string = await page.$eval('#pageHeaderHome', (el: HTMLElement) => el.innerText)
      expect(label).toBe('Home');
    });
  });
})