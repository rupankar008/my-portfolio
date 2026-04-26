"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Terminal, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What are your core skills?",
  "Tell me about your trading experience",
  "How can I hire you?",
  "What is the 'Live Support' section?",
];

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const saved = sessionStorage.getItem("jarvis_chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Persistence: Save messages on change (Session Only)
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("jarvis_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Initial Greeting
  useEffect(() => {
    const saved = sessionStorage.getItem("jarvis_chat_history");
    if (isOpen && !saved && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content: "Greetings. I am JARVIS, the AI representative of Rupankar Bhuiya. I am here to assist you with inquiries regarding his expertise, projects, and availability. How may I facilitate your experience today?",
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Apologies, I encountered a connection error. Please try again or use Live Support." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-24 right-6 md:right-8 z-[90] flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-blue-500/30 p-2.5 md:px-4 md:py-2.5 rounded-full text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-400 transition-all"
      >
        <Bot size={18} className="md:w-5 md:h-5 animate-pulse" />
        <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Query JARVIS</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex flex-col md:flex-row h-screen overflow-hidden overscroll-none"
          >
            {/* Sidebar / Info - Hidden on Mobile Chat */}
            <div className="hidden md:flex w-80 border-r border-white/5 p-8 flex-col justify-between bg-blue-900/5">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                    <Terminal className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">JARVIS <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-400 align-middle ml-1">v4.0</span></h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Neural Representative</p>
                  </div>
                </div>

                <div className="space-y-6 hidden md:block">
                  <div>
                    <h4 className="text-[10px] text-blue-400 uppercase font-bold mb-2 tracking-widest">Core Directive</h4>
                    <p className="text-xs text-white/60 leading-relaxed">To represent Rupankar's portfolio with maximum efficiency and clarify technical capabilities to potential collaborators.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <ShieldCheck size={16} className="text-green-500 mb-2" />
                    <p className="text-[10px] text-white/40 leading-tight">All neural communications are encrypted via Secure P2P protocols.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    sessionStorage.removeItem("jarvis_chat_history");
                    setMessages([]);
                  }}
                  className="flex-1 py-3 rounded-xl border border-red-500/20 text-red-400/50 hover:bg-red-500/5 transition-all text-[10px] uppercase tracking-widest"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 transition-all text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Mobile Header (Visible only on mobile) */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-2">
                 <Terminal size={16} className="text-blue-400" />
                 <span className="text-sm font-bold text-white">JARVIS</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40"><X size={20} /></button>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col relative h-full">
              {/* Jarvis Visualization */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth">
                {messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
                       <div className={`flex items-center gap-2 mb-1 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
                          <span className="text-[8px] uppercase tracking-widest font-bold text-white/20">
                            {msg.role === "assistant" ? "Neural Link" : "Authorized Guest"}
                          </span>
                       </div>
                       <div className={`p-5 rounded-3xl text-sm leading-relaxed ${
                         msg.role === "assistant" 
                           ? "bg-blue-600/10 border border-blue-500/20 text-blue-50 text-shadow-glow" 
                           : "bg-white/5 border border-white/10 text-white/80"
                       }`}>
                         {msg.content}
                       </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-blue-400 rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-blue-400 rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-blue-400 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions Overlay */}
              {messages.length === 1 && !isTyping && (
                <div className="p-6 md:p-12 flex flex-wrap gap-2">
                   {SUGGESTIONS.map((s, i) => (
                     <button
                       key={i}
                       onClick={() => handleSend(s)}
                       className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] hover:bg-blue-500/20 hover:border-blue-500 transition-all flex items-center gap-2 group"
                     >
                       {s} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                     </button>
                   ))}
                </div>
              )}

              {/* Input */}
              <div className="shrink-0 p-4 md:p-12 border-t border-white/5 bg-black/60 backdrop-blur-xl">
                 <div className="relative max-w-4xl mx-auto flex items-center gap-2 md:gap-4">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
                      placeholder="Input neural query..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                    />
                    <button 
                      onClick={() => handleSend(inputText)}
                      className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                      <Send size={18} />
                    </button>
                 </div>
                 <div className="mt-2 md:mt-4 text-center">
                    <p className="text-[7px] md:text-[8px] text-white/10 uppercase tracking-[0.3em]">Neural Interface active | Gemini Core v1.5</p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
