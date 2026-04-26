"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NeuralAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "Mu4HjogS5fg",
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: 20,
          loop: 1,
          playlist: "Mu4HjogS5fg",
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(40);
          },
        },
      });
    };

    const handleAutoStart = () => {
      if (playerRef.current) {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setHasInteracted(true);
      }
    };

    window.addEventListener("neural_audio_start", handleAutoStart);
    return () => window.removeEventListener("neural_audio_start", handleAutoStart);
  }, []);

  const togglePlayback = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      setHasInteracted(true);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 md:bottom-8 left-6 md:left-8 z-[100]">
      <div id="youtube-player" className="hidden" />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlayback}
        className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border backdrop-blur-xl transition-all duration-500 ${
          isPlaying 
            ? "bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
            : "bg-black/40 border-white/10 text-white/40 hover:border-white/30"
        }`}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Volume2 size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Music size={20} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neural Waveform Visualizer (Only when playing) */}
        {isPlaying && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 items-end h-6 pointer-events-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{
                  height: [4, 16, 8, 20, 4],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 bg-blue-400/60 rounded-full"
              />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
}
