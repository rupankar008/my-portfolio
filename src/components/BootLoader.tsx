"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const bootLines = [
  "> Initializing RUPANKAR_OS v2.0.26...",
  "> Loading kernel modules...",
  "> Mounting filesystem: /projects [OK]",
  "> Connecting to crypto_network...",
  "> Decrypting identity.key...",
  "> Verifying session_signature...",
  "> Loading: framer-motion, three.js, next.js...",
  "> All systems nominal.",
  "> Welcome, Operator.",
];

export default function BootLoader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show boot sequence
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    // Trigger a global custom event so NeuralAudio knows to start
    window.dispatchEvent(new Event("neural_audio_start"));
    setVisible(false);
    setTimeout(onComplete, 600);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col justify-center items-start px-8 md:px-24 font-mono"
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)"
          }} />

          {/* Logo */}
          <div className="mb-12">
            <div className="text-blue-500 text-[10px] tracking-[0.5em] uppercase mb-2">RUPANKAR_OS</div>
            <div className="text-white/10 text-[10px] tracking-widest">v2.0.26 // BURDWAN KERNEL</div>
          </div>

          {/* Boot Lines */}
          <div className="space-y-2 max-w-2xl w-full">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`text-sm ${i === lines.length - 1 ? "text-green-400" : "text-white/40"}`}
              >
                {line}
              </motion.div>
            ))}
            {done && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnter}
                className="mt-8 px-6 py-2.5 bg-blue-600/20 border border-blue-500/50 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-[0.2em] hover:bg-blue-600/30 transition-all flex items-center gap-3"
              >
                Enter System
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              </motion.button>
            )}
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="inline-block w-2 h-4 bg-blue-400 ml-1"
              />
            )}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-12 left-8 right-8 md:left-24 md:right-24">
            <div className="flex justify-between text-[9px] text-white/20 uppercase tracking-widest mb-2">
              <span>Loading</span>
              <span>{Math.round((lines.length / bootLines.length) * 100)}%</span>
            </div>
            <div className="h-[1px] bg-white/10 w-full">
              <motion.div
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                animate={{ width: `${(lines.length / bootLines.length) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
