/* Styling of display cards for /contact page */

import Link from 'next/link';
import Image from 'next/image';

type cardProps = {
  name: string;
  key: number;
  pfp: string;
  linkedin: string;
  github: string;
};

export default function Card({ name, key, pfp, linkedin, github }: cardProps) {
  return (
    <div
      id="card"
      key={`${key}`}
      className="grid min-w-fit w-3/12 h-max justify-center bg-slate-300 m-5 rounded-lg p-7 transition-all ease-in-out hover:border-zinc-50 hover:border-2"
    >
      <Link href={linkedin}>
        <Image
          className="rounded-full"
          src={pfp}
          width={200}
          height={200}
          alt="Image of someone"
        />
      </Link>
      <p className="text-lg text-center mt-5 text-black">{name}</p>
      <p className="text-sm text-center mt-1 mb-3 text-black">
        Software Engineer
      </p>
      <div className="flex justify-center">
        <Link className="m-1 mx-2" href={github}>
          <Image
            src="/github-logo-black.png"
            width={30}
            height={30}
            alt="GitHub Logo with a link"
            id="social-icons"
          />
        </Link>
        <Link className="m-1 mx-2" href={linkedin}>
          <Image
            src="/linkedin-logo.png"
            width={30}
            height={30}
            alt="LinkedIn Logo with a link"
            id="social-icons"
          />
        </Link>
      </div>
    </div>
  );
}
