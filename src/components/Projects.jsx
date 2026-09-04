import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { projectsContent } from "../data/content";
import { GitHubIcon, ArrowUpRightIcon } from "./Icons";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={projectsContent.heading}
      subtitle={projectsContent.description}
    >
      <div className="space-y-12">
        {projectsContent.list.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: "blur(8px)", scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1], delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden rounded-[28px] transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-15px_rgba(59,130,246,0.15)]"
        style={{
          background: `
            linear-gradient(180deg, #1c1d24 0%, #111216 100%) padding-box,
            linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.02) 100%) border-box
          `,
          border: "1px solid transparent",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
      >
        {/* Soft matte sheen highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Ultra-fast Mouse-Following Radial Spotlight Glow using CSS Variables */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.12), transparent 80%)`,
          }}
        />

        {/* Card Content Grid */}
        <div className="relative z-10 p-6 lg:p-10">
          <div className={`grid items-center gap-8 lg:grid-cols-12 ${isEven ? "" : "lg:grid-flow-dense"}`}>
            {/* Image Thumbnail Container */}
            <div 
              className={`relative overflow-hidden rounded-2xl lg:col-span-7 ${isEven ? "" : "lg:col-start-6"}`}
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              <div className="aspect-[16/10] w-full overflow-hidden p-1">
                <picture>
                  <source srcSet={project.image} type="image/webp" />
                  <img
                    src={project.imageFallback || project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full rounded-xl object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105"
                  />
                </picture>
                {/* Subtle Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-20" />
              </div>
            </div>

            {/* Project Details */}
            <div className={`space-y-6 lg:col-span-5 ${isEven ? "" : "lg:col-start-1"}`}>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                  Featured Project
                </span>
                <h3 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#60A5FA]">
                  {project.title}
                </h3>
              </div>

              <p className="text-base leading-relaxed text-[#B3B3B3]">
                {project.description}
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#E0E0E0] transition-colors duration-300 group-hover:border-[#3B82F6]/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Tech Hash Tags */}
              <div className="flex flex-wrap gap-2.5 border-t border-white/[0.06] pt-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono font-medium text-[#7A7A7A] transition-colors duration-300 group-hover:text-[#A3A3A3]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    <GitHubIcon className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
