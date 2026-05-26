import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  progress: number;
  isLoaded: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ progress, isLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  
  const [visualProgress, setVisualProgress] = useState(0);
  const [canExit, setCanExit] = useState(false);

  // Smooth, snappy loading animation logic
  useEffect(() => {
    let currentProgress = 0;
    let animationFrameId: number;

    const animateProgress = () => {
      // If assets are loaded, we can move faster to 100%
      // Otherwise, interpolate smoothly toward the target (progress, max 99 until loaded)
      const target = isLoaded ? 100 : Math.min(progress, 99);
      
      if (currentProgress < target) {
        // Calculate dynamic increment for a smooth ease-out feel
        const diff = target - currentProgress;
        // In case of instant load (cached), we want it to animate smoothly over ~1.2s
        // 100% / (60 frames/sec * 1.2s) = ~1.4% increment per frame
        const increment = isLoaded ? Math.max(diff * 0.12, 1.8) : diff * 0.08;
        currentProgress = Math.min(currentProgress + increment, target);
        setVisualProgress(currentProgress);
      }

      if (currentProgress >= 100) {
        setCanExit(true);
      } else {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [progress, isLoaded]);

  // Snappier, premium transition exit
  useEffect(() => {
    if (canExit && containerRef.current) {
      const tl = gsap.timeline();
      
      tl.to(contentRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power4.in"
      })
      .to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "expo.inOut"
      }, "-=0.4")
      .set(containerRef.current, { display: "none" });
    }
  }, [canExit]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#06070a] overflow-hidden"
    >
      {/* Background Ambience - Subtle Premium Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px]" />
      </div>

      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center max-w-sm w-full px-8"
      >
        {/* Minimalist Logo / Typography */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-sky-400/70 uppercase mb-2">
            Loading Experience
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[0.25em] text-slate-100 select-none">
            TAHIR <span className="text-sky-400 font-black">AZEEM</span>
          </h1>
          <div className="mt-2 text-[9px] md:text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase opacity-70">
            Portfolio v2.0
          </div>
        </div>

        {/* Minimalist Progress Container */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div 
              ref={barRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 via-sky-400 to-blue-500 box-glow transition-all duration-100 ease-out"
              style={{ width: `${visualProgress}%` }}
            />
          </div>
          
          {/* Snappy Minimal Percentage */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 select-none">
            <span className="font-semibold text-slate-200">
              {Math.round(visualProgress)}
            </span>
            <span>%</span>
          </div>
        </div>
      </div>

      {/* Elegant Footer Meta */}
      <div className="absolute bottom-8 flex justify-center w-full pointer-events-none opacity-40">
        <div className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
          Initializing...
        </div>
      </div>

      <style jsx>{`
        .box-glow {
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Preloader;
