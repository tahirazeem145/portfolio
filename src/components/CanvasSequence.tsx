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

  // Preload and decode images asynchronously off the main thread
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    const handleSingleLoaded = () => {
      count++;
      setImagesLoaded(count);
      if (count >= FRAME_COUNT) {
        setIsReady(true);
      }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.png`;

      let resolved = false;
      const onDone = () => {
        if (resolved) return;
        resolved = true;
        handleSingleLoaded();
      };

      img.onload = onDone;
      img.onerror = onDone;
      if (typeof img.decode === "function") {
        img.decode().then(onDone).catch(onDone);
      }

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

      const playhead = { frame: 0 };
      let lastDrawnFrame = -1;
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
        const x = (canvas.width - img.width * scale) * 0.5;
        const y = (canvas.height - img.height * scale) * 0.5;

        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      // Set initial canvas size correctly with balanced DPR for optimal 60fps render
      const resizeCanvas = () => {
        if (!canvas || !context) return;
        const { width, height } = canvas.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        // Configure smoothing once on resize, not on every frame
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "medium";

        renderFrame(Math.round(playhead.frame));
      };

      // Initial size and initial render
      resizeCanvas();
      renderFrame(0);

      // Dedicated GSAP tween on playhead object with responsive scrub interpolation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=350%", // 3.5 screens of scrolling for swift, fluid sequence
          pin: true,
          scrub: 0.35, // Responsive scrub that actively interpolates playhead on every RAF tick
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      tl.to(playhead, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        duration: 1,
        onUpdate: () => {
          const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(playhead.frame))
          );
          if (frameIndex !== lastDrawnFrame) {
            lastDrawnFrame = frameIndex;
            renderFrame(frameIndex);
          }
        },
      });

      // Explicitly sort and refresh ScrollTrigger
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Handle resize using ScrollTrigger's refresh for better sync
      ScrollTrigger.addEventListener("refresh", resizeCanvas);
      window.addEventListener("resize", resizeCanvas);

      return () => {
        tl.kill();
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
