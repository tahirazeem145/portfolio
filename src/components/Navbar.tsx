"use client";

import React, { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(() => {
    // Show navbar only after scrolling past the first 100vh (which is our canvas sequence area)
    // The canvas is pinned for 400% height, so maybe show it after 100% or 400%. 
    // Let's show it after 100vh for a smooth appearance during scroll.
    ScrollTrigger.create({
      start: "top -100%",
      end: "max",
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    });
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Achievements", href: "#achievements" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 mt-4 glass rounded-full flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-white tracking-wider">
          TAR<span className="text-blue-500">.</span>
        </a>
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          Let's Talk
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
