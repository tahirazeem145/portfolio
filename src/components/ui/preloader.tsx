import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

interface PreloaderProps {
  progress: number;
  isLoaded: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ progress, isLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  
  const [visualProgress, setVisualProgress] = useState(0);
  const [canExit, setCanExit] = useState(false);

  // Slow visual progress logic (approx 11 seconds)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 11000; // 11 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      
      setVisualProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Sync visual progress with real progress
  // We can only exit when both visual progress is 100% and assets are loaded
  useEffect(() => {
    if (visualProgress >= 100 && isLoaded) {
      setCanExit(true);
    }
  }, [visualProgress, isLoaded]);

  useEffect(() => {
    if (canExit && containerRef.current) {
      const tl = gsap.timeline();
      
      tl.to([textRef.current, imgRef.current], {
        y: -30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.in"
      })
      .to(barRef.current, {
        scaleX: 1.2,
        opacity: 0,
        duration: 0.8,
        ease: "power4.in"
      }, "-=0.6")
      .to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.5,
        ease: "expo.inOut"
      }, "-=0.4")
      .set(containerRef.current, { display: "none" });
    }
  }, [canExit]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
        {/* Cyber Portrait */}
        <div 
          ref={imgRef}
          className="relative w-40 h-40 md:w-56 md:h-56 mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] group animate-blink"
        >
          <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10" />
          <Image 
            src="/img/cyber_portrait.png" 
            alt="Cyber Portrait" 
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.8)] z-20 animate-scan" />
        </div>

        {/* Animated Text */}
        <div 
          ref={textRef}
          className="mb-12 w-full"
        >
          <div className="text-xs md:text-sm font-bold tracking-[0.5em] uppercase text-blue-400/80 mb-3 text-center animate-pulse">
            System Synchronizing
          </div>
          <div className="text-4xl md:text-6xl font-black tracking-tighter text-white text-center leading-none">
            TAHIR <span className="text-blue-500">AZEEM</span>
          </div>
          <div className="mt-4 text-[10px] md:text-xs font-mono text-gray-500 tracking-widest uppercase text-center opacity-60">
            Establishing Neural Link...
          </div>
        </div>

        {/* Progress Container */}
        <div 
          ref={barRef}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden relative">
            {/* Glow Effect */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 box-glow-strong transition-all duration-300 ease-out"
              style={{ width: `${visualProgress}%` }}
            />
          </div>
          
          {/* Percentage */}
          <div className="mt-8 flex items-baseline gap-2 font-mono">
            <span className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
              {Math.round(visualProgress)}
            </span>
            <span className="text-2xl md:text-3xl font-bold text-blue-500">%</span>
          </div>
        </div>
      </div>

      {/* Decorative Status Metadata */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pointer-events-none opacity-40">
        <div className="flex flex-col gap-3 font-mono text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            Core Status: Optimal
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-16 h-[1px] bg-white/20" />
            <span>Encryption: Active</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 font-mono text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest text-right">
          <div>Memory Alloc: 0x4FF2A</div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-24 h-[1px] bg-white/20" />
            <span>Render Mode: Neural_Vortex</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .box-glow-strong {
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.4);
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.8; filter: brightness(1.2); }
        }
        .animate-blink {
          animation: blink 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
