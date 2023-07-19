'use client'

import Link from "next/link"
import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {

  const [info, setInfo] = useState({
    email: '',
    password: ''
  });

  const logIn = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      signIn('credentials', { ...info, redirect: true, callbackUrl: '/neo' });

    } catch (error) {
      alert(error)
      console.error('Error in Sign In: ', error)
    }

  }

  return (
    <>
      <header id="pageHeaderSignIn" hidden>Sign-In</header>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign In
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={logIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={info.email}
                  onChange={e => setInfo({ ...info, email: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 bg-gray-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={info.password}
                  onChange={e => setInfo({ ...info, password: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 bg-gray-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
          </form>

          <h1 className="text-center my-8 text-white" >Or continue with</h1>

          <div className="flex items-center justify-between gap-4 my-8">
            <button
              onClick={() => signIn('github')}
              className="flex w-full justify-center items-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
            >
              <Image className='mx-2' src={'/github-logo.png'} height={15} width={15} alt='Github Logo'>
              </Image> Sign in with Github
            </button>
            <button
              onClick={() => signIn('google')}
              className="flex w-full justify-center items-center rounded-md bg-white px-3 py-1.5 text-sm leading-6 text-gray-500 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              <Image className='mx-2' src={'/google-icon.png'} height={15} width={15} alt='Google Logo'>
              </Image> Sign in with Google
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href={'/signup'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}