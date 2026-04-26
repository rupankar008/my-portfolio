"use client";

import { useScroll } from "framer-motion";
import { useState, useCallback } from "react";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import SkillGraph from "@/components/SkillGraph";
import Projects from "@/components/Projects";
import StatsCounter from "@/components/StatsCounter";
import BootLoader from "@/components/BootLoader";

import GlobeTracker from "@/components/GlobeTracker";
import LiveCryptoChart from "@/components/LiveCryptoChart";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => setBooted(true), []);

  return (
    <main className="relative bg-[#050505]">
      {/* Boot Sequence — only on first visit */}
      {!booted && <BootLoader onComplete={handleBootComplete} />}

      {/* Cinematic Background */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollyCanvas progress={scrollYProgress} />
      </div>

      {/* Main Content */}
      <Overlay />

      <div className="relative z-10 bg-[#050505]">
        <StatsCounter />
        
        {/* Live Dashboards */}
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-8 justify-center">
          <LiveCryptoChart />
          <GlobeTracker />
        </section>

        <SkillGraph />
        <Projects />
      </div>
    </main>
  );
}
