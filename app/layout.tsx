import ScrollToTop from "@/components/scroll-to-top";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Providers from "@/components/providers";
import AppWrapper from "@/components/AppWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pokemonFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pokemon",
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Pokédex con Next.js y TanStack Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pokemonFont.variable} antialiased min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1e] to-[#1a0a0a] text-white`}
      >
        <Providers>
          <AppWrapper>
            {/* Header sticky con logo centrado */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
              <nav className="mx-auto flex max-w-7xl items-center justify-center px-6 py-4">
                <Link href="/" className="flex items-center gap-3 group">
                  {/* Pokéball */}
                  <div className="relative h-8 w-8 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <div className="absolute inset-0 rounded-full bg-white" />
                    <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-red-500" />
                    <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white" />
                  </div>
                  {/* Título */}
                  <h1 className={`${pokemonFont.className} text-2xl text-white md:text-3xl`}>
                    <span className="text-red-500">Poké</span>dex
                  </h1>
                </Link>
              </nav>
            </header>

            {/* Contenido principal */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
              Hecho con Next.js 16 + TanStack Query ·{" "}
              <span className="text-red-500">Pokédex</span> no oficial
            </footer>

            {/* Botón "Volver arriba" */}
            <ScrollToTop />
          </AppWrapper>
        </Providers>
      </body>
    </html>
  );
}