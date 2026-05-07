"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import DecryptedText from "./DecryptedText";
import { audioSystem } from "@/lib/AudioSystem";

export default function SecureMessage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    setIsSending(true);
    audioSystem.playSecure();
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        setMessage("");
      }, 3000);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 right-6 md:right-8 z-[85] w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all group"
      >
        <Lock size={18} className="text-white/40 group-hover:text-white group-hover:scale-110 transition-all" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden p-8 md:p-12 relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                CLOSE
              </button>

              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <Shield size={24} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Secure Handshake</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">End-to-End Encrypted Tunnel</p>
                </div>
              </div>

              {isSuccess ? (
                <div className="text-center py-12">
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                   >
                     <CheckCircle size={40} className="text-green-500" />
                   </motion.div>
                   <h3 className="text-xl font-bold mb-2">MESSAGE ENCRYPTED</h3>
                   <p className="text-white/40 text-sm">Signal transmitted to Rupankar Space nodes.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-2">Neural Input</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message to the void..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={isSending}
                    onClick={handleSend}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Lock size={18} />
                        </motion.div>
                        CIPHERING...
                      </span>
                    ) : (
                      <>
                        <Send size={18} />
                        TRANSMIT SIGNAL
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-12 pt-6 border-t border-white/5">
                <p className="text-[8px] text-white/10 text-center uppercase tracking-widest leading-loose">
                  All communications are obfuscated via 256-bit AES. <br/>
                  Target: RUPANKAR_BHUIYA_OFFICIAL_NODE
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
