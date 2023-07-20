/* Contents of footer displayed at all routes */

import Link from "next/link";
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Image src="/Neo-White.png" width={169} height={169} alt="Neo Logo" />
      </div>
      <div className="font-thin">
        © 2023 NEO, All rights reserved.
      </div>
      <div className="flex justify-center items-center flex-col font-thin">
        <p>NEO is an open-source project.</p>
        <p>Help us Improve!</p>
        <Link href="https://github.com/oslabs-beta/Neo">
          <Image src="/github-logo.png" width={30} height={30} alt="GitHub Logo with a link" />
        </Link>
      </div>
    </footer>
  )
}