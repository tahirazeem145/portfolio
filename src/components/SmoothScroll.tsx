"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SmoothScroll = () => {
  useEffect(() => {
    // Register ScrollTrigger if not already registered
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis with ultra-smooth lerp interpolation
    const lenis = new Lenis({
      lerp: 0.09, // Buttery smooth linear interpolation glide
      smoothWheel: true,
      wheelMultiplier: 1.0, // Natural 1:1 input glide response
      touchMultiplier: 1.5,
      infinite: false,
      anchors: true, // Smoothly glide to anchor sections like #about, #projects
      autoResize: true,
    });

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync with GSAP Ticker using a named reference to prevent memory leaks
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000); // gsap.ticker gives seconds, lenis wants ms
    };
    gsap.ticker.add(updateLenis);

    // Maintain intelligent lag smoothing so micro-frame dips are absorbed gracefully
    gsap.ticker.lagSmoothing(500, 33);

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
