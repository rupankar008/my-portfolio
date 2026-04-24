"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { User, Code, Zap, ArrowLeft, Briefcase, TrendingUp, ShieldCheck } from "lucide-react";
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
    <main ref={containerRef} className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-blue-500/30">
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
            <h1 className="text-7xl font-black tracking-tighter mb-8 leading-none">
              RUPANKAR <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                BHUIYA
              </span>
            </h1>
            <p className="text-xl text-white/60 font-light leading-relaxed mb-6">
              Based in <span className="text-white font-medium">Burdwan, West Bengal</span>. 
              An ISC 12th graduate with a relentless passion for the intersection of 
              <span className="text-white font-medium"> Technology, Cryptography, and Markets.</span>
            </p>
            <p className="text-white/40 leading-relaxed mb-10 italic">
              "I build systems that bridge the gap between digital security and financial freedom."
            </p>

            <div className="grid grid-cols-2 gap-6">
              <TiltCard className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <ShieldCheck className="text-blue-400 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-1 text-white">Cryptography</h3>
                <p className="text-sm text-white/40">Exploring secure digital systems.</p>
              </TiltCard>
              <TiltCard className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <TrendingUp className="text-green-400 mb-4" size={32} />
                <h3 className="font-bold text-lg mb-1 text-white">Trading</h3>
                <p className="text-sm text-white/40">Indian Stock & Crypto Markets.</p>
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
               <h2 className="text-3xl font-bold mb-6">Expertise</h2>
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Full Stack Coding", icon: <Code size={18} className="text-blue-500" /> },
                    { name: "System Technology", icon: <Zap size={18} className="text-yellow-500" /> },
                    { name: "Crypto Strategy", icon: <ShieldCheck size={18} className="text-purple-500" /> },
                    { name: "Stock Market Analysis", icon: <TrendingUp size={18} className="text-green-500" /> }
                  ].map((skill) => (
                    <div key={skill.name} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                       {skill.icon}
                       <span className="text-white/80 font-medium">{skill.name}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
               <h2 className="text-3xl font-bold mb-6">Lifestyle</h2>
               <p className="text-white/60 leading-relaxed">
                 When I'm not in front of a code editor, you'll find me analyzing charts in the 
                 <span className="text-white font-medium"> Indian Stock Market</span> or exploring the 
                 latest breakthroughs in the <span className="text-white font-medium">Crypto Ecosystem</span>. 
                 Trading is not just a hobby—it's a discipline.
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
