import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://blog.hribal.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ByteFeed — Real-world web dev notes",
    template: "%s · ByteFeed",
  },
  description:
    "Practical engineering notes on Next.js, TypeScript, Docker, and backend — written from production experience, not documentation.",
  keywords: ["Next.js", "TypeScript", "React", "Docker", "DevOps", "web development", "performance", "Karel Hribal"],
  authors: [{ name: "Karel Hribal", url: BASE_URL }],
  creator: "Karel Hribal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "ByteFeed",
    title: "ByteFeed — Real-world web dev notes",
    description:
      "Practical engineering notes on Next.js, TypeScript, Docker, and backend — written from production experience, not documentation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteFeed — Real-world web dev notes",
    description:
      "Practical engineering notes on Next.js, TypeScript, Docker, and backend — written from production experience, not documentation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
