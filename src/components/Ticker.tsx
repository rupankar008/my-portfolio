"use client";

import { motion } from "framer-motion";

const tickerData = [
  { label: "BTC/USDT", value: "64,231.50", change: "+2.4%", color: "text-green-400" },
  { label: "ETH/USDT", value: "3,412.10", change: "-0.8%", color: "text-red-400" },
  { label: "NIFTY 50", value: "22,514.00", change: "+1.2%", color: "text-green-400" },
  { label: "SENSEX", value: "74,248.00", change: "+0.9%", color: "text-green-400" },
  { label: "SOL/USDT", value: "145.20", change: "+5.1%", color: "text-green-400" },
];

export default function Ticker() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-md border-b border-white/5 py-1.5 overflow-hidden">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12"
      >
        {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-[10px] font-mono tracking-tighter uppercase">
            <span className="text-white/40">{item.label}</span>
            <span className="text-white font-bold">{item.value}</span>
            <span className={item.color}>{item.change}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
