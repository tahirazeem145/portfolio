"use client";

import dynamic from "next/dynamic";
import CanvasSequence from "@/components/CanvasSequence";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";
import { CinematicFooter } from "@/components/ui/motion-footer";
import SmoothScroll from "@/components/SmoothScroll";

const ParticlesBackground = dynamic(() => import("@/components/ParticlesBackground"), { ssr: false });

export default function Home() {
  return (
    <div className="relative w-full min-h-screen font-sans overflow-x-hidden bg-black">
      <SmoothScroll />
      
      {/* Interactive Backgrounds - outside main to avoid stacking context trap */}
      <ParticlesBackground />

      <main className="relative z-10 w-full text-white selection:bg-blue-500 selection:text-white pb-24">
        {/* Fixed UI Elements */}
        <ScrollProgress />
        <div className="pointer-events-auto">
          <Navbar />
        </div>

        {/* Hero Section (Canvas Sequence) - Blocks Spline tracking */}
        <div className="pointer-events-auto">
          <CanvasSequence />
        </div>
        
        {/* Main Content Areas */}
        <div className="relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,1)]">
          {/* Adds a slight gradient overlay connecting the hero to the rest of the content */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black -translate-y-full pointer-events-none" />
          
          <div className="relative border-b border-white/5">
            <AboutSection />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
          
          <div className="relative border-b border-white/5">
            <SkillsSection />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
          
          <div className="relative border-b border-white/5">
            <ProjectsSection />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
          
          <div className="relative border-b border-white/5">
            <AchievementsSection />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
          
          <div className="relative">
            <ContactSection />
          </div>
        </div>
      </main>

      {/* The Cinematic Footer is injected here */}
      <CinematicFooter />
      
    </div>
  );
}
