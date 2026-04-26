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
import MouseGlow from "@/components/MouseGlow";

// Ensure the WebGL canvas is NEVER server-side rendered
const FluidBackground = dynamic(() => import("@/components/FluidBackground"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen text-white selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Interactive Backgrounds */}
      <FluidBackground />
      <MouseGlow />

      {/* Fixed UI Elements */}
      <ScrollProgress />
      <Navbar />

      {/* Hero Section (Canvas Sequence) */}
      <CanvasSequence />
      
      {/* Main Content Areas */}
      <div className="relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,1)]">
        {/* Adds a slight gradient overlay connecting the hero to the rest of the content */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black -translate-y-full pointer-events-none" />
        
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </div>
    </main>
  );
}
