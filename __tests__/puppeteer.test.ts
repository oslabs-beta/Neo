/* Testing Suite built around puppeteer */
/* Uses a test application built in NextJS named 'bboy-blog' constructed by Tom Nguyen @ https://github.com/nguyentomt */

import puppeteer from "puppeteer";
import * as fsX from 'fs-extra';
import globalSetup from './dev-server-setup-modules/global-setup';
import globalTeardown from './dev-server-setup-modules/global-teardown';

//variables for test paths
const APP = `http://localhost:3000`;
const zipStorage = './upload/zip';
const unzipStorage = './upload/unzip';
const testFolder = './__tests__/test-app';

describe('Client side features', () => {
  let browser: any;
  let page: any;

  //start server and prepare a puppeteer page for navigation
  beforeAll(async () => {
    await globalSetup();
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
    //ensure storage files on server are empty
    fsX.emptyDirSync(zipStorage);
    fsX.emptyDirSync(unzipStorage);
  });


  describe('Initial load', () => {
    it('loads successfully, testing for hidden header', async () => {
      await page.goto(APP),
      await page.waitForSelector('#pageHeaderHome');
      const label: string = await page.$eval('#pageHeaderHome', (el: any) => el.innerText);
      expect(label).toBe('Home');
    }, 10000);
  });

  describe('Nav bar should navigate to correct pages', () => {
    it('navbar "App" button navigates to /signin page if authentication hasn\'t been provided, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#navApp');
      await page.click('#navApp');
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      const url: string = await page.url();
      expect(url.includes('signin'));
    });

    it('navbar "Contact" button navigates to /contact page, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#navContact');
      await page.click('#navContact');
      await page.waitForSelector('#pageHeaderContact');
      const label: string = await page.$eval('#pageHeaderContact', (el: HTMLElement) => el.innerText)
      expect(label).toBe('Contact');
    });

    it('navbar "Sign In" button navigates to /signin page, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#signIn');
      await page.click('#signIn');
      await page.waitForSelector('#pageHeaderSignIn');
      const label: string = await page.$eval('#pageHeaderSignIn', (el: HTMLElement) => el.innerText)
      expect(label).toBe('Sign-In');
    })

    it('navbar "Home" button navigates to / page, testing for hidden header', async () => {
      await page.goto(APP);
      await page.waitForSelector('#navHome');
      await page.click('#navHome');
      await page.waitForSelector('#pageHeaderHome');
      const label: string = await page.$eval('#pageHeaderHome', (el: HTMLElement) => el.innerText)
      expect(label).toBe('Home');
    });
  });

  //Following tests skipped until dummy login test is implemented

  xdescribe('File structure should display in sidebar after upload', () => {
    it('is empty until input is selected', async () => {
      await page.goto(APP + '/neo');
      await page.waitForSelector('#pageHeaderNeo');
      const sidebarChildren: HTMLElement = await page.$('#fileStructure');
      expect(sidebarChildren).toBe(null);
    })

    it('generates file list after input is clicked', async () => {
      await page.goto(APP + '/neo');
      await page.waitForSelector('#pageHeaderNeo');
      //invoke input and select test folder
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('#fileInput'),
      ]);
      await fileChooser.accept([testFolder]);
      //clean up upload files
      await page.waitForResponse(async (response: any) => {
        return (await response);
      });
      fsX.emptyDirSync(zipStorage);
      fsX.emptyDirSync(unzipStorage);
      //test that elements mounted in sidebar have content
      await page.waitForSelector('#fileStructure');
      const label: string = await page.$eval('#fileStructure', (el: HTMLElement) => el.innerText)
      expect(label.length).toBeGreaterThan(0);
    })
  })

  xdescribe('Generate and Reset buttons should add and remove graphs', () => {
    it('pressing Generate should create content', async () => {
      await page.goto(APP + '/neo');
      await page.waitForSelector('#handleGen');
      //function for current status of hidden
      async function hiddenStatus() {
        const hidden = await page.$eval('#all-charts', (el: HTMLElement) => {
          return el.getAttribute('hidden');
        })
        return hidden
      }
      expect(await hiddenStatus()).toBeTruthy();
      await page.click('#handleGen');
      expect(await hiddenStatus()).toBeNull();
      await page.click('#reset');
      expect(await hiddenStatus()).toBeTruthy;
    })
  })
  
  //close puppeteer browser and shut down server if loaded
  afterAll(async () => {
    await browser.close();
    await globalTeardown();
  });
})

/*
Future testing suites:
- Create a dummy login to simulate authentication
- Check server pathways
- Check Generate and Reset button functionality
- Check chart functionality
- Test contact links
*/