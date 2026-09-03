"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Preloader from "@/components/ui/preloader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const FRAME_COUNT = 108;

const CanvasSequence = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.png`;
      img.onload = () => {
        count++;
        setImagesLoaded(count);
        if (count >= FRAME_COUNT) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        count++;
        setImagesLoaded(count);
        if (count >= FRAME_COUNT) {
          setIsReady(true);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    // Safety fallback: ensure ready within 2.3s so it syncs seamlessly with the 3s loader
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      if (!isReady || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false }); // Optimization
      if (!context) return;

      const animationState = { frame: 0 };
      const images = imagesRef.current;

      function renderFrame(index: number) {
        if (!canvas || !context) return;

        // Try exact frame, or fallback to closest loaded frame
        let img = images[index];
        if (!img || !img.complete || img.naturalWidth === 0) {
          // Search backwards
          for (let i = index - 1; i >= 0; i--) {
            if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
              img = images[i];
              break;
            }
          }
          // Search forwards if still not found
          if (!img || !img.complete || img.naturalWidth === 0) {
            for (let i = index + 1; i < FRAME_COUNT; i++) {
              if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
                img = images[i];
                break;
              }
            }
          }
        }

        if (!img || !img.complete || img.naturalWidth === 0) return;

        // Draw image keeping aspect ratio (cover style)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      // Set initial canvas size correctly
      const resizeCanvas = () => {
        if (!canvas) return;
        const { width, height } = canvas.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        renderFrame(animationState.frame);
      };

      // Initial size and initial render
      resizeCanvas();
      renderFrame(0);

      // Set up ScrollTrigger
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // 4 screens of scrolling
        pin: true,
        scrub: 2, 
        anticipatePin: 1,
        onUpdate: (self) => {
          const newFrame = Math.min(
            FRAME_COUNT - 1,
            Math.floor(self.progress * FRAME_COUNT)
          );
          if (newFrame !== animationState.frame) {
            animationState.frame = newFrame;
            renderFrame(newFrame);
          }
        }
      });

      // Explicitly sort and refresh ScrollTrigger
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Handle resize using ScrollTrigger's refresh for better sync
      ScrollTrigger.addEventListener("refresh", resizeCanvas);
      window.addEventListener("resize", resizeCanvas);

      return () => {
        st.kill();
        ScrollTrigger.removeEventListener("refresh", resizeCanvas);
        window.removeEventListener("resize", resizeCanvas);
      };
    },
    { dependencies: [isReady], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <Preloader 
        progress={(imagesLoaded / FRAME_COUNT) * 100} 
        isLoaded={imagesLoaded === FRAME_COUNT} 
        duration={3}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />

      {/* Optional: Overlay Text/UI that could fade in during scroll */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center z-10 text-white">
        <h1 className="text-3xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mix-blend-difference opacity-50 text-center px-4">
          TAHIR AZEEM
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl font-light tracking-wide mix-blend-difference opacity-70 text-center">
          Scroll to explore
        </p>
      </div>
    </div>
  );
};

export default CanvasSequence;
