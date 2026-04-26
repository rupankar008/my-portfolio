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
};

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%#X@!".split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20 mix-blend-screen z-0" />;
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
    const cmd = input.trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === "exit") {
      setOpen(false);
      setInput("");
      return;
    }

    const cmdLower = cmd.toLowerCase();
    const newHistory = [...history, { type: "input" as const, text: `> ${cmdLower}` }];

    if (cmdLower === "clear") {
      setHistory([{ type: "output", text: "Terminal cleared." }]);
    } else if (cmdLower === "sudo hack") {
      document.body.classList.toggle("meltdown");
      newHistory.push({ type: "output", text: "MELTDOWN PROTOCOL INITIATED..." });
      newHistory.push({ type: "output", text: "ACCESS GRANTED." });
      setHistory(newHistory);
      
      if (typeof window !== "undefined") {
        import('@/lib/AudioSystem').then(({ audioSystem }) => audioSystem.playHover());
      }
    } else {
      const res = responses[cmdLower] ?? [`Command not found: "${cmdLower}". Type "help".`];
      res.forEach((line) => newHistory.push({ type: "output", text: line }));
      setHistory(newHistory);
    }

    setInput("");
  }, [input, history]);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 text-[9px] font-mono text-white/10 hover:text-white/30 transition-colors cursor-pointer select-none outline-none"
      >
        <span className="hidden md:inline">[type "void" to access terminal]</span>
        <span className="md:hidden">[tap to access terminal]</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-16 left-6 z-[200] w-[90vw] max-w-lg bg-black/95 border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)] backdrop-blur-2xl"
          >
            <MatrixRain />
            
            {/* Title Bar */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                RUPANKAR_OS // Terminal
              </span>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Output */}
            <div className="relative z-10 p-4 h-64 overflow-y-auto font-mono text-[12px] space-y-1">
              {history.map((line, i) => (
                <div key={i} className={line.type === "input" ? "text-blue-400" : "text-white/80 font-semibold drop-shadow-md"}>
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="relative z-10 flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-black/50">
              <span className="text-blue-400 font-mono text-sm">
                $
              </span>
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
