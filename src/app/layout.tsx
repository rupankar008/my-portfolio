import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rupankar Bhuiya | Creative Developer & Interactive Designer",
  description: "Official portfolio of Rupankar Bhuiya. Specialized in building high-performance, interactive digital experiences using Next.js, Framer Motion, and WebGL.",
  openGraph: {
    title: "Rupankar Bhuiya | Creative Developer",
    description: "Building the future of interactive web experiences.",
    url: "https://my-portfolio-snowy-one-6769afbvgc.vercel.app/",
    siteName: "Rupankar Bhuiya Portfolio",
    locale: "en_US",
    type: "website",
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
        <div className="grain-overlay" />
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
