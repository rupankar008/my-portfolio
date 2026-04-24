"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, MotionValue, motion, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FRAME_COUNT = 120; // 0 to 119
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Fade out the scroll indicator quickly as soon as the user starts scrolling
  const indicatorOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImagesLoaded(true);
        }
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
    if (!img) return;

    // Object-fit: cover logic
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let x = 0;
    let y = 0;

    if (canvasRatio > imgRatio) {
      renderHeight = canvas.width / imgRatio;
      y = (canvas.height - renderHeight) / 2;
    } else {
      renderWidth = canvas.height * imgRatio;
      x = (canvas.width - renderWidth) / 2;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw original image background color behind the image, but only where the image is drawn
    // This combined with the CSS radial mask on the canvas itself makes it feather into #050505 perfectly
    ctx.fillStyle = "#757B84";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image with scaling
    ctx.drawImage(img, x, y, renderWidth, renderHeight);
  };

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Redraw current frame
        if (imagesLoaded) {
          const currentProgress = progress.get();
          let frameIndex = Math.floor(currentProgress * (FRAME_COUNT - 1));
          frameIndex = Math.max(0, Math.min(frameIndex, FRAME_COUNT - 1));
          drawImage(frameIndex); 
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, progress]);

  // Initial render when loaded
  useEffect(() => {
    if (imagesLoaded) {
      drawImage(0);
    }
  }, [imagesLoaded]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (!imagesLoaded) return;
    let frameIndex = Math.floor(latest * (FRAME_COUNT - 1));
    frameIndex = Math.max(0, Math.min(frameIndex, FRAME_COUNT - 1));
    drawImage(frameIndex);
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mask-radial-faded"
      />
      
      {/* Scroll Indicator */}
      {imagesLoaded && (
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
        >
          <span className="text-white/80 text-sm tracking-widest uppercase mb-2 font-medium drop-shadow-md">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="text-white drop-shadow-lg" size={24} />
          </motion.div>
        </motion.div>
      )}

      {/* Loading State overlay */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#050505]">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white text-lg tracking-widest font-light"
          >
            LOADING EXPERIENCE...
          </motion.div>
        </div>
      )}
    </>
  );
}
