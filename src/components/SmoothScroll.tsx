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
      duration: 1.2, // Standard responsiveness (avoids floaty delay on trackpads/laptops)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      // Omit/disable syncTouch to let mobile browsers run native, hardware-accelerated scrolling
    });

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync with GSAP Ticker using a named reference to prevent memory leaks
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000); // gsap.ticker gives seconds, lenis wants ms
    };
    gsap.ticker.add(updateLenis);

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
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return null;
};

export default SmoothScroll;
