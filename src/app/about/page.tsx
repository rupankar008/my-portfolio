"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { User, Code, Zap, ArrowLeft, ShieldCheck, TrendingUp, Cpu, Globe } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useDecrypt } from "@/hooks/useDecrypt";
import MarketChart from "@/components/MarketChart";

function HexagonSkill({ name, icon, color }: { name: string, icon: React.ReactNode, color: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative w-32 h-36 flex items-center justify-center cursor-pointer group"
    >
      <div className={`absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 group-hover:border-${color}-500/50 group-hover:bg-${color}-500/10`} 
           style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
      <div className="z-10 flex flex-col items-center gap-2">
        <div className={`text-white/40 group-hover:text-${color}-400 transition-colors`}>{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/80 transition-colors">{name}</span>
      </div>
      <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity bg-${color}-500`} />
    </motion.div>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { displayText: aboutTitle, setIsHovered: setHoverTitle } = useDecrypt("MYSELF");
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const [sessionHash, setSessionHash] = useState("");

  useEffect(() => {
    const hash = Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setSessionHash(hash);
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-blue-500/30 pt-16">
      {/* Parallax Background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-16 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-widest font-bold">Back to Base</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <h1 
              onMouseEnter={() => setHoverTitle(true)}
              onMouseLeave={() => setHoverTitle(false)}
              className="text-8xl font-black tracking-tighter mb-8 leading-none"
            >
              ABOUT <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                {aboutTitle}
              </span>
            </h1>
            
            <div className="space-y-6 text-white/50 text-xl font-light leading-relaxed max-w-xl">
               <p>
                 I am <span className="text-white font-bold tracking-tight">RUPANKAR BHUIYA</span>, 
                 a creative technologist based in <span className="text-white/80">Burdwan, West Bengal</span>.
               </p>
               <p>
                 Specializing in the intersection of <span className="text-white font-bold">Web Technology</span> and 
                 <span className="text-white font-bold"> Financial Markets</span>.
               </p>
            </div>

            {/* Hex Grid Section */}
            <div className="mt-16">
              <h3 className="text-xs uppercase tracking-[0.5em] text-white/30 font-bold mb-10">Expertise_Matrix</h3>
              <div className="flex flex-wrap gap-4 max-w-md">
                <HexagonSkill name="Coding" icon={<Code size={24} />} color="blue" />
                <HexagonSkill name="Crypto" icon={<ShieldCheck size={24} />} color="purple" />
                <HexagonSkill name="Trading" icon={<TrendingUp size={24} />} color="green" />
                <HexagonSkill name="Systems" icon={<Cpu size={24} />} color="pink" />
              </div>
            </div>
          </motion.div>

          {/* Right: Market Chart */}
          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-[0.5em] text-white/30 font-bold mb-4">Real_Time_Analytics</h3>
            <MarketChart />

            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl">
              <h2 className="text-3xl font-black mb-6 tracking-tight">Cryptography</h2>
              <p className="text-white/40 leading-relaxed italic">
                "Code is law. In the realm of bits and hashes, truth is mathematical."
              </p>
            </div>
          </div>
        </div>

        {/* CRYPTO FOOTER SIGNATURE */}
        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">Session_Signature</span>
              <span className="text-[9px] font-mono text-blue-500/50 break-all max-w-md">{sessionHash}</span>
           </div>
           <div className="text-[10px] uppercase tracking-[0.3em] text-white/10">
              © 2026 RB_VOID // EST. 200X
           </div>
        </footer>
      </div>
    </main>
  );
}
