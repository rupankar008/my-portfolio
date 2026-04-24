"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const marketData: Record<string, number[]> = {
  BTC: [45, 52, 49, 60, 58, 65, 62, 70, 68, 75],
  ETH: [30, 35, 32, 40, 38, 45, 42, 50, 48, 55],
  LTC: [20, 25, 22, 30, 28, 35, 32, 40, 38, 45],
  NIFTY: [50, 55, 53, 60, 58, 65, 62, 70, 68, 75],
  SENSEX: [55, 60, 58, 65, 62, 70, 68, 75, 72, 80],
  USDT: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
};

export default function MarketChart() {
  const [activeAsset, setActiveAsset] = useState("BTC");
  const data = marketData[activeAsset];

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.keys(marketData).map((asset) => (
          <button
            key={asset}
            onClick={() => setActiveAsset(asset)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
              activeAsset === asset 
                ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {asset}
          </button>
        ))}
      </div>

      <div className="relative h-40 w-full flex items-end gap-1">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <motion.path
            key={activeAsset}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d={`M ${data.map((val, i) => `${i * 11},${40 - val / 2}`).join(" L ")}`}
            fill="none"
            stroke="url(#chart-grad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="chart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glowing Dots */}
        {data.map((val, i) => (
          <motion.div
            key={`${activeAsset}-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_#3B82F6]"
            style={{ 
              left: `${i * 11}%`, 
              bottom: `${val / 2}%`,
              transform: "translate(-50%, 50%)"
            }}
          />
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Market_Volatility: Low</span>
        <span className="text-xl font-mono font-bold text-blue-400 tracking-tighter italic">LIVE_FEED</span>
      </div>
    </div>
  );
}
