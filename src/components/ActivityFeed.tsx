"use client";

import { motion } from "framer-motion";
import { Github, Music, Clock, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function ActivityFeed() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    const statuses = ["Compiling Node...", "Analyzing Market Data", "Pushing to Main", "Neural Link Active", "Optimizing UI"];
    const statusTimer = setInterval(() => {
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-32 left-6 md:left-8 z-[80] hidden lg:block">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-3 rounded-2xl group hover:border-blue-500/30 transition-all">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Zap size={14} className="text-blue-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">System Status</p>
            <p className="text-[10px] text-white/70 font-mono">{status}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-3 rounded-2xl group hover:border-purple-500/30 transition-all">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Github size={14} className="text-purple-400" />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Last Commit</p>
            <p className="text-[10px] text-white/70 font-mono">feat: neural-ui-v4</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-3 rounded-2xl group hover:border-pink-500/30 transition-all">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <Clock size={14} className="text-pink-400" />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Local Time</p>
            <p className="text-[10px] text-white/70 font-mono">{time} IST</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
