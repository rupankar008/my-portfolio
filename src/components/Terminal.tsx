"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

const responses: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  whoami     — Identity info",
    "  skills     — List expertise",
    "  projects   — Show projects",
    "  contact    — Get contact info",
    "  crypto     — Crypto philosophy",
    "  clear      — Clear terminal",
    "  exit       — Close terminal",
  ],
  whoami: [
    "USER: Rupankar Bhuiya",
    "LOCATION: Burdwan, West Bengal",
    "EDUCATION: ISC 12th Graduate",
    "STATUS: Active // Creative Technologist",
    "SPECIALIZATION: Code · Crypto · Markets",
  ],
  skills: [
    "SKILL_MATRIX:",
    "  [████████████] Next.js / React",
    "  [██████████░░] Three.js / WebGL",
    "  [████████████] Framer Motion",
    "  [█████████░░░] Cryptography",
    "  [██████████░░] Stock / Crypto Trading",
    "  [████████████] TypeScript",
  ],
  projects: [
    "PROJECTS_LOADED:",
    "  → AI Nexus        [Next.js, OpenAI]",
    "  → Vivid Mobile    [React Native, Expo]",
    "  → Ether Design    [Figma, React]",
    "  → Quantum Web     [Three.js, GSAP]",
  ],
  contact: [
    "CONTACT_DETAILS:",
    "  EMAIL: vmtolegit@gmail.com",
    "  INSTAGRAM: @rupankar.void",
    "  GITHUB: github.com/rupankar008",
  ],
  crypto: [
    "CRYPTO_PHILOSOPHY:",
    "  'Code is law.'",
    "  'In math we trust.'",
    "  'Decentralization = Freedom.'",
    "  BTC: Digital Gold",
    "  ETH: World Computer",
    "  NIFTY: The Indian Story",
  ],
  clear: ["__CLEAR__"],
  exit: ["__EXIT__"],
};

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: "RUPANKAR_OS Terminal v2.0" },
    { type: "output", text: 'Type "help" for commands.' },
    { type: "output", text: "─────────────────────────" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Secret: type "void" anywhere on the page
  useEffect(() => {
    let buffer = "";
    const handleKey = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.endsWith("void")) {
        setOpen(true);
        buffer = "";
      }
      if (buffer.length > 20) buffer = buffer.slice(-20);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = useCallback(() => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: "input" as const, text: `> ${cmd}` }];

    if (cmd === "clear") {
      setHistory([{ type: "output", text: "Terminal cleared." }]);
    } else if (cmd === "exit") {
      setOpen(false);
    } else {
      const res = responses[cmd] ?? [`Command not found: "${cmd}". Type "help".`];
      res.forEach((line) => newHistory.push({ type: "output", text: line }));
      setHistory(newHistory);
    }

    setInput("");
  }, [input, history]);

  return (
    <>
      {/* Hidden trigger hint */}
      <div className="fixed bottom-6 left-6 z-40 text-[9px] font-mono text-white/10 hover:text-white/30 transition-colors cursor-default select-none">
        [type "void" to access terminal]
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-16 left-6 z-[200] w-[90vw] max-w-lg bg-black/95 border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)] backdrop-blur-2xl"
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">RUPANKAR_OS // Terminal</span>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Output */}
            <div className="p-4 h-64 overflow-y-auto font-mono text-[12px] space-y-1">
              {history.map((line, i) => (
                <div key={i} className={line.type === "input" ? "text-blue-400" : "text-white/60"}>
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5">
              <span className="text-blue-400 font-mono text-sm">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
