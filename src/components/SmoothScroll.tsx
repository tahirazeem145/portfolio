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

    // Sync Lenis resize whenever ScrollTrigger recalculates layout
    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Initial refresh
    ScrollTrigger.refresh();

    // Delayed refresh to handle dynamic content & preloader settle (3s)
    const timeoutId1 = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      lenis.resize();
    }, 1000);

    const timeoutId2 = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      lenis.resize();
    }, 3200);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return null;
};

export default SmoothScroll;
