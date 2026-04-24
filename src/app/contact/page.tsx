"use client";

import { motion } from "framer-motion";
import { InstagramIcon, GithubIcon, DiscordIcon } from "@/components/Icons";
import { ArrowLeft, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "rupankar.void",
      url: "https://instagram.com/rupankar.void",
      icon: <InstagramIcon size={40} />,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-pink-500/20"
    },
    {
      name: "GitHub",
      handle: "rupankar008",
      url: "https://github.com/rupankar008",
      icon: <GithubIcon size={40} />,
      color: "from-gray-700 to-black",
      shadow: "shadow-white/10"
    },
    {
      name: "Discord",
      handle: "Join Discord Server",
      url: "https://discord.gg/gD8AwVuZBt",
      icon: <DiscordIcon size={40} />,
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-40">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Touch.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light">
            Whether you have a question or just want to say hi, my inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialLinks.map((social, idx) => (
            <motion.a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative glass rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${social.shadow} border border-white/5 hover:border-white/20`}
            >
              <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${social.color} text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {social.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{social.name}</h3>
              <p className="text-white/50 font-medium mb-8 uppercase tracking-widest text-sm">{social.handle}</p>
              
              <div className="mt-auto inline-flex items-center gap-2 text-white/80 font-bold group-hover:text-white transition-colors">
                Connect <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32 p-12 glass rounded-[40px] text-center border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prefer Email?</h2>
          <p className="text-white/60 mb-10 text-lg">Shoot me a message directly in your browser.</p>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=vmtolegit@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <Mail size={20} />
            vmtolegit@gmail.com
          </a>
        </motion.div>
      </div>
    </main>
  );
}
