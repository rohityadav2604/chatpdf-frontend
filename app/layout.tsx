import './globals.css'
import { Inter } from 'next/font/google'
import { PDFProvider } from './context/PDFContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ChatWithPDF - Premium PDF Chat Experience',
  description: 'Chat with your PDFs using advanced AI technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
        <PDFProvider>{children}</PDFProvider>
      </body>
    </html>
  )
}

