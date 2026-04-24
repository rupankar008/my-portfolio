"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail } from "lucide-react";

export default function Overlay() {
  return (
    <div className="relative z-10 w-full">
      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h2 className="text-blue-400 font-bold uppercase tracking-[0.5em] text-xs mb-6 block">The Digital Visionary</h2>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
            RUPANKAR <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              BHUIYA
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white/50 font-light max-w-2xl mb-12 leading-relaxed">
            Architecting high-performance, interactive digital experiences that bridge the gap between design and pure code.
          </p>
          
          <div className="flex flex-wrap gap-6 relative z-[100] pointer-events-auto">
            <Link 
              href="/about" 
              className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">ABOUT ME</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </motion.div>

        {/* Section Divider Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-[1px]" />
      </section>

      {/* SECTION 2: EXPERIENCE / VISION */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 bg-gradient-to-b from-transparent to-blue-900/5 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl ml-auto text-right"
        >
          <h2 className="text-purple-400 font-bold uppercase tracking-[0.5em] text-xs mb-6">Expertise & Vision</h2>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            PUSHING THE <br />
            <span className="text-transparent border-b-2 border-white/20">POSSIBILITIES.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-12 max-w-2xl ml-auto">
            I don't just build websites. I build digital worlds where every pixel tells a story and every interaction creates a memory.
          </p>
          
          <div className="flex justify-end relative z-[100] pointer-events-auto">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=vmtolegit@gmail.com" 
              target="_blank" 
              rel="noreferrer" 
              className="group relative flex items-center gap-4 bg-white/5 border border-white/10 px-10 py-5 rounded-full font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              <Mail className="text-blue-400 group-hover:rotate-12 transition-transform" />
              <span>EMAIL ME</span>
            </a>
          </div>
        </motion.div>

        {/* Section Divider Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-[1px]" />
      </section>
    </div>
  );
}
