import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Ticker from "@/components/Ticker";
import Terminal from "@/components/Terminal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rupankar Space | Official Portfolio of Rupankar Bhuiya",
  description: "Explore Rupankar Space - the interactive portfolio of Rupankar Bhuiya. A Creative Developer, Cryptographer, and Stock Market Expert specializing in high-end digital experiences.",
  keywords: ["Rupankar Space", "Rupankar Bhuiya", "Creative Developer", "Next.js Portfolio", "Burdwan Developer", "Trading Portfolio", "Interactive Web Design"],
  authors: [{ name: "Rupankar Bhuiya" }],
  openGraph: {
    title: "Rupankar Space | Digital Frontier",
    description: "Building the next generation of interactive web experiences.",
    url: "https://rupankar.space",
    siteName: "Rupankar Space",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rupankar Space Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rupankar Space",
    description: "Creative Developer & Interactive Designer",
    creator: "@rupankar008",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-white antialiased selection:bg-blue-500/30`}>
        <Ticker />
        <div className="grain-overlay" />
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
        {/* Terminal Easter Egg — global, outside SmoothScroll */}
        <Terminal />
      </body>
    </html>
  );
}
