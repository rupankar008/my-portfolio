"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Code, Layout, Smartphone, Globe } from "lucide-react";
import MagneticButton from "./MagneticButton";
import DecryptedText from "./DecryptedText";
import Web3Tip from "./Web3Tip";
import { useState, useRef } from "react";

const projects = [
  {
    title: "AI Nexus",
    description: "A high-performance AI dashboard built with Next.js 14 and OpenAI API.",
    tech: ["Next.js", "Tailwind", "OpenAI"],
    icon: <Code className="text-blue-400" />,
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-500/10 to-transparent"
  },
  {
    title: "Vivid Mobile",
    description: "Cross-platform mobile experience for modern commerce.",
    tech: ["React Native", "Expo"],
    icon: <Smartphone className="text-purple-400" />,
    className: "md:col-span-1 md:row-span-1 bg-white/5"
  },
  {
    title: "Ether Design",
    description: "A minimalist design system for creative agencies.",
    tech: ["Figma", "React"],
    icon: <Layout className="text-pink-400" />,
    className: "md:col-span-1 md:row-span-1 bg-white/5"
  },
  {
    title: "Quantum Web",
    description: "WebGL powered 3D website with immersive scrollytelling.",
    tech: ["Three.js", "GSAP"],
    icon: <Globe className="text-blue-500" />,
    className: "md:col-span-2 md:row-span-1 bg-white/5"
  }
];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all duration-200 ${project.className}`}
    >
      {/* Holographic Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="glitch-scanline absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <div 
        style={{ transform: "translateZ(50px)" }}
        className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:opacity-60 transition-all"
      >
        {project.icon}
      </div>
      
      <div style={{ transform: "translateZ(30px)" }}>
        <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{project.title}</h3>
        <p className="text-white/50 font-light max-w-xs">{project.description}</p>
      </div>

      <div 
        style={{ transform: "translateZ(20px)" }}
        className="flex items-center justify-between mt-8"
      >
        <div className="flex gap-2">
          {project.tech.map((t) => (
            <span key={t} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
              {t}
            </span>
          ))}
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
          <ExternalLink size={18} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 md:px-20 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-sm uppercase tracking-[0.5em] text-white/40 font-bold mb-4">
            <DecryptedText text="Selected Work" />
          </h2>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">
            <DecryptedText text="Crafted with" sequential={false} /> <br/> 
            <span className="text-blue-500">
              <DecryptedText text="Precision." delay={300} />
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] [perspective:1000px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        {/* SOCIAL PROOF FOOTER SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 pt-20 border-t border-white/10 text-center"
        >
           <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 opacity-10 uppercase">
             <DecryptedText text="Let's Connect" speed={30} maxIterations={20} />
           </h2>
           <div className="flex flex-wrap justify-center gap-12">
              <a href="https://instagram.com/rupankar.void" target="_blank" className="text-2xl font-bold text-white/50 hover:text-blue-400 transition-colors">Instagram</a>
              <a href="https://github.com/rupankar008" target="_blank" className="text-2xl font-bold text-white/50 hover:text-purple-400 transition-colors">GitHub</a>
              <a href="https://discord.com" target="_blank" className="text-2xl font-bold text-white/50 hover:text-pink-400 transition-colors">Discord</a>
           </div>
           
           <Web3Tip />
           
           <p className="mt-8 text-white/20 text-sm tracking-widest">
             <DecryptedText text="© 2026 RUPANKAR BHUIYA. ALL RIGHTS RESERVED." delay={500} />
           </p>
        </motion.div>
      </div>
    </section>
  );
}

