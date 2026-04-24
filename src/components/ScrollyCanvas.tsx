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
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const indicatorOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    // Load first frame ASAP
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      setFirstFrameLoaded(true);
      drawImage(0);
    };
    
    // Load the rest
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = i === 0 ? firstImg : new Image();
      if (i !== 0) img.src = getFrameUrl(i);
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) setAllLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Responsive scaling: "contain" on very narrow mobile, "cover" on desktop
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let x = 0;
    let y = 0;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile logic: Center and make sure it fits
      if (canvasRatio > imgRatio) {
        renderHeight = canvas.height;
        renderWidth = canvas.height * imgRatio;
        x = (canvas.width - renderWidth) / 2;
      } else {
        renderWidth = canvas.width;
        renderHeight = canvas.width / imgRatio;
        y = (canvas.height - renderHeight) / 2;
      }
    } else {
      // Desktop logic: Cover the screen
      if (canvasRatio > imgRatio) {
        renderHeight = canvas.width / imgRatio;
        y = (canvas.height - renderHeight) / 2;
      } else {
        renderWidth = canvas.height * imgRatio;
        x = (canvas.width - renderWidth) / 2;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, renderWidth, renderHeight);
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
  }, [allLoaded, progress]);

  useMotionValueEvent(progress, "change", (latest) => {
    const frameIndex = Math.floor(latest * (FRAME_COUNT - 1));
    drawImage(Math.min(frameIndex, FRAME_COUNT - 1));
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {firstFrameLoaded && (
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

      {!firstFrameLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-[99] bg-[#050505]">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
             <p className="text-white tracking-[0.3em] text-xs font-bold">PREPARING EXPERIENCE</p>
          </div>
        </div>
      )}
    </>
  );
}
