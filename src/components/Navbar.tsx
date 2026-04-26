"use client";

import { motion } from "framer-motion";
import { InstagramIcon } from "@/components/Icons";
import Link from "next/link";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audioSystem } from "@/lib/AudioSystem";

export default function Navbar() {
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioSystem.toggleMute(newMuted);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed top-10 left-0 right-0 z-50 glass-nav px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* CUSTOM ILLUSTRATED SVG LOGO */}
        <Link href="/" className="group relative flex items-center justify-center">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 animate-spin-slow opacity-80" />
             <div className="absolute inset-[2px] bg-[#050505] rounded-full z-10" />
             
             <svg viewBox="0 0 100 100" className="w-8 h-8 z-20 relative">
                <defs>
                   <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#F472B6" />
                   </linearGradient>
                </defs>
                <path 
                   d="M30 25 L70 25 L70 45 L45 45 L70 75 L45 75 L30 50 L30 75 L30 25 Z" 
                   fill="url(#logo-grad)" 
                   className="drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                />
             </svg>
          </div>
        </Link>
        
        <div className="flex items-center gap-3 md:gap-8 bg-black/20 backdrop-blur-md px-4 md:px-8 py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
          <Link href="/about" 
                onMouseEnter={() => audioSystem.playHover()} 
                onClick={() => audioSystem.playClick()}
                className="text-[10px] md:text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            About
          </Link>
          <Link href="/#projects" 
                onMouseEnter={() => audioSystem.playHover()} 
                onClick={() => audioSystem.playClick()}
                className="text-[10px] md:text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Projects
          </Link>
          <Link href="/contact" 
                onMouseEnter={() => audioSystem.playHover()} 
                onClick={() => audioSystem.playClick()}
                className="text-[10px] md:text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Contact
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleAudio}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={16} className="text-white/50" /> : <Volume2 size={16} className="text-white" />}
          </button>

          <a 
            href="https://instagram.com/rupankar.void" 
            target="_blank" 
            rel="noreferrer"
            onMouseEnter={() => audioSystem.playHover()} 
            onClick={() => audioSystem.playClick()}
            className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
          >
            <InstagramIcon size={18} />
            <span className="hidden sm:inline">rupankar.void</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
