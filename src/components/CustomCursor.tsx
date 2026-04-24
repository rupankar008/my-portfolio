"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouse = {
    x: useSpring(0, { damping: 20, stiffness: 250, mass: 0.5 }),
    y: useSpring(0, { damping: 20, stiffness: 250, mass: 0.5 }),
  };

  const ringSize = isHovering ? 60 : 30;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        mouse.x.set(e.clientX);
        mouse.y.set(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Return nothing if on mobile or touch device
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Outer Ring */}
      <motion.div
        style={{
          x: mouse.x,
          y: mouse.y,
          translateX: "-50%",
          translateY: "-50%",
          width: ringSize,
          height: ringSize,
        }}
        className="border border-white/50 rounded-full flex items-center justify-center transition-[width,height] duration-300"
      >
        {/* Inner Dot */}
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>
    </div>
  );
}
