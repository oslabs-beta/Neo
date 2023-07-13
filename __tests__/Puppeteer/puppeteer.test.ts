import puppeteer from "puppeteer";
import * as fsX from 'fs-extra';

const APP = `http://localhost:3000`;

describe('Client side features', () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new'});
    page = await browser.newPage();
    fsX.emptyDirSync('./upload/zip');
    fsX.emptyDirSync('./upload/unzip');
  });

  afterAll(() => {
    browser.close();
    fsX.emptyDirSync('./upload/zip');
    fsX.emptyDirSync('./upload/unzip');
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

  describe('File structure should display in sidebar after upload', () => {
    it('is empty until input is selected', async () => {
      await page.goto(APP + '/neo');
      await page.waitForSelector('#pageHeaderNeo');
      const sidebarChildren: HTMLElement = await page.$('#fileStructure');
      expect(sidebarChildren).toBe(null);
    })

    it('generates file list after input is clicked', async () =>{
      await page.goto(APP + '/neo');
      await page.waitForSelector('#pageHeaderNeo');
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('#fileInput'),
      ]);
      await fileChooser.accept(['./__tests__/Puppeteer/test']);
      const tableEl = await page.waitForSelector('#fileStructure');
      expect(tableEl);
      //wait for server response and delete files
      await page.waitForResponse(async (response: any) => {
        return (await response);
      })
    })
  })
})