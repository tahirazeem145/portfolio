"use client";

import React, { useRef } from "react";
import { GraduationCap, MapPin, Building, Briefcase, Calendar } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveNeuralVortex from "@/components/ui/interactive-neural-vortex-background";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Heading animation
    gsap.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Content cards animation staggered
    gsap.fromTo(
      ".about-item",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: sectionRef });

  const quickInfo = [
    { icon: <GraduationCap size={24} className="text-blue-400" />, label: "Degree", value: "B.E. Computer Science" },
    { icon: <Building size={24} className="text-purple-400" />, label: "College", value: "JJCET, Trichy" },
    { icon: <Calendar size={24} className="text-blue-400" />, label: "Year", value: "2nd Year" },
    { icon: <MapPin size={24} className="text-purple-400" />, label: "Location", value: "Trichy, Tamil Nadu" },
    { icon: <Briefcase size={24} className="text-blue-400" />, label: "Status", value: "Open to Internships" },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 min-h-screen flex items-center relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10 md:pl-20">
        <div ref={headingRef} className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
            "I build AI-powered web apps that solve real problems — not just tutorial clones."
          </p>
        </div>

        <div ref={contentRef} className="grid md:grid-cols-2 gap-12 items-center">
          <div className="about-item glass shimmer-card p-8 md:p-12 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light relative z-10">
              Hey! I'm <span className="text-white font-semibold">Tahir Azeem</span>, a passionate AI-powered Web Developer and <span className="text-blue-400 font-semibold">Co-founder of BOCT</span>. Currently pursuing my engineering degree at JJCET, Trichy. 
              <br /><br />
              I'm deeply committed to the <span className="text-purple-400 font-medium">"build in public"</span> philosophy, sharing my journey of creating real-world applications that leverage the latest in AI technology. 
              <br /><br />
              <span className="text-white italic">I don't just follow tutorials — I innovate and solve real problems through code.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickInfo.map((info, idx) => (
              <div 
                key={idx} 
                className={`about-item glass shimmer-card p-6 rounded-2xl flex flex-col gap-3 glass-hover hover:-translate-y-1 transition-transform ${idx === 4 ? 'sm:col-span-2' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{info.label}</p>
                  <p className="text-white font-medium text-lg mt-1">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
