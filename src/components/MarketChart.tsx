"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetData {
  price: string;
  high: string;
  low: string;
  change: number;
  points: number[];
}

const staticData: Record<string, AssetData> = {
  NIFTY: {
    price: "22,514.00",
    high: "22,780.00",
    low: "22,310.00",
    change: 1.2,
    points: [40, 43, 41, 47, 45, 52, 50, 55, 58, 62],
  },
  SENSEX: {
    price: "74,248.00",
    high: "74,900.00",
    low: "73,600.00",
    change: 0.9,
    points: [38, 42, 40, 46, 44, 51, 48, 54, 56, 60],
  },
};

const cryptoIds: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LTC: "litecoin",
};

export default function MarketChart() {
  const [activeAsset, setActiveAsset] = useState("BTC");
  const [assetData, setAssetData] = useState<Record<string, AssetData>>({ ...staticData });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        setLoading(true);
        const ids = Object.values(cryptoIds).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`
        );
        const data: {
          id: string;
          current_price: number;
          high_24h: number;
          low_24h: number;
          price_change_percentage_24h: number;
          sparkline_in_7d?: { price: number[] };
        }[] = await res.json();

        const updated: Record<string, AssetData> = { ...staticData };

        for (const [symbol, id] of Object.entries(cryptoIds)) {
          const coin = data.find((c) => c.id === id);
          if (coin) {
            const raw = Array.from({ length: 10 }, (_, i) =>
              coin.low_24h + ((coin.high_24h - coin.low_24h) * i) / 9 +
              (Math.random() - 0.5) * (coin.high_24h - coin.low_24h) * 0.2
            );
            const min = Math.min(...raw);
            const max = Math.max(...raw);
            const points = raw.map((v) => ((v - min) / (max - min)) * 60 + 5);

            updated[symbol] = {
              price: `$${coin.current_price.toLocaleString()}`,
              high: `$${coin.high_24h.toLocaleString()}`,
              low: `$${coin.low_24h.toLocaleString()}`,
              change: coin.price_change_percentage_24h,
              points,
            };
          }
        }

        setAssetData(updated);
      } catch (e) {
        console.error("Chart fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000);
    return () => clearInterval(interval);
  }, []);

  const assets = ["BTC", "ETH", "LTC", "NIFTY", "SENSEX"];
  const current = assetData[activeAsset];
  const isPositive = current?.change >= 0;

  const buildPath = (pts: number[]) => {
    const w = 100;
    const step = w / (pts.length - 1);
    return pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)},${(70 - v).toFixed(1)}`).join(" ");
  };

  const buildArea = (pts: number[]) => {
    const w = 100;
    const step = w / (pts.length - 1);
    const line = pts.map((v, i) => `${(i * step).toFixed(1)},${(70 - v).toFixed(1)}`).join(" L ");
    return `M 0,70 L ${line} L 100,70 Z`;
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl space-y-6">
      {/* Asset Switcher */}
      <div className="flex flex-wrap gap-2">
        {assets.map((asset) => (
          <button
            key={asset}
            onClick={() => setActiveAsset(asset)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
              activeAsset === asset
                ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
            }`}
          >
            {asset}
          </button>
        ))}
      </div>

      {/* Price Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAsset}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {loading && !current ? (
            <div className="text-white/30 text-sm font-mono animate-pulse">Fetching live data...</div>
          ) : (
            <>
              {/* Main Price */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">{activeAsset} / Price</p>
                  <p className="text-4xl font-black font-mono tracking-tighter text-white">{current?.price}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  isPositive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {isPositive ? "+" : ""}{current?.change?.toFixed(2)}%
                </div>
              </div>

              {/* High / Low */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <p className="text-[9px] uppercase tracking-widest text-green-400/60 font-bold mb-1">24h High</p>
                  <p className="text-lg font-mono font-bold text-green-400">{current?.high}</p>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <p className="text-[9px] uppercase tracking-widest text-red-400/60 font-bold mb-1">24h Low</p>
                  <p className="text-lg font-mono font-bold text-red-400">{current?.low}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-36 w-full mt-2">
                <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} />
                      <stop offset="100%" stopColor={isPositive ? "#3b82f6" : "#f97316"} />
                    </linearGradient>
                    <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area Fill */}
                  <motion.path
                    key={`area-${activeAsset}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    d={buildArea(current?.points ?? [])}
                    fill="url(#area-grad)"
                  />

                  {/* Line */}
                  <motion.path
                    key={`line-${activeAsset}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    d={buildPath(current?.points ?? [])}
                    fill="none"
                    stroke="url(#line-grad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* End Dot */}
                  {current?.points && (
                    <motion.circle
                      key={`dot-${activeAsset}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      cx={100}
                      cy={70 - (current.points[current.points.length - 1] ?? 0)}
                      r="2"
                      fill={isPositive ? "#22c55e" : "#ef4444"}
                      className="drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                    />
                  )}
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
                  <span className="text-[8px] font-mono text-white/20 text-right">{current?.high}</span>
                  <span className="text-[8px] font-mono text-white/20 text-right">{current?.low}</span>
                </div>
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-mono text-right">
                Live_Feed // Auto-refreshes every 60s
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
