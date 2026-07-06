"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
import { Badge } from "@/components/ui/badge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Project data ────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: "Mutify",
    tagline: "Separate the Beat. Isolate the Soul.",
    cat: "AI / Music",
    description:
      "AI-powered music separation tool that splits any song into its individual vocals and instrumental tracks instantly.",
    tech: ["ChatGPT", "Lovable", "API Integration"],
    img: "/img/mutifyimg/1000058978.png",
    link: "https://mutify.lovable.app/",
  },
  {
    id: 2,
    title: "HireMind AI",
    tagline: "Your AI Career Coach. Always Ready.",
    cat: "AI / Career",
    description:
      "Smart career assistant that analyses your resume, conducts mock interviews, and generates a skill roadmap.",
    tech: ["Lovable", "ChatGPT", "API Integration"],
    img: "/img/hiremindimg/hiremindai thumb.png",
    link: "https://hiremindai.lovable.app/",
  },
  {
    id: 3,
    title: "Tomorrow's Code",
    tagline: "The Pulse of AI Development.",
    cat: "Newsletter",
    description:
      "A newsletter exploring the intersection of AI and software engineering — from LLM trends to the Vibe Coding movement.",
    tech: ["Substack", "Technical Writing", "AI Research"],
    img: "/img/tommarow code img/1000059021.png",
    link: "https://linkedin.com/in/tahirazeem-r",
  },
  {
    id: 4,
    title: "Cinematic Portfolio",
    tagline: "Where Code Meets Art.",
    cat: "Dev",
    description:
      "High-performance cinematic portfolio with GSAP-driven animations, glassmorphism, and a neural vortex background.",
    tech: ["Next.js", "GSAP", "Tailwind CSS"],
    img: "/img/portfolioimg/project thumb.png",
    link: "#",
  },
  {
    id: 5,
    title: "Pagani Scrolltelling",
    tagline: "Interactive mechanical scrolltelling experience.",
    cat: "Creative Dev",
    description:
      "A high-performance interactive web experience showcasing Pagani hypercars with cinematic scroll animations.",
    tech: ["Antigravity", "ChatGPT", "Claude"],
    img: "/img/pagani img/pagani thumb.png",
    link: "http://pagani-azeem.vercel.app",
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  isActive,
}: {
  project: (typeof projects)[0];
  isActive: boolean;
}) {
  return (
    <div className="group relative w-[210px] h-[295px] sm:w-[310px] sm:h-[410px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={project.img}
          alt={project.title}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
            isActive ? "scale-110" : "scale-100 grayscale-[30%]"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        {/* Top row — category badge + link icon */}
        <div className="flex justify-between items-start">
          <Badge
            variant="secondary"
            className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-black/70 backdrop-blur border-white/10 text-gray-300"
          >
            {project.cat}
          </Badge>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center transition-all duration-500 shadow-lg ${
              isActive ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"
            }`}
            aria-label={`Open ${project.title}`}
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          </a>
        </div>

        {/* Bottom content — title, tagline, tech stack */}
        <div
          className={`transition-transform duration-500 ${
            isActive ? "translate-y-0" : "translate-y-2"
          }`}
        >
          <h3 className="text-lg sm:text-2xl font-bold leading-tight text-white mb-1">
            {project.title}
          </h3>
          <p
            className={`text-gray-400 text-[11px] sm:text-sm leading-relaxed transition-all duration-500 ${
              isActive ? "opacity-100 max-h-24" : "opacity-0 max-h-0"
            } overflow-hidden`}
          >
            {project.tagline}
          </p>

          {/* Tech stack pills — only visible on hover */}
          <div
            className={`flex flex-wrap gap-1 mt-2.5 transition-all duration-500 ${
              isActive ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
            } overflow-hidden`}
          >
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[9px] sm:text-[11px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/5"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Gradient underline */}
          <div
            className={`h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 mt-3 transition-all duration-500 ${
              isActive ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  // Refresh ScrollTrigger after full page layout settles so positions are accurate
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 1000); // 1s delay gives ample time for the hero's CanvasSequence images to load and register their pin first
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!headingRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: headingRef });

  return (
    <section
      id="projects"
      className="relative z-10"
    >
      {/* Section header */}
      <div
        ref={headingRef}
        className="max-w-6xl mx-auto px-6 w-full md:pl-20 md:pr-6 pt-24 pb-8"
      >
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
          My <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-xl text-gray-400 font-light tracking-wide uppercase">
          &ldquo;Ideas I turned into Reality.&rdquo;
        </p>
        <p className="text-sm text-gray-500 mt-4 animate-bounce">
          ↓ Scroll to spin the wheel
        </p>
      </div>

      <RadialScrollGallery
        className="!min-h-[80vh]"
        baseRadius={480}
        mobileRadius={220}
        visiblePercentage={50}
        scrollDuration={2200}
        startTrigger="top top"
      >
        {(hoveredIndex) =>
          projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={hoveredIndex === index}
            />
          ))
        }
      </RadialScrollGallery>
    </section>
  );
};

export default ProjectsSection;
