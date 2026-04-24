"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Code, Layout, Smartphone, Globe } from "lucide-react";
import MagneticButton from "./MagneticButton";

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
          <h2 className="text-sm uppercase tracking-[0.5em] text-white/40 font-bold mb-4">Selected Work</h2>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">CRAFTED WITH <br/> <span className="text-blue-500">PRECISION.</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all ${project.className}`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                {project.icon}
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                <p className="text-white/50 font-light max-w-xs">{project.description}</p>
              </div>

              <div className="flex items-center justify-between mt-8">
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
          ))}
        </div>

        {/* SOCIAL PROOF FOOTER SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 pt-20 border-t border-white/10 text-center"
        >
           <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 opacity-10 uppercase">Let's Connect</h2>
           <div className="flex flex-wrap justify-center gap-12">
              <a href="https://instagram.com/rupankar.void" target="_blank" className="text-2xl font-bold text-white/50 hover:text-blue-400 transition-colors">Instagram</a>
              <a href="https://github.com/rupankar008" target="_blank" className="text-2xl font-bold text-white/50 hover:text-purple-400 transition-colors">GitHub</a>
              <a href="https://discord.com" target="_blank" className="text-2xl font-bold text-white/50 hover:text-pink-400 transition-colors">Discord</a>
           </div>
           <p className="mt-20 text-white/20 text-sm tracking-widest">© 2026 RUPANKAR BHUIYA. ALL RIGHTS RESERVED.</p>
        </motion.div>
      </div>
    </section>
  );
}
