"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music, Zap, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

// REPLACE THIS WITH YOUR ACTUAL DISCORD ID TO ENABLE LIVE DATA
// You can get it from Discord Settings -> Advanced -> Developer Mode -> Right click your profile -> Copy ID
const DISCORD_ID = "1354578415990210832"; 

interface SpotifyData {
  isPlaying: boolean;
  song: string;
  artist: string;
  albumArt: string;
}

export default function ActivityFeed() {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [systemStatus, setSystemStatus] = useState("Initializing...");

  const [apiStatus, setApiStatus] = useState<string>("Offline");

  useEffect(() => {
    // 1. System Status Rotation
    const statuses = ["Compiling Node...", "Analyzing Market Data", "Pushing to Main", "Neural Link Active", "Optimizing UI"];
    const statusTimer = setInterval(() => {
      setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 5000);

    // 2. Local Spotify API Fetching
    const fetchPresence = async () => {
      try {
        const res = await fetch(`/api/spotify`);
        const data = await res.json();
        
        setApiStatus(data.status || (res.ok ? "Synced" : `Error ${res.status}`));

        if (data.isPlaying) {
          setSpotify({
            isPlaying: true,
            song: data.title,
            artist: data.artist,
            albumArt: data.albumImageUrl
          });
        } else {
          setSpotify(null); // Not listening
        }
      } catch (e: any) {
        setApiStatus("API Call Failed");
        console.error("Spotify API Error:", e);
      }
    };

    fetchPresence();
    const spotifyTimer = setInterval(fetchPresence, 10000); // Poll every 10s

    return () => {
      clearInterval(statusTimer);
      clearInterval(spotifyTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-32 left-6 md:left-8 z-[80] hidden lg:block">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4"
      >
        {/* System Status - Kept as requested in previous turn or can be removed if strictly "only spotify" */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-3 rounded-2xl group hover:border-blue-500/30 transition-all">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Zap size={14} className="text-blue-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">System Status</p>
            <p className="text-[10px] text-white/70 font-mono">{systemStatus}</p>
          </div>
        </div>

        {/* Spotify Section */}
        <AnimatePresence mode="wait">
          {spotify ? (
            <motion.div
              key="spotify-playing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-green-500/20 p-3 rounded-2xl group hover:border-green-500/40 transition-all max-w-[280px]"
            >
              <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg">
                 <img src={spotify.albumArt} alt="Album Art" className="w-full h-full object-cover animate-spin-slow" style={{ animationDuration: '15s' }} />
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Music size={16} className="text-white animate-pulse" />
                 </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5 items-end h-2">
                     <motion.div animate={{ height: [2, 8, 4, 10, 2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-green-500" />
                     <motion.div animate={{ height: [4, 2, 10, 6, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-green-500" />
                     <motion.div animate={{ height: [8, 4, 2, 8, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-green-500" />
                  </div>
                  <p className="text-[8px] uppercase tracking-widest text-green-500 font-bold">Currently Listening</p>
                </div>
                <h4 className="text-[11px] font-bold text-white truncate w-full">{spotify.song}</h4>
                <p className="text-[9px] text-white/40 truncate w-full">{spotify.artist}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="spotify-idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-3 rounded-2xl group hover:border-blue-500/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-all">
                <Music size={16} className="text-white/20 group-hover:text-blue-400 transition-all" />
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Spotify Status</p>
                <p className="text-[10px] text-white/60 font-mono italic">Dev Status: {apiStatus}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
