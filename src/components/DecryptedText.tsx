"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>[]{}";

export default function DecryptedText({ 
  text, 
  className = "", 
  speed = 40,
  maxIterations = 15,
  sequential = true,
  delay = 0
}: { 
  text: string, 
  className?: string,
  speed?: number,
  maxIterations?: number,
  sequential?: boolean,
  delay?: number
}) {
  const [displayText, setDisplayText] = useState(
    text.replace(/[a-zA-Z0-9]/g, () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)])
  );
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;

    let timeoutId: NodeJS.Timeout;
    
    timeoutId = setTimeout(() => {
      let iteration = 0;
      let interval: NodeJS.Timeout;

      if (sequential) {
        interval = setInterval(() => {
          setDisplayText((prev) => {
            return text.split("").map((char, index) => {
              if (char === " " || char === "\n") return char;
              if (index < iteration) {
                return text[index];
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            }).join("");
          });

          if (iteration >= text.length) {
            clearInterval(interval);
          }
          
          iteration += 1 / 3; // Reveal 1 char every 3 ticks
        }, speed);
      } else {
        interval = setInterval(() => {
          setDisplayText((prev) => {
            return text.split("").map((char, index) => {
              if (char === " " || char === "\n") return char;
              if (iteration >= maxIterations) {
                return text[index];
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            }).join("");
          });

          if (iteration >= maxIterations) {
            clearInterval(interval);
          }
          
          iteration += 1;
        }, speed);
      }

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isInView, text, speed, maxIterations, sequential, delay]);

  return (
    <motion.span ref={ref} className={className}>
      {displayText}
    </motion.span>
  );
}
