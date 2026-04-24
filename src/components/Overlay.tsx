"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useRef } from "react";
import MagneticButton from "./MagneticButton";

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Kinetic Typography: Titles slightly "skew" or "shift" on scroll
  const titleSkew = useTransform(scrollYProgress, [0, 0.2], [0, -5]);
  const titleX = useTransform(scrollYProgress, [0, 0.2], [0, -20]);

  return (
    <div ref={containerRef} className="relative z-10 w-full">
      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 relative overflow-hidden">
        <motion.div 
          style={{ skewY: titleSkew, x: titleX }}
          className="max-w-4xl"
        >
          <motion.h2 
            initial={{ opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.5 }}
            className="text-blue-400 font-bold uppercase text-[10px] md:text-xs mb-8 block"
          >
            The Digital Visionary
          </motion.h2>
          
          <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter mb-8 leading-[0.8] mix-blend-difference">
            RUPANKAR <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              BHUIYA
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/40 font-light max-w-2xl mb-12 leading-relaxed italic">
            "Design is not what it looks like. Design is how it works."
          </p>
          
          <div className="flex flex-wrap gap-6 relative z-[100] pointer-events-auto">
            <MagneticButton>
              <Link 
                href="/about" 
                className="group relative px-12 py-6 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] block"
              >
                <span className="relative z-10 tracking-tighter">EXPLORE STORY</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Section Divider Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* SECTION 2: VISION */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl ml-auto text-right"
        >
          <h2 className="text-purple-400 font-bold uppercase tracking-[0.5em] text-xs mb-8">Creative Philosophy</h2>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-10 leading-[0.9]">
            BEYOND THE <br />
            <span className="text-transparent stroke-text" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>
              ORDINARY.
            </span>
          </h2>
          
          <div className="flex justify-end relative z-[100] pointer-events-auto">
            <MagneticButton>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=vmtolegit@gmail.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group relative flex items-center gap-4 bg-white/5 border border-white/10 px-12 py-6 rounded-full font-bold text-white backdrop-blur-xl transition-all hover:border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                <Mail className="text-blue-400" />
                <span className="tracking-widest text-sm uppercase">Get In Touch</span>
              </a>
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
