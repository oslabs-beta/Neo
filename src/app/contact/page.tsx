import Link from 'next/link';
import Card from './card';

export default function Contact() {
  const people: string[] = [
    'Tom Nguyen',
    'Justin Shim',
    'Nitesh Sunku',
    'Donald Twiford',
    'Benson Zhen',
  ];

  const pfps: string[] = [
    'https://media.licdn.com/dms/image/C5603AQEzwiruaKNpXg/profile-displayphoto-shrink_400_400/0/1556665090299?e=1694044800&v=beta&t=RFpME37vVXJoUvrX4Y5rr_l8Nv92KRn9fzGolGphW5I',
    'https://media.licdn.com/dms/image/D5603AQEpzbsGcibFlQ/profile-displayphoto-shrink_400_400/0/1685062093155?e=1694044800&v=beta&t=gcv99cCJBJR0KIFmNOB-U-W-01gnNwRvqm1s-xYjCLs',
    'https://media.licdn.com/dms/image/C5603AQF5aVV5RPoSow/profile-displayphoto-shrink_800_800/0/1654820828871?e=1694044800&v=beta&t=poAJy-brOT9GucqFCPC8SpBXjaJFGx-tAs78DUAe2ZQ',
    'https://media.licdn.com/dms/image/D5603AQHLbRShNvTnjQ/profile-displayphoto-shrink_400_400/0/1672523207183?e=1694044800&v=beta&t=e5RVgR1L1B_cMucacwBsQLbcLCX-P02_RqpWAB003MY',
    'https://media.licdn.com/dms/image/C5603AQG6ZdZTqYG0kw/profile-displayphoto-shrink_400_400/0/1644888978375?e=1694044800&v=beta&t=EI1FPyDTxFoYNuQ1guPzQ_AX0Eqnzk8vy5QtqBo80Ds',
  ];

  const linkedinUrls: string[] = [
    'https://www.linkedin.com/in/tomteaches/',
    'https://www.linkedin.com/in/justinshim/',
    'https://www.linkedin.com/in/niteshsunku/',
    'https://www.linkedin.com/in/donald-twiford-13731a118/',
    'https://www.linkedin.com/in/bensonzhen/',
  ];

  // access api once the branches are merged and the folder exists
  async function getPFPs(person: string, url: string): Promise<string> {
    const response = await fetch(`/api/getPFP?person=${person}?url=${url}`);
    const data = await response.json();
    return data;
  }

  // const pfps: Promise<string>[] = people.map((person, idx) =>
  //   getPFPs(person, linkedinUrls[idx])
  // );

  /* 

  in a route handler called getPFP
  
  export async function GET(request: NextRequest) => {
  
    console.log('request')

    const { searchParams } = request.nextUrl;
    const url: string | null = searchParams.get('url');
    const person: string | null = searchParams.get('person');

    const browser: Browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url as string);

    const image = await page.waitForSelector(`[title = '${person}']`)
    const imageURL = image.src;

    await image.dispose();
    await browser.close();

    return imageURL;
  }

  */

  const githubUrls: string[] = [
    'https://github.com/tomtnguyen88',
    'https://github.com/slip4k',
    'https://github.com/nsunku99',
    'https://github.com/KrankyKnight',
    'https://github.com/bensonzhen',
  ];

  const cards: JSX.Element[] = people.map((person, idx) =>
    Card({
      name: person,
      key: idx,
      pfp: pfps[idx],
      linkedin: linkedinUrls[idx],
      github: githubUrls[idx],
    })
  );

  return (
    <div id="content">
      <div className="flex flex-wrap justify-center py-5">{cards}</div>
    </div>
  );
}
