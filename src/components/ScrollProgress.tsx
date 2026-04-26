"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ScrollProgress = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(progressRef.current, {
      scaleY: 1,
      transformOrigin: "top",
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      },
    });
  }, []);

  return (
    <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-[2px] h-1/2 bg-white/10 z-50 rounded-full hidden md:block">
      <div
        ref={progressRef}
        className="w-full h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full box-glow scale-y-0"
        style={{ transformOrigin: "top" }}
      />
    </div>
  );
};

export default ScrollProgress;
