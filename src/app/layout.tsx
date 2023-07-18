import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from './NavBar'
import Footer from './Footer'
import Provider from './providers/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Neo App',
  description: 'Technical Search Engine Optimization (SEO) Analyzer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <NavBar />
          <main className='grow'>{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}
