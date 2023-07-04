// import { useEffect } from 'react';
// import puppeteer from 'puppeteer';

// export default function Puppeteer() {
//   useEffect(() => {
//     (async () => {
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       await page.goto('https://www.freecodecamp.org/');

//       await browser.close();
//     })();
//   }, []); // Empty dependency array to run only once

//   return null;
// }