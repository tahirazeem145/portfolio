"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  progress: number;
  isLoaded: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ progress, isLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      const tl = gsap.timeline();
      
      tl.to(textRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.in"
      })
      .to(barRef.current, {
        scaleX: 1.1,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in"
      }, "-=0.4")
      .to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "expo.inOut"
      }, "-=0.2")
      .set(containerRef.current, { display: "none" });
    }
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Text */}
        <div 
          ref={textRef}
          className="mb-12 overflow-hidden"
        >
          <div className="text-sm md:text-base font-bold tracking-[0.4em] uppercase text-gray-400 mb-2 text-center animate-shimmer bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-[length:200%_auto] bg-clip-text text-transparent">
            Initializing Experience
          </div>
          <div className="text-4xl md:text-6xl font-black tracking-tighter text-white text-center">
            TAHIR <span className="text-blue-500">AZEEM</span>
          </div>
        </div>

        {/* Progress Container */}
        <div 
          ref={barRef}
          className="w-72 md:w-96 flex flex-col items-center"
        >
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            {/* Glow Effect */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 box-glow-strong transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Percentage */}
          <div className="mt-6 flex items-baseline gap-2 font-mono">
            <span className="text-5xl md:text-7xl font-black text-white leading-none">
              {Math.round(progress)}
            </span>
            <span className="text-xl md:text-2xl font-bold text-blue-500">%</span>
          </div>
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="w-12 h-[1px] bg-white/10" />
          <div className="w-8 h-[1px] bg-white/10" />
          <div className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
            System.v4.0.1
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
            Asset Rendering Engine
          </div>
          <div className="w-12 h-[1px] bg-white/10" />
          <div className="w-20 h-[1px] bg-white/10" />
        </div>
      </div>

      <style jsx>{`
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        .box-glow-strong {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Preloader;
