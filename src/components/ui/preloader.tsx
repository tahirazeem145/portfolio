import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  progress?: number;
  isLoaded?: boolean;
  duration?: number; // total duration in seconds (default: 3)
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ 
  progress = 0, 
  isLoaded = false,
  duration = 3,
  onComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  
  const [visualProgress, setVisualProgress] = useState(0);
  const [canExit, setCanExit] = useState(false);

  const progressRef = useRef(progress);
  const isLoadedRef = useRef(isLoaded);

  useEffect(() => {
    progressRef.current = progress;
    isLoadedRef.current = isLoaded;
  }, [progress, isLoaded]);

  // Precise, smooth 3-second loading animation logic
  useEffect(() => {
    const startTime = performance.now();
    // Exit transition takes 0.7s, so progress counts up to 100% over the remaining time
    const progressDuration = Math.max(800, (duration - 0.7) * 1000);
    let animationFrameId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / progressDuration);
      
      // Smooth natural ease-out cubic curve
      const easedTime = 1 - Math.pow(1 - t, 3);
      const timePercent = easedTime * 100;
      
      // Merge with real asset loading progress if available
      const assetPercent = progressRef.current || 0;
      const currentVal = Math.min(100, Math.max(timePercent, isLoadedRef.current ? 100 : assetPercent * 0.9));
      
      setVisualProgress(currentVal);

      if (elapsed >= progressDuration || currentVal >= 100) {
        setVisualProgress(100);
        setCanExit(true);
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration]);

  // Smooth, premium exit transition timed to finish at exactly 3 seconds
  useEffect(() => {
    if (canExit && containerRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          if (onComplete) onComplete();
        }
      });
      
      tl.to(contentRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in"
      })
      .to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55,
        ease: "power4.inOut"
      }, "-=0.2");
    }
  }, [canExit, onComplete]);

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
