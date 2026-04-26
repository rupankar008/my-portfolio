"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, ShieldCheck, Clock, Image as ImageIcon } from "lucide-react";
import type Peer from "peerjs";

interface Message {
  sender: "GUEST" | "DEV";
  text?: string;
  image?: string;
  time: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<"offline" | "connecting" | "online">("offline");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const heartbeatRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Cleanup peer on unmount
  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  // Inactivity Watchdog (5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "online" && !isAdmin) {
        const inactiveTime = Date.now() - lastActivityRef.current;
        if (inactiveTime > 5 * 60 * 1000) {
          const warning = "Chat closed due to 5 minutes of inactivity. Please refresh to start a new session.";
          setMessages(prev => [...prev, { sender: "DEV", text: warning, time: new Date().toLocaleTimeString() }]);
          if (connRef.current) {
            connRef.current.send({ type: "text", content: "Chat closed due to guest inactivity." });
            connRef.current.close();
          }
          setStatus("offline");
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [status, isAdmin]);

  // Check for Admin URL parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") {
        setIsAdmin(true);
        setIsOpen(true);
        if (peerRef.current) peerRef.current.destroy();
        initializePeer(true);
      }
    }
  }, []);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (status === "online" && connRef.current) {
      heartbeatRef.current = setInterval(() => {
        connRef.current.send({ type: "ping" });
      }, 10000);
    } else {
      clearInterval(heartbeatRef.current);
    }
    return () => clearInterval(heartbeatRef.current);
  }, [status]);

  const initializePeer = (asAdmin: boolean) => {
    import("peerjs").then(({ default: Peer }) => {
      const peerId = asAdmin ? "rupankar-admin-terminal-v1" : undefined;
      const peer = peerId ? new Peer(peerId) : new Peer();
      peerRef.current = peer;

      peer.on("open", () => {
        if (!asAdmin) connectToAdmin(peer);
        else {
          setStatus("online");
          setMessages([{ sender: "DEV", text: "Admin Mode Active. Waiting for guests...", time: new Date().toLocaleTimeString() }]);
        }
      });

      peer.on("connection", (conn) => {
        connRef.current = conn;
        setStatus("online");
        
        setTimeout(() => {
          const greeting = "Developer has joined the chat. Tell me your issue, how can I help you?";
          conn.send({ type: "text", content: greeting });
          setMessages(prev => [...prev, { sender: "DEV", text: greeting, time: new Date().toLocaleTimeString() }]);
        }, 1000);

        conn.on("data", (data: any) => {
          if (data.type === "ping") return;
          lastActivityRef.current = Date.now();
          if (data.type === "image") {
            setMessages(prev => [...prev, { sender: "GUEST", image: data.content, time: new Date().toLocaleTimeString() }]);
          } else {
            setMessages(prev => [...prev, { sender: "GUEST", text: data.content, time: new Date().toLocaleTimeString() }]);
          }
          new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3").play().catch(() => {});
        });

        conn.on("close", () => {
          setStatus("offline");
          setMessages(prev => [...prev, { sender: "DEV", text: "Guest disconnected.", time: new Date().toLocaleTimeString() }]);
        });
      });

      peer.on("error", (err) => {
        if (asAdmin && err.type === "unavailable-id") {
          setMessages(prev => [...prev, { sender: "DEV", text: "ERROR: Admin session active elsewhere.", time: new Date().toLocaleTimeString() }]);
        }
      });
    });
  };

  const connectToAdmin = (peer: Peer) => {
    setStatus("connecting");
    setMessages([{ sender: "DEV", text: "Developer has been notified. Please wait (within 2 min)...", time: new Date().toLocaleTimeString() }]);

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
        if (data.type === "ping") return;
        lastActivityRef.current = Date.now();
        if (data.type === "image") {
          setMessages(prev => [...prev, { sender: "DEV", image: data.content, time: new Date().toLocaleTimeString() }]);
        } else {
          setMessages(prev => [...prev, { sender: "DEV", text: data.content, time: new Date().toLocaleTimeString() }]);
        }
        new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3").play().catch(() => {});
      });

      conn.on("close", () => {
        setStatus("offline");
        setMessages(prev => [...prev, { sender: "DEV", text: "Developer disconnected.", time: new Date().toLocaleTimeString() }]);
      });
    };

    attemptConnection();
    retryInterval = setInterval(() => { if (!connected) attemptConnection(); }, 5000);
    setTimeout(() => {
      clearInterval(retryInterval);
      if (!connected) {
        setStatus("offline");
        setMessages(prev => [...prev, { sender: "DEV", text: "Developer is unavailable right now.", time: new Date().toLocaleTimeString() }]);
      }
    }, 120000);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !connRef.current) return;
    lastActivityRef.current = Date.now();
    connRef.current.send({ type: "text", content: inputText });
    setMessages(prev => [...prev, { sender: isAdmin ? "DEV" : "GUEST", text: inputText, time: new Date().toLocaleTimeString() }]);
    setInputText("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !connRef.current) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      lastActivityRef.current = Date.now();
      connRef.current.send({ type: "image", content: base64 });
      setMessages(prev => [...prev, { sender: isAdmin ? "DEV" : "GUEST", image: base64, time: new Date().toLocaleTimeString() }]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && !isAdmin && status === "offline") initializePeer(false);
        }}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {status === "online" && !isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={expandedImage}
              className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
            />
            <button className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 z-[100] w-[90vw] max-w-[380px] h-[500px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-4 bg-blue-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  {isAdmin ? <ShieldCheck size={20} className="text-blue-400" /> : <User size={20} className="text-blue-400" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{isAdmin ? "Admin Console" : "Live Support"}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === "online" ? "bg-green-500" : status === "connecting" ? "bg-yellow-500" : "bg-red-500"}`} />
                    <span className="text-[10px] text-white/50 uppercase font-mono">{status === "online" ? "Online" : status === "connecting" ? "Connecting..." : "Offline"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-blue-900/5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === (isAdmin ? "DEV" : "GUEST") ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === (isAdmin ? "DEV" : "GUEST") ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none"}`}>
                    {msg.image ? (
                      <img src={msg.image} alt="shared" className="rounded-lg max-w-full h-auto cursor-zoom-in" onClick={() => setExpandedImage(msg.image!)} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-white/30 font-mono"><Clock size={10} />{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <ImageIcon size={18} />
                </button>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
                />
                <button onClick={sendMessage} disabled={!inputText.trim()} className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
