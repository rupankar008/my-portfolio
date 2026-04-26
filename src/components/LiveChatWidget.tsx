"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, ShieldCheck, Clock } from "lucide-react";
import type Peer from "peerjs";

interface Message {
  sender: "GUEST" | "DEV";
  text: string;
  time: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<"offline" | "connecting" | "online">("offline");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Check for Admin URL parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") {
        setIsAdmin(true);
        setIsOpen(true);
        initializePeer(true);
      }
    }
  }, []);

  const initializePeer = (asAdmin: boolean) => {
    import("peerjs").then(({ default: Peer }) => {
      const peerId = asAdmin ? "rupankar-admin-terminal-v1" : undefined;
      const peer = peerId ? new Peer(peerId) : new Peer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        if (!asAdmin) {
          connectToAdmin(peer);
        } else {
          setStatus("online");
          setMessages(prev => [...prev, { sender: "DEV", text: "Admin Mode Active. Waiting for guests...", time: new Date().toLocaleTimeString() }]);
        }
      });

      peer.on("connection", (conn) => {
        connRef.current = conn;
        setStatus("online");
        
        // AUTO-GREETING FROM DEV TO GUEST
        setTimeout(() => {
          const greeting = "Developer has joined the chat. Tell me your issue, how can I help you?";
          conn.send(greeting);
          setMessages(prev => [...prev, { sender: "DEV", text: greeting, time: new Date().toLocaleTimeString() }]);
        }, 1000);

        conn.on("data", (data: any) => {
          setMessages(prev => [...prev, { sender: "GUEST", text: data, time: new Date().toLocaleTimeString() }]);
          new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3").play().catch(() => {});
        });

        conn.on("close", () => {
          setStatus("offline");
          setMessages(prev => [...prev, { sender: "DEV", text: "Guest disconnected.", time: new Date().toLocaleTimeString() }]);
        });
      });

      peer.on("error", (err) => {
        console.error("PEER ERROR:", err.type);
        if (asAdmin && err.type === "unavailable-id") {
          setMessages(prev => [...prev, { sender: "DEV", text: "Error: Admin session active elsewhere.", time: new Date().toLocaleTimeString() }]);
        }
      });
    });
  };

  const connectToAdmin = (peer: Peer) => {
    setStatus("connecting");
    setMessages([{ sender: "DEV", text: "Developer has been notified. Please wait (within 2 min)...", time: new Date().toLocaleTimeString() }]);

    // FIRE EMAIL
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "1a1c6c0a-f12d-45a9-a5af-acb176949647",
        subject: "🚀 URGENT: Guest waiting for Chat!",
        name: "Support System",
        message: `Join now: ${currentOrigin}/?admin=true`
      })
    }).catch(console.error);

    let retryInterval: any;
    let connected = false;

    const attemptConnection = () => {
      if (connected) return;
      const conn = peer.connect("rupankar-admin-terminal-v1");
      connRef.current = conn;

      conn.on("open", () => {
        connected = true;
        clearInterval(retryInterval);
        setStatus("online");
        setMessages(prev => [...prev, { sender: "DEV", text: "Connected! Developer is here.", time: new Date().toLocaleTimeString() }]);
      });

      conn.on("data", (data: any) => {
        setMessages(prev => [...prev, { sender: "DEV", text: data, time: new Date().toLocaleTimeString() }]);
        new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3").play().catch(() => {});
      });

      conn.on("close", () => {
        setStatus("offline");
        setMessages(prev => [...prev, { sender: "DEV", text: "Developer disconnected.", time: new Date().toLocaleTimeString() }]);
      });
    };

    // Initial attempt
    attemptConnection();

    // RETRY EVERY 5 SECONDS
    retryInterval = setInterval(() => {
      if (!connected) {
        attemptConnection();
      }
    }, 5000);

    // 2 MINUTE TIMEOUT
    setTimeout(() => {
      clearInterval(retryInterval);
      if (!connected) {
        setStatus("offline");
        setMessages(prev => [...prev, { sender: "DEV", text: "Developer is unavailable right now. Please try again later or use the Contact page.", time: new Date().toLocaleTimeString() }]);
      }
    }, 120000);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !connRef.current) return;
    
    connRef.current.send(inputText);
    setMessages(prev => [...prev, { sender: isAdmin ? "DEV" : "GUEST", text: inputText, time: new Date().toLocaleTimeString() }]);
    setInputText("");
  };

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && !isAdmin && status === "offline") {
            initializePeer(false);
          }
        }}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {status === "online" && !isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 z-[100] w-[90vw] max-w-[380px] h-[500px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  {isAdmin ? <ShieldCheck size={20} className="text-blue-400" /> : <User size={20} className="text-blue-400" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {isAdmin ? "Admin Console" : "Live Support"}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === "online" ? "bg-green-500" : status === "connecting" ? "bg-yellow-500" : "bg-red-500"}`} />
                    <span className="text-[10px] text-white/50 uppercase font-mono">
                      {status === "online" ? "Online" : status === "connecting" ? "Connecting..." : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-blue-900/5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === (isAdmin ? "DEV" : "GUEST") ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === (isAdmin ? "DEV" : "GUEST") 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-white/30 font-mono">
                    <Clock size={10} />
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center gap-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-colors placeholder-white/20"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Attribution */}
            <div className="py-2 text-center bg-black/60">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-mono">Secure P2P Channel Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
