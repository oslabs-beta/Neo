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
    '/tom-pfp.jpeg',
    '/justin-pfp.jpeg',
    '/nitesh-pfp.jpeg',
    '/donald-pfp.jpeg',
    '/benson-pfp.jpeg',
  ];

  const linkedinUrls: string[] = [
    'https://www.linkedin.com/in/tomteaches/',
    'https://www.linkedin.com/in/justinshim/',
    'https://www.linkedin.com/in/niteshsunku/',
    'https://www.linkedin.com/in/donald-twiford-13731a118/',
    'https://www.linkedin.com/in/bensonzhen/',
  ];

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
