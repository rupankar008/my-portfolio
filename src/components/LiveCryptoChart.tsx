"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function LiveCryptoChart() {
  const [price, setPrice] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [status, setStatus] = useState<"up" | "down" | "flat">("flat");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const currentPrice = parseFloat(data.p);
      
      setPrice((prev) => {
        if (prev !== null) {
          setStatus(currentPrice > prev ? "up" : currentPrice < prev ? "down" : "flat");
        }
        return currentPrice;
      });

      setHistory((prev) => {
        const newHistory = [...prev, currentPrice];
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
      });
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minPrice = Math.min(...history) * 0.9999;
    const maxPrice = Math.max(...history) * 1.0001;
    const range = maxPrice - minPrice;

    // Draw Fake Analysis Indicators
    if (showAnalysis) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.3);
      ctx.lineTo(canvas.width, canvas.height * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.lineTo(canvas.width, canvas.height * 0.7);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Moving Average (Fake)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(96, 165, 250, 0.3)";
      ctx.lineWidth = 1;
      history.forEach((p, i) => {
        const x = (i / (history.length - 1)) * canvas.width;
        const y = canvas.height - ((p - minPrice) / range) * canvas.height + 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = status === "up" ? "#4ade80" : status === "down" ? "#f87171" : "#60a5fa";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    history.forEach((p, i) => {
      const x = (i / (history.length - 1)) * canvas.width;
      const y = canvas.height - ((p - minPrice) / range) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, status === "up" ? "rgba(74, 222, 128, 0.2)" : status === "down" ? "rgba(248, 113, 113, 0.2)" : "rgba(96, 165, 250, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [history, status, showAnalysis]);

  return (
    <div className="relative w-full max-w-sm mx-auto h-[400px] border border-white/5 rounded-3xl bg-white/[0.02] overflow-hidden flex flex-col p-6 group">
      <div className="flex justify-between items-start z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-mono">LIVE MARKET</h3>
            <button 
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`text-[8px] px-1.5 py-0.5 rounded border transition-all ${showAnalysis ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/10 text-white/30"}`}
            >
              {showAnalysis ? "ANALYSIS: ON" : "ANALYSIS: OFF"}
            </button>
          </div>
          <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            BTC/USDT
          </h2>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-mono font-bold drop-shadow-md ${status === "up" ? "text-green-400" : status === "down" ? "text-red-400" : "text-white"}`}>
            {price ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "LOADING..."}
          </p>
          <p className="text-[10px] text-white/30 font-mono mt-1 animate-pulse uppercase tracking-tighter">Real-time Stream</p>
        </div>
      </div>

      <div className="flex-1 mt-8 relative">
        {showAnalysis && (
          <div className="absolute top-0 right-0 text-[8px] font-mono text-white/20 flex flex-col items-end gap-1 pointer-events-none">
            <span>RSI: 64.2</span>
            <span>MACD: +0.12</span>
            <span>VOL: 2.4k</span>
          </div>
        )}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={400} height={200} />
      </div>
    </div>
  );
}
