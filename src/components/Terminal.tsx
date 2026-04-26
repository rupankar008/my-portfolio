"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import type Peer from "peerjs";

const responses: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  whoami     — Identity info",
    "  skills     — List expertise",
    "  projects   — Show projects",
    "  contact    — Get contact info",
    "  crypto     — Crypto philosophy",
    "  chat       — Live P2P chat with Developer",
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
  const [chatMode, setChatMode] = useState<"idle" | "connecting" | "chatting" | "admin">("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<any>(null);

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

  // AUTO-ADMIN DETECTOR: If URL has ?admin=true, auto-trigger sudo admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") {
        setOpen(true);
        // Delay to allow component to mount fully
        setTimeout(() => handleCommand("sudo admin"), 500);
      }
    }
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = useCallback((forceCmd?: string | React.MouseEvent | React.KeyboardEvent) => {
    const rawCmd = typeof forceCmd === 'string' ? forceCmd : input;
    const cmd = rawCmd.trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === "exit") {
      if (chatMode !== "idle") {
        connRef.current?.close();
        peerRef.current?.destroy();
        setChatMode("idle");
        setHistory((h) => [...h, { type: "input", text: "> exit" }, { type: "output", text: "[P2P] Disconnected." }]);
        setInput("");
        return;
      }
      setOpen(false);
      setInput("");
      return;
    }

    if (chatMode === "chatting" || chatMode === "admin") {
      const prefix = chatMode === "admin" ? "[DEV]" : "[ME]";
      setHistory((h) => [...h, { type: "input", text: `${prefix}: ${cmd}` }]);
      connRef.current?.send(cmd);
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
    } else if (cmdLower === "chat") {
      newHistory.push({ type: "output", text: "Connecting to secure P2P channel..." });
      newHistory.push({ type: "output", text: "Pinging Developer via Email..." });
      setHistory(newHistory);
      setChatMode("connecting");

      // Live Support Web3Forms Email Trigger
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "1a1c6c0a-f12d-45a9-a5af-acb176949647",
          subject: "🚨 URGENT: Guest wants Live Chat!",
          name: "Terminal System",
          email: "noreply@portfolio.com",
          message: `A guest just initiated a Live Chat session. 

CLICK HERE TO JOIN IMMEDIATELY:
https://rupankar008.vercel.app/?admin=true

(This link will automatically log you in as Admin and open the secure channel)`
        })
      }).catch(console.error);

      import("peerjs").then(({ default: Peer }) => {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", () => {
          const conn = peer.connect("rupankar-admin-terminal-v1");
          connRef.current = conn;
          
          let connected = false;

          conn.on("open", () => {
            connected = true;
            setChatMode("chatting");
            setHistory((h) => [...h, { type: "output", text: "[P2P SECURE] Connected to Developer." }]);
          });

          conn.on("data", (data) => {
            setHistory((h) => [...h, { type: "output", text: `[DEV]: ${data}` }]);
            if (typeof window !== "undefined") {
              import('@/lib/AudioSystem').then(({ audioSystem }) => audioSystem.playHover());
            }
          });

          conn.on("close", () => {
            setChatMode("idle");
            setHistory((h) => [...h, { type: "output", text: "[P2P SECURE] Connection closed." }]);
          });
          
          setTimeout(() => {
            if (!connected) {
               setChatMode("idle");
               setHistory((h) => [...h, { type: "output", text: "Developer is currently offline." }]);
               peer.destroy();
            }
          }, 4000);
        });
      });
    } else if (cmdLower === "sudo admin") {
      newHistory.push({ type: "output", text: "Initializing Admin Node..." });
      setHistory(newHistory);
      setChatMode("admin");

      import("peerjs").then(({ default: Peer }) => {
        const peer = new Peer("rupankar-admin-terminal-v1");
        peerRef.current = peer;

        peer.on("open", (id) => {
          setHistory((h) => [...h, { type: "output", text: `Listening on secure channel...` }]);
        });

        peer.on("connection", (conn) => {
          connRef.current = conn;
          setHistory((h) => [...h, { type: "output", text: `[P2P] Peer connected.` }]);

          conn.on("data", (data) => {
            setHistory((h) => [...h, { type: "output", text: `[GUEST]: ${data}` }]);
            if (typeof window !== "undefined") {
              import('@/lib/AudioSystem').then(({ audioSystem }) => audioSystem.playHover());
            }
          });
          
          conn.on("close", () => {
            setHistory((h) => [...h, { type: "output", text: `[P2P] Peer disconnected.` }]);
            connRef.current = null;
          });
        });
        
        peer.on("error", (err) => {
          setHistory((h) => [...h, { type: "output", text: `[ERROR]: ${err.type}` }]);
          setChatMode("idle");
        });
      });
    } else {
      const res = responses[cmdLower] ?? [`Command not found: "${cmdLower}". Type "help".`];
      res.forEach((line) => newHistory.push({ type: "output", text: line }));
      setHistory(newHistory);
    }

    setInput("");
  }, [input, history, chatMode]);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 text-[9px] font-mono text-white/10 hover:text-white/30 transition-colors cursor-pointer select-none outline-none"
      >
        <span className="hidden md:inline">[type "void" to access terminal]</span>
        <span className="md:hidden">[tap to access terminal]</span>
      </button>

      {/* Live Support Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setOpen(true);
          if (chatMode === "idle") {
            // Give it a tiny delay so the terminal opens first
            setTimeout(() => handleCommand("chat"), 100);
          }
        }}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-5 py-3 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 font-mono text-xs font-bold tracking-widest transition-colors cursor-pointer outline-none"
      >
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="hidden sm:inline">LIVE SUPPORT</span>
        <span className="sm:hidden">CHAT</span>
      </motion.button>

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
                {chatMode === "idle" ? "RUPANKAR_OS // Terminal" : "P2P SECURE CHAT"}
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
                {chatMode === "idle" ? "$" : ">"}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                placeholder={chatMode === "idle" ? "type a command..." : "type a message (exit to quit)..."}
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
