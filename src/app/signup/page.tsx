'use client'

import axios from "axios";
import Link from "next/link"
import { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react';


export default function Register() {

  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const registerUser = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await axios.post('api/signup', info);
      signIn('credentials', { ...info, redirect: true, callbackUrl: '/neo' });

    } catch (error) {
      alert(error);
      console.error('Error in Axios Post: ', error);
    }

  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={registerUser}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={info.name}
                  onChange={e => setInfo({ ...info, name: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 bg-gray-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

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
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href={'/signin'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div >
    </>
  )
}