"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, Bot, Rocket } from "lucide-react";

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".exp-heading",
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
      ".exp-card",
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );
  }, { scope: sectionRef });

  const experiences = [
    {
      title: "Co-founder",
      company: "BOCT",
      slogan: "One Bot. Infinite Conversations.",
      period: "2024 - Present",
      description: "Leading an AI-focused technology venture specializing in building and scaling intelligent automation systems. We bridge the gap between businesses and AI technology through custom bot solutions.",
      highlights: [
        "Architecting AI-powered communication frameworks.",
        "Scaling automated bot systems for diverse industry needs.",
        "Bridging advanced NLP applications with real-world business logic."
      ],
      icon: <Bot className="text-blue-400" size={32} />
    },
    {
      title: "Author & Creator",
      company: "Tomorrow's Code Newsletter",
      slogan: "Decoding the Future of Tech.",
      period: "May 2026 - Present",
      description: "A weekly publication exploring AI trends, startup evolution, and the rapidly changing landscape of software development. Reaching a growing community of tech enthusiasts.",
      highlights: [
        "Analyzing the impact of AI on modern coding practices.",
        "Synthesizing complex tech trends into actionable insights.",
        "Building a community around 'Vibe Coding' and AI-first development."
      ],
      icon: <Rocket className="text-purple-400" size={32} />
    },
    {
      title: "Technical Writer",
      company: "Self-Published / LinkedIn",
      slogan: "Insights from the Frontlines of Dev.",
      period: "2026 - Present",
      description: "Sharing deep dives into AI-powered development workflows and the future of engineering. Focusing on helping developers adapt to the new rule of coding.",
      highlights: [
        "Author of 'Adapt or Get Replaced: The New Rule of Coding in 2026'.",
        "Documenting real-world AI implementation strategies.",
        "Engaging with a professional network of 5K+ followers."
      ],
      icon: <Briefcase className="text-blue-500" size={32} />
    }
  ];

  return (
    <section id="experience" ref={sectionRef} className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full md:pl-20 md:pr-6">
        <div className="exp-heading mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
            "Turning Vision into Venture."
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div key={idx} className="exp-card glass shimmer-card p-8 md:p-12 rounded-3xl relative overflow-hidden group border-blue-500/20 hover:border-blue-500/50 transition-colors">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                  {exp.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-3xl font-bold text-white">{exp.title}</h3>
                      <p className="text-blue-400 font-semibold text-lg">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 font-medium text-sm sm:text-base bg-white/5 px-4 py-2 rounded-full border border-white/5">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-purple-400 italic font-medium mb-6 text-lg">"{exp.slogan}"</p>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                    {exp.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {exp.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="text-gray-400 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
