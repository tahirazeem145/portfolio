"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ScrollProgress = () => {
  const verticalRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate both bars based on scroll progress
    gsap.to([verticalRef.current], {
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

    gsap.to([horizontalRef.current], {
      scaleX: 1,
      transformOrigin: "left",
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
    <>
      {/* Vertical Bar for Desktop */}
      <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-[2px] h-1/2 bg-white/10 z-50 rounded-full hidden md:block">
        <div
          ref={verticalRef}
          className="w-full h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full box-glow scale-y-0"
          style={{ transformOrigin: "top" }}
        />
      </div>

      {/* Horizontal Bar for Mobile */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 z-[60] md:hidden">
        <div
          ref={horizontalRef}
          className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 box-glow scale-x-0"
          style={{ transformOrigin: "left" }}
        />
      </div>
    </>
  );
};

export default ScrollProgress;
