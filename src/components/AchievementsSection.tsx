"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy } from "lucide-react";

const AchievementsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".ach-heading",
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
      ".ach-card",
      { scale: 0.9, opacity: 0, y: 50 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="achievements" ref={sectionRef} className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 w-full md:pl-20 md:pr-6">
        <div className="ach-heading mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
            "Showing up is the first step to winning."
          </p>
        </div>

        <div className="grid gap-8">
          {/* SIH Achievement */}
          <div className="ach-card glass shimmer-card p-8 md:p-12 rounded-3xl relative overflow-hidden group border-purple-500/30 hover:border-purple-500/60 transition-colors">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-colors" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shrink-0 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <Trophy size={40} className="text-yellow-400" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-4">Smart India Hackathon (SIH)</h3>
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  Participated in India's biggest national level hackathon, competing against thousands of students with an innovative tech solution. A phenomenal experience of rapid prototyping and teamwork.
                </p>
              </div>
            </div>
          </div>

          {/* LinkedIn Achievement */}
          <div className="ach-card glass shimmer-card p-8 md:p-12 rounded-3xl relative overflow-hidden group border-blue-500/30 hover:border-blue-500/60 transition-colors">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-colors" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-2xl text-blue-400">
                  5K+
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-4">LinkedIn Community</h3>
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  Built a professional network of over 5,000 followers, sharing insights on AI, web development, and the "build in public" journey. Engaging with a global audience of developers and innovators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
