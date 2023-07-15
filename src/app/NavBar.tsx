import Link from "next/link";
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav>
      <div className="mx-auto w-[69%]">
        <div className="flex justify-between mx-5">
          <Image className='my-5' src="/Neo-White.png" width={220} height={220} priority={true} alt="Neo Logo" />
          <div className="flex justify-between w-[30%] my-auto text-2xl font-light text-white">
            <Link id="navHome" href="/">Home</Link>
            <Link id="navApp" href="/neo">App</Link>
            <Link id="navContact" href="/contact">Contact</Link>
          </div>
        </div>
        <div className="navline"></div>
      </div>
    </nav>
  )
}