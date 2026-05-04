"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SmoothScroll = () => {
  useEffect(() => {
    // Register ScrollTrigger if not already registered
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.8, // Increased for ultra-smooth feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly less sensitive for more control
      touchMultiplier: 1.5,
      infinite: false,
      syncTouch: true, // Crucial for mobile scroll sync
    });

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync with GSAP Ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // gsap.ticker gives seconds, lenis wants ms
    });

    // Disable gsap lag smoothing for better sync
    gsap.ticker.lagSmoothing(0);

    // Initial refresh
    ScrollTrigger.refresh();

    // Delayed refresh to handle dynamic content layout
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return null;
};

export default SmoothScroll;
