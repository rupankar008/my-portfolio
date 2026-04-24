"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Mail, ArrowRight, User } from "lucide-react";
import Link from "next/link";

interface OverlayProps {
  progress: MotionValue<number>;
}

export default function Overlay({ progress }: OverlayProps) {
  // Section 1: 0% to 20%
  const opacity1 = useTransform(progress, [0, 0.1, 0.2, 1], [1, 1, 0, 0]);
  const y1 = useTransform(progress, [0, 0.2, 1], [0, -50, -50]);

  // Section 2: 30% to 50%
  const opacity2 = useTransform(progress, [0, 0.2, 0.3, 0.4, 0.5, 1], [0, 0, 1, 1, 0, 0]);
  const y2 = useTransform(progress, [0, 0.2, 0.5, 1], [50, 50, -50, -50]);

  // Section 3: 60% to 80%
  const opacity3 = useTransform(progress, [0, 0.5, 0.6, 0.7, 0.8, 1], [0, 0, 1, 1, 0, 0]);
  const y3 = useTransform(progress, [0, 0.5, 0.8, 1], [50, 50, -50, -50]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12 w-full h-full">
      {/* Section 1: Intro */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-2xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Rupankar Bhuiya
          </span>
        </h1>
        <p className="text-2xl md:text-4xl text-white/90 font-light tracking-wide drop-shadow-md">
          Creative Developer.
        </p>
      </motion.div>

      {/* Section 2: Bio */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 max-w-2xl pointer-events-auto"
      >
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none drop-shadow-xl">
          I build <br className="hidden md:block" /> digital experiences.
        </h2>
        <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-8 drop-shadow-md">
          Crafting immersive, high-performance interfaces that bridge the gap between complex engineering and beautiful design. I specialize in React, Next.js, and WebGL animations.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 font-medium text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95">
            <span className="relative flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
              <User size={18} />
              About Me
            </span>
          </Link>
        </div>
      </motion.div>

      {/* Section 3: Contact */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 text-right max-w-xl pointer-events-auto"
      >
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none drop-shadow-xl">
          Let's create <br className="hidden md:block"/> something epic.
        </h2>
        <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-10 drop-shadow-md">
          Transforming abstract concepts into functional, interactive realities through code.
        </p>
        
        <div className="flex justify-end pointer-events-auto">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vmtolegit@gmail.com" target="_blank" rel="noreferrer" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-4 font-medium text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 active:scale-95">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
            <span className="relative flex items-center gap-3 font-bold text-lg">
              <Mail size={20} />
              Email Me
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
