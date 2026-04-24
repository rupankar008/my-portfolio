"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TickerItem {
  label: string;
  value: string;
  change: string;
  color: string;
}

export default function Ticker() {
  const [prices, setPrices] = useState<TickerItem[]>([
    { label: "BTC/USDT", value: "Loading...", change: "0%", color: "text-white/40" },
    { label: "ETH/USDT", value: "Loading...", change: "0%", color: "text-white/40" },
    { label: "SOL/USDT", value: "Loading...", change: "0%", color: "text-white/40" },
    { label: "NIFTY 50", value: "22,514.00", change: "+1.2%", color: "text-green-400" },
    { label: "SENSEX", value: "74,248.00", change: "+0.9%", color: "text-green-400" },
  ]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true");
        const data = await response.json();
        
        setPrices([
          { 
            label: "BTC/USDT", 
            value: `$${data.bitcoin.usd.toLocaleString()}`, 
            change: `${data.bitcoin.usd_24h_change.toFixed(2)}%`, 
            color: data.bitcoin.usd_24h_change >= 0 ? "text-green-400" : "text-red-400" 
          },
          { 
            label: "ETH/USDT", 
            value: `$${data.ethereum.usd.toLocaleString()}`, 
            change: `${data.ethereum.usd_24h_change.toFixed(2)}%`, 
            color: data.ethereum.usd_24h_change >= 0 ? "text-green-400" : "text-red-400" 
          },
          { 
            label: "SOL/USDT", 
            value: `$${data.solana.usd.toLocaleString()}`, 
            change: `${data.solana.usd_24h_change.toFixed(2)}%`, 
            color: data.solana.usd_24h_change >= 0 ? "text-green-400" : "text-red-400" 
          },
          { label: "NIFTY 50", value: "22,514.00", change: "+1.2%", color: "text-green-400" },
          { label: "SENSEX", value: "74,248.00", change: "+0.9%", color: "text-green-400" },
        ]);
      } catch (error) {
        console.error("Failed to fetch prices");
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/5 py-2 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <motion.div 
        animate={{ x: [0, -1200] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-16"
      >
        {[...prices, ...prices, ...prices].map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-[11px] font-mono tracking-tighter uppercase">
            <span className="text-white/30 font-bold">{item.label}</span>
            <span className="text-white tabular-nums">{item.value}</span>
            <span className={`${item.color} font-bold`}>{item.change}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
