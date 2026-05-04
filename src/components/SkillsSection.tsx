"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveNeuralVortex from "@/components/ui/interactive-neural-vortex-background";

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".skill-heading",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".skill-pill",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.05,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );

    const bars = gsap.utils.toArray(".skill-bar-fill") as HTMLElement[];
    bars.forEach((bar) => {
      const width = bar.getAttribute("data-width") || "0%";
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: width,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 85%",
          },
        }
      );
    });
  }, { scope: sectionRef });

  const programming = ["Python", "Java", "C", "Java + DSA"];
  const aiTools = [
    { name: "ChatGPT", level: 95 },
    { name: "Gemini", level: 75 },
    { name: "Claude", level: 75 },
    { name: "Lovable AI", level: 70 },
    { name: "Replit AI", level: 70 },
    { name: "Google Flow", level: 65 },
  ];
  const frameworks = ["Lovable", "Replit", "Antigravity"];
  const otherTools = [
    { name: "VS Code", level: 90 },
    { name: "GitHub", level: 40 },
    { name: "Canva", level: 70 },
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-24 min-h-screen relative z-10 overflow-hidden">
      <InteractiveNeuralVortex position="absolute" opacity={0.3} />
      <div className="max-w-6xl mx-auto px-6 w-full md:pl-20 md:pr-6">
        <div className="skill-heading mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
            "Always Learning. Always Building."
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column: Progress Bars */}
          <div ref={barsRef} className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-blue-500"></span> AI & Development Tools
              </h3>
              <div className="space-y-6">
                {[...aiTools, ...otherTools].sort((a, b) => b.level - a.level).map((tool, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 font-medium">{tool.name}</span>
                      <span className="text-blue-400 text-sm">{tool.level}%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-white/5 rounded-full overflow-hidden shimmer-card">
                      <div
                        className="skill-bar-fill h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full box-glow"
                        data-width={`${tool.level}%`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pill Badges */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-purple-500"></span> Programming Languages
              </h3>
              <div className="flex flex-wrap gap-4">
                {programming.map((lang, idx) => (
                  <div key={idx} className="skill-pill glass shimmer-card px-6 py-3 rounded-full text-white font-medium border border-blue-500/30 hover:border-blue-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-blue-500"></span> Frameworks & Platforms
              </h3>
              <div className="flex flex-wrap gap-4">
                {frameworks.map((fw, idx) => (
                  <div key={idx} className="skill-pill glass shimmer-card px-6 py-3 rounded-full text-white font-medium border border-purple-500/30 hover:border-purple-500 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    {fw}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
