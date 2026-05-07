"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 font-mono relative overflow-hidden">
      {/* Background Matrix/Glitch Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="glitch-scanline absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <div className="max-w-2xl w-full border border-red-500/20 bg-red-500/5 p-8 md:p-12 rounded-[2rem] relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          <h1 className="text-xl font-bold text-red-500 tracking-tighter uppercase">CRITICAL SYSTEM FAILURE</h1>
        </div>

        <div className="space-y-6 text-red-400/60 text-xs md:text-sm leading-relaxed">
          <p>*** FATAL ERROR 404: RESOURCE_NOT_FOUND ***</p>
          <p>The neural link at this coordinate has been severed or does not exist in the current reality matrix.</p>
          
          <div className="p-6 bg-black/40 border border-red-500/10 rounded-xl space-y-2">
            <p className="text-white/40 uppercase text-[10px] tracking-widest font-bold">Diagnostic Report:</p>
            <p>LOCATION: {typeof window !== "undefined" ? window.location.pathname : "UNKNOWN"}</p>
            <p>STATUS: UNRESOLVED</p>
            <p>PRIORITY: MAXIMUM</p>
          </div>

          <p>Attempts to recover data from local nodes have failed. Recommending manual system reboot to safe zone.</p>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <Link href="/" className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center hover:bg-red-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.3)] uppercase tracking-widest text-xs">
            Initiate Reboot
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex-1 border border-red-500/20 text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center hover:bg-red-500/5 transition-all text-xs uppercase tracking-widest"
          >
            Trace Back
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[10px] text-white/5 uppercase tracking-[0.5em]">Neural Interface v4.0.4 | Emergency Protocol Active</p>
      </div>
    </div>
  );
}
