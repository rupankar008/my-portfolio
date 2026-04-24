"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import Navbar from "@/components/Navbar";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="bg-[#050505] min-h-screen">
      <Navbar />
      
      {/* 
        The Scrollytelling Section
        Height is 500vh to give plenty of room to scroll through 120 frames.
      */}
      <div ref={containerRef} className="relative w-full" style={{ height: "500vh", position: "relative" }}>
        {/* Sticky container that stays on screen while we scroll through the 500vh parent */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* Canvas renders the images */}
          <ScrollyCanvas progress={scrollYProgress} />
          
          {/* Overlay renders the text blocks */}
          <Overlay progress={scrollYProgress} />
          
        </div>
      </div>

      {/* Projects Grid below the scroll animation */}
      <Projects />
    </main>
  );
}
