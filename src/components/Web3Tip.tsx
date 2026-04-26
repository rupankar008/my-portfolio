"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";

export default function Web3Tip() {
  const [status, setStatus] = useState<"idle" | "connecting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleTip = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setMessage("MetaMask or Web3 wallet not found!");
      setStatus("error");
      return;
    }

    try {
      setStatus("connecting");
      setMessage("Connecting wallet...");
      
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      setMessage("Please confirm transaction...");
      
      // We are sending a 0.005 ETH tip as an example
      const tx = await signer.sendTransaction({
        to: "0x0000000000000000000000000000000000000000", // Using a zero address to prevent actual loss of funds since this is a demo, or we could just use a dummy address
        value: ethers.parseEther("0.005")
      });

      setMessage("Transaction sent! " + tx.hash.substring(0, 10) + "...");
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message?.substring(0, 40) || "Transaction failed");
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-12 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTip}
        disabled={status === "connecting"}
        className="px-8 py-3 rounded-full border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-mono text-sm tracking-widest uppercase transition-all flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/></svg>
        Send Crypto Tip
      </motion.button>
      
      {message && (
        <div className={`text-[10px] font-mono tracking-widest ${status === "error" ? "text-red-400" : "text-green-400"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
