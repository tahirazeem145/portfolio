"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail } from "lucide-react";
import InteractiveNeuralVortex from "@/components/ui/interactive-neural-vortex-background";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".contact-reveal",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="contact" ref={sectionRef} className="py-24 relative z-10 border-t border-white/10 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 w-full text-center">
        <div className="contact-reveal mb-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
            "Have an idea? Let's build it together."
          </p>
        </div>

        <div className="contact-reveal flex flex-wrap justify-center gap-6 mb-16">
          <a href="mailto:tahirazeems145s@gmail.com" className="flex items-center gap-3 px-6 py-4 glass shimmer-card rounded-full hover:-translate-y-1 transition-transform group">
            <Mail className="text-blue-400 group-hover:text-white transition-colors" />
            <span className="text-gray-300 font-medium">tahirazeems145s@gmail.com</span>
          </a>
          <a href="https://www.linkedin.com/in/tahirazeem-r" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-4 glass shimmer-card rounded-full hover:-translate-y-1 transition-transform group">
            <svg className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span className="text-gray-300 font-medium">LinkedIn</span>
          </a>
          <a href="https://github.com/tahirazeem145" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-4 glass shimmer-card rounded-full hover:-translate-y-1 transition-transform group">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span className="text-gray-300 font-medium">GitHub</span>
          </a>
        </div>

        <div className="contact-reveal flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-24">
          <a href="mailto:tahirazeems145s@gmail.com" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] shimmer-card">
            Hire Me
          </a>
          <a href="https://www.linkedin.com/in/tahirazeem-r" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors hover:scale-105 active:scale-95 shimmer-card">
            Let's Talk
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-6 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Built with <span className="text-blue-500">💙</span> by Tahir Azeem
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
