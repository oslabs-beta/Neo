import Image from 'next/image';
import Link from 'next/link';

export const config = {
  unstable_runtimeJS: false
};

export default function Home() {
  return (
    <div className="flex justify-around items-center text-white" id="content">
      <header id="pageHeaderHome" hidden>Home</header>
      <div>
        <p className="text-3xl">Next</p>
        <p className="text-3xl">Engine</p>
        <p className="text-3xl">Optimization</p>
        <Link href="/neo">
          <button className="bg-gray-300 text-black w-30 flex flex-row gap-1 justify-between items-center mt-5 py-2 px-3 rounded-full">
            <Image
              className="mr-1"
              src="/play-button.png"
              width={20}
              height={20}
              alt="Play button Icon for App button"
            />
            Application
          </button>
        </Link>
      </div>
      <div>
        <Image
          src="/App-Preview.png"
          width={600}
          height={600}
          priority={true}
          alt="Preview of NEO Dashboard"
        />
      </div>
    </div>
  );
}
