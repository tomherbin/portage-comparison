import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Comparaison des Sociétés de Portage Salarial en France',
  description: 'Comparez les sociétés de portage salarial pour les freelances français',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="flex justify-between items-center p-4 bg-background">
            <h1 className="text-2xl font-bold">Portage List</h1>
            <ThemeToggle />
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}