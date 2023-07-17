import Link from "next/link";
import Image from 'next/image';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

export default async function NavBar() {

  const session = await getServerSession(authOptions);

  return (
    <nav>
      <div className="mx-auto w-[65%]">
        <div className="flex flex-wrap items-center justify-between gap-x-10">
          <Image className='my-5' src="/Neo-White.png" width={220} height={220} priority={true} alt="Neo Logo" />
          <div className="flex items-center justify-between gap-x-8 my-auto text-2xl font-light text-white">
            <Link id="navHome" href="/">Home</Link>
            <Link id="navApp" href="/neo">App</Link>
            <Link id="navContact" href="/contact">Contact</Link>
            <Link className="border-2 border-solid border-white rounded-3xl py-2 px-3 hover:no-underline" id='signIn' href='/signin'>
              {session ? session.user?.name : 'Sign In'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}