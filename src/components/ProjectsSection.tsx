"use client";

import React, { useRef, useState, MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Sparkles } from "lucide-react";

// Tilt Card Component
const TiltCard = ({ project }: { project: any }) => {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out",
    });
  };

  return (
    <div 
      className="project-card glass p-8 rounded-3xl relative z-10 group"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10 blur-xl" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-blue-400 font-medium italic">"{project.tagline}"</p>
        </div>
        <a 
          href={project.link} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all border border-white/10 hover:border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Live
          <ExternalLink size={16} />
        </a>
      </div>

      <p className="text-gray-300 leading-relaxed mb-6 font-light">
        {project.description}
      </p>

      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" /> Features
        </h4>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          {project.features.map((feat: string, i: number) => (
            <li key={i}>{feat}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech: string, i: number) => (
            <span key={i} className="text-xs font-medium px-3 py-1 bg-white/5 border border-white/10 rounded-full text-blue-200">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".project-heading",
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
      ".project-card",
      { y: 100, opacity: 0 },
      {
        y: 0,
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

  const projects = [
    {
      title: "Mutify",
      tagline: "Separate the Beat. Isolate the Soul.",
      description: "Mutify is an AI-powered music separation tool that splits any song into its individual vocals and instrumental tracks instantly. Just upload a track and let the AI do the magic!",
      tech: ["ChatGPT", "Lovable", "API Integration"],
      features: ["Vocal & music separation", "Instant AI processing", "Fully live"],
      link: "https://mutify.lovable.app/",
    },
    {
      title: "HireMind AI",
      tagline: "Your AI Career Coach. Always Ready.",
      description: "HireMind AI is a smart career assistant that analyses your resume, gives improvement suggestions, scores it, checks job description match, conducts AI mock interviews and generates a personalised skill roadmap — all in one platform!",
      tech: ["Lovable", "ChatGPT", "API Integration"],
      features: ["Resume analyser & scorer", "Job description matcher", "AI mock interview", "Skill roadmap generator"],
      link: "https://hiremindai.lovable.app/",
    }
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-24 min-h-screen relative z-10">
      <div className="max-w-6xl mx-auto px-6 w-full pl-8 md:pl-20">
        <div className="project-heading mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
            "Ideas I turned into Reality."
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <TiltCard key={idx} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
