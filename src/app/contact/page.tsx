"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Using Web3Forms - free, no backend needed
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "1a1c6c0a-f12d-45a9-a5af-acb176949647",
          name: form.name,
          email: form.email,
          subject: form.subject || "Portfolio Contact",
          message: form.message,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="relative min-h-screen bg-[#050505] overflow-hidden pt-32 pb-20 px-6">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-blue-400 font-bold mb-4">Get In Touch</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
            LET'S <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">
              CONNECT.
            </span>
          </h1>
          <p className="text-white/40 font-light mb-12 text-lg">
            Whether it's a project, a collab, or just a chat about markets and crypto — I'm all ears.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", label: "Your Name", type: "text", placeholder: "Rupankar Bhuiya" },
              { name: "email", label: "Your Email", type: "email", placeholder: "you@example.com" },
              { name: "subject", label: "Subject", type: "text", placeholder: "Let's build something" },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me what's on your mind..."
                required
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-lg tracking-tight transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {status === "sending" && <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />}
              {status === "sent" && <CheckCircle size={20} />}
              {status === "error" && <AlertCircle size={20} />}
              {status === "idle" && <Send size={20} />}
              {status === "idle" && "Send Message"}
              {status === "sending" && "Transmitting..."}
              {status === "sent" && "Message Sent!"}
              {status === "error" && "Failed — Try Again"}
            </motion.button>

            {/* Setup Note */}
            <p className="text-[10px] text-white/20 text-center font-mono">
              // Encrypted transmission via Web3Forms
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
