"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, MotionValue, motion, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FRAME_COUNT = 120;
const FRAME_PREFIX = "frame_";
const FRAME_SUFFIX = "_delay-0.066s.png";

function getFrameUrl(index: number) {
  const paddedIndex = index.toString().padStart(3, "0");
  return `/sequence/${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
}

interface ScrollyCanvasProps {
  progress: MotionValue<number>;
}

export default function ScrollyCanvas({ progress }: ScrollyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  const indicatorOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    // Load the first frame immediately to unblock the UI
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      setReady(true);
      drawImage(0);

      // Load the rest sequentially to prevent mobile network/memory freeze
      let currentIndex = 1;
      const loadNext = () => {
        if (currentIndex >= FRAME_COUNT) return;
        const img = new Image();
        img.src = getFrameUrl(currentIndex);
        img.onload = () => {
          images[currentIndex] = img;
          currentIndex++;
          loadNext();
        };
        img.onerror = () => {
          currentIndex++;
          loadNext();
        };
      };
      loadNext();
    };
  }, []);

  const drawImage = (index: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: false });
      if (!canvas || !ctx) return;

      let img = imagesRef.current[index];
      if (!img || !img.complete) {
        for (let offset = 1; offset < 20; offset++) {
          const prev = imagesRef.current[index - offset];
          if (prev && prev.complete) { img = prev; break; }
          const next = imagesRef.current[index + offset];
          if (next && next.complete) { img = next; break; }
        }
      }

      if (!img || !img.complete) return;

      // ORIGINAL CINEMATIC "COVER" LOGIC
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let renderWidth = canvas.width, renderHeight = canvas.height, x = 0, y = 0;

      if (canvasRatio > imgRatio) {
        renderHeight = canvas.width / imgRatio;
        y = (canvas.height - renderHeight) / 2;
      } else {
        renderWidth = canvas.height * imgRatio;
        x = (canvas.width - renderWidth) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, renderWidth, renderHeight);
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawImage(Math.floor(progress.get() * (FRAME_COUNT - 1)));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [ready, progress]);

  useMotionValueEvent(progress, "change", (latest) => {
    const frameIndex = Math.floor(latest * (FRAME_COUNT - 1));
    drawImage(Math.min(frameIndex, FRAME_COUNT - 1));
    
    // Add audio system pitch update based on scroll velocity
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      import('@/lib/AudioSystem').then(({ audioSystem }) => {
        // Calculate a rough velocity based on the change in progress (latest - previous would be better, but latest works as a proxy for frequency mapping if needed)
        audioSystem.updateAmbientPitch(latest * 10);
      });
    }
  });

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none object-cover" />
      
      {ready && (
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
        >
          <span className="text-white/80 text-sm tracking-widest uppercase mb-2 font-medium">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="text-white" size={24} />
          </motion.div>
        </motion.div>
      )}

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-[99] bg-[#050505]">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}
    </>
  );
}
