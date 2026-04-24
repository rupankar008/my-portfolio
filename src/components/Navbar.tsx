"use client";

import { motion } from "framer-motion";
import { InstagramIcon } from "@/components/Icons";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="group flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-pink-500 text-white font-black text-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-110 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all">
          RB
        </Link>
        
        <div className="flex items-center gap-3 md:gap-8 bg-black/20 backdrop-blur-md px-4 md:px-8 py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
          <Link href="/about" className="text-[10px] md:text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            About
          </Link>
          <Link href="/#projects" className="text-[10px] md:text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Projects
          </Link>
          <Link href="/contact" className="text-[10px] md:text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Contact
          </Link>
        </div>
        
        <a 
          href="https://instagram.com/rupankar.void" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
        >
          <InstagramIcon size={18} />
          <span className="hidden sm:inline">rupankar.void</span>
        </a>
      </div>
    </motion.nav>
  );
}
