"use client";

import { useScroll } from "framer-motion";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative bg-[#050505]">
      {/* Cinematic Background */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollyCanvas progress={scrollYProgress} />
      </div>

      {/* Main Content Sections */}
      <Overlay />
      
      <div className="relative z-10 bg-[#050505]">
        <Projects />
      </div>
    </main>
  );
}
