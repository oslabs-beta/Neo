import Link from "next/link";
export default function Home () {
  return <>
    <header className="flex justify-between items-center mb-4">
      <h1 className="text-3xl">NavBar</h1>
      <Link className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none" href="/new">New</Link>
    </header>
    <ul></ul>
  </>
}