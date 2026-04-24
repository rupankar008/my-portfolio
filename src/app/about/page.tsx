"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Code2, ArrowLeft } from "lucide-react";
import { InstagramIcon } from "@/components/Icons";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Ambient glowing background effects */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-40">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 drop-shadow-2xl">
            Behind the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Code.
            </span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7"
          >
            <h2 className="text-3xl font-bold mb-6 text-white/90">I'm Rupankar Bhuiya.</h2>
            <div className="space-y-6 text-xl md:text-2xl font-light text-white/70 leading-relaxed">
              <p>
                I am a passionate <strong className="text-white font-medium">Creative Developer</strong> who loves everything about code. I believe that engineering and design are not two separate disciplines, but rather two sides of the same coin used to create magical digital experiences.
              </p>
              <p>
                My journey into programming started with an insatiable curiosity for how things work on the internet. Since then, I've dedicated myself to mastering the art of front-end development, specifically focusing on micro-interactions, WebGL, and ultra-smooth animations that make users go "wow".
              </p>
              <p>
                I don't just write code; I craft digital architecture. Every component, every animation curve, and every gradient is meticulously designed to push the boundaries of what is possible on the web today.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-5 space-y-6"
          >
            {/* Stats/Info Cards */}
            <div className="glass rounded-3xl p-8 hover:bg-white/5 transition-colors border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Code2 className="text-blue-400 mb-4" size={32} />
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Discipline</h3>
              <p className="text-white/60">Creative Engineering & UI/UX Design</p>
            </div>

            <div className="glass rounded-3xl p-8 hover:bg-white/5 transition-colors border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <GraduationCap className="text-purple-400 mb-4" size={32} />
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Education</h3>
              <p className="text-white/60">ISC 12th Pass Out</p>
            </div>

            <div className="glass rounded-3xl p-8 hover:bg-white/5 transition-colors border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <MapPin className="text-pink-400 mb-4" size={32} />
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Location</h3>
              <p className="text-white/60">Burdwan, West Bengal</p>
            </div>
          </motion.div>
        </div>

        {/* Connect Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-40 text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 relative z-10">
            Let's build the future.
          </h2>
          
          <a 
            href="https://instagram.com/rupankar.void"
            target="_blank"
            rel="noreferrer"
            className="group relative z-10 inline-flex items-center gap-4 bg-white px-10 py-5 rounded-full text-black hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-2 rounded-full text-white">
              <InstagramIcon size={24} />
            </div>
            <span className="text-xl font-bold tracking-wide">@rupankar.void</span>
          </a>
        </motion.div>

      </div>
    </main>
  );
}
