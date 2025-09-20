import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import "./globals.css";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "TriggerX App | Orbit Chain",
  description: "Deploy and manage your custom blockchain with TriggerX",
  generator: "v0.app",

  openGraph: {
    title: "TriggerX App | Orbit Chain",
    description: "Deploy and manage your custom blockchain with TriggerX",
    url: `http://localhost:3000/`,
    siteName: "TriggerX Orbit Chain",
    images: [
      {
        url: `http://localhost:3000/OGImages/Orbitchain.png`,
        width: 1200,
        height: 630,
        alt: "TriggerX Orbit Chain interface",
        type: "image/png",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: `http://localhost:3000/`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrapped children with Web3 providers and Suspense boundary */}
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
