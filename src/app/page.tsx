/* Layout for /home path */

import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {

  return (
    <div className="flex justify-around items-center text-white" id="content">
      <header id="pageHeaderHome" hidden>Home</header>
      <div>
        <p className='text-3xl'>Next</p>
        <p className='text-3xl'>Engine</p>
        <p className='text-3xl'>Optimization</p>
        <Link href={'/neo'} className='bg-slate-400 text-xl text-black w-30 flex flex-row gap-1 justify-around items-center py-2 px-3 rounded-full mt-5'>
          <Image className='mr-1' src="/play-button.png" width={30} height={30} alt="Play button Icon for App button" />
          Application
        </Link>
      </div>
      <div >
        <Image
          className='rounded-3xl'
          src="/NeoDemo2FastGif.gif"
          priority={true}
          height={600}
          width={600}
          alt="Preview of NEO Dashboard"
        />
      </div>
    </div>
  );
}