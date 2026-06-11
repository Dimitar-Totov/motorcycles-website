import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { UserProvider } from '@/context/UserContext'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import BackToTopButton from '@/components/BackToTopButton'

export const metadata: Metadata = {
  title: {
    default: "Dimitar's Motorcycles — Find Your Perfect Ride",
    template: "%s · Dimitar's Motorcycles",
  },
  description:
    'Browse new and pre-owned motorcycles — sport, adventure, cruiser and more. Expert servicing and custom builds.',
  openGraph: {
    title: "Dimitar's Motorcycles",
    description: 'Browse new and pre-owned motorcycles, servicing and custom builds.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Resolve the session on the server so the client auth context starts seeded.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <UserProvider initialUser={user}>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
            theme="system"
            toastOptions={{
              style: {
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
          <Navbar />
          {children}
          <Footer />
          <BackToTopButton />
        </UserProvider>
      </body>
    </html>
  )
}
