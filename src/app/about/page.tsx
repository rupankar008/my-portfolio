"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { User, Code, Zap, ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Intro */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-black tracking-tighter mb-8">
              ABOUT <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                MYSELF
              </span>
            </h1>
            <p className="text-xl text-white/60 font-light leading-relaxed mb-10">
              I am a creative developer who believes that the web should be an experience, not just a tool. 
              My journey started with a fascination for interactive art, which evolved into a professional 
              career building high-performance digital products.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <TiltCard className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <Zap className="text-blue-400 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-1 text-white">Performance</h3>
                <p className="text-sm text-white/40">Optimized, fast, and lightweight code.</p>
              </TiltCard>
              <TiltCard className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <Code className="text-purple-400 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-1 text-white">Interactive</h3>
                <p className="text-sm text-white/40">Immersive animations and transitions.</p>
              </TiltCard>
            </div>
          </motion.div>

          {/* Right Side: Skill Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User size={120} />
               </div>
               <h2 className="text-3xl font-bold mb-6">Expertise</h2>
               <div className="space-y-4">
                  {["Next.js / React", "Framer Motion", "Three.js / WebGL", "UI/UX Design", "TypeScript"].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       <span className="text-white/80 font-medium">{skill}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
               <h2 className="text-3xl font-bold mb-6">Vision</h2>
               <p className="text-white/60 leading-relaxed italic">
                 "I don't just build websites. I build digital worlds where every pixel tells a story and every interaction creates a memory."
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
