import Image from 'next/image'
import Link from 'next/link';


export default function Home() {
  return (
    <div className='flex justify-around items-center' id="content">
      <div>
        <p className='text-3xl'>Next</p>
        <p className='text-3xl'>Engine</p>
        <p className='text-3xl'>Optimization</p>
        <button className='bg-slate-400 text-black w-30 flex flex-row gap-1 justify-between items-center py-2 px-3 rounded-full'>
          <Image className='mr-1' src="/play-button.png" width={20} height={20} alt="Play button Icon for App button" />
          Application
        </button>
      </div>
      <div>
        <Image src="/App-Preview.png" width={500} height={500} alt="Preview of NEO Dashboard" />
      </div>
    </div>
  )
}
