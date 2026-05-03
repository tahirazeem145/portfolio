"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const FRAME_COUNT = 108;

const CanvasSequence = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.png`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useGSAP(
    () => {
      if (imagesLoaded < FRAME_COUNT || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false }); // Optimization
      if (!context) return;

      const animationState = { frame: 0 };

      // Set initial canvas size correctly
      const resizeCanvas = () => {
        if (!canvas) return;
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        renderFrame(animationState.frame);
      };

      // Initial size
      resizeCanvas();

      // Set up ScrollTrigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // 4 screens of scrolling
        pin: true,
        scrub: 1, // Increased scrub for smoother "luxurious" feel
        onUpdate: (self) => {
          // Calculate frame based on progress to be more precise
          const newFrame = Math.floor(self.progress * (FRAME_COUNT - 1));
          if (newFrame !== animationState.frame) {
            animationState.frame = newFrame;
            renderFrame(newFrame);
          }
        }
      });

      function renderFrame(index: number) {
        if (!canvas || !context || !images[index]) return;

        const img = images[index];

        // Draw image keeping aspect ratio (cover style)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      // Handle resize using ScrollTrigger's refresh for better sync
      ScrollTrigger.addEventListener("refresh", resizeCanvas);
      window.addEventListener("resize", resizeCanvas);

      return () => {
        ScrollTrigger.removeEventListener("refresh", resizeCanvas);
        window.removeEventListener("resize", resizeCanvas);
      };
    },
    { dependencies: [imagesLoaded], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      {/* Loading State Overlay */}
      {imagesLoaded < FRAME_COUNT && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white flex-col">
          <div className="text-2xl font-bold mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
            LOADING ASSETS
          </div>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(imagesLoaded / FRAME_COUNT) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {Math.round((imagesLoaded / FRAME_COUNT) * 100)}%
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />

      {/* Optional: Overlay Text/UI that could fade in during scroll */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center z-10 text-white">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mix-blend-difference opacity-50 text-center px-4">
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
