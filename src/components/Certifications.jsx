import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { certificationsContent } from "../data/content";
import {
  VerifiedIcon,
  CalendarIcon,
  ExternalLinkIcon,
  GitHubTechIcon,
  ComputerIcon,
  AcademicCapIcon,
} from "./Icons";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.19, 1, 0.22, 1],
      delay: i * 0.08,
    },
  }),
};

const orgIconMap = {
  "Infosys Springboard": ComputerIcon,
  NPTEL: AcademicCapIcon,
  GITHUB: GitHubTechIcon,
};

const orgColorMap = {
  "Infosys Springboard": "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/20",
  NPTEL: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20",
  GITHUB: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/20",
};

const orgGlowMap = {
  "Infosys Springboard": "rgba(59, 130, 246, 0.12)",
  NPTEL: "rgba(16, 185, 129, 0.12)",
  GITHUB: "rgba(168, 85, 247, 0.12)",
};

function CertificationCard({ cert, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update CSS variables directly for ultra-fast, 60fps response (no React re-renders)
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const OrgIcon = orgIconMap[cert.organization] || ComputerIcon;
  const colorClass = orgColorMap[cert.organization] || orgColorMap["Infosys Springboard"];
  const glowColor = orgGlowMap[cert.organization] || orgGlowMap["Infosys Springboard"];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] transition-all duration-300 ease-expo hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_24px_60px_-15px_rgba(59,130,246,0.25)]"
      style={{
        background: `
          linear-gradient(180deg, #1c1d24 0%, #111216 100%) padding-box,
          linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.02) 100%) border-box
        `,
        border: "1px solid transparent",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)"
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] p-5 z-10"
      >
        {/* Soft matte sheen highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Ultra-fast Dynamic Spotlight using CSS variables */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-0"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 80%)`,
          }}
        />

        {/* Background Mesh/Grid with soft mask */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02] transition-opacity duration-300 group-hover:opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_70%)] z-0" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Logo Badge */}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br shadow-inner ${colorClass}`}>
                <OrgIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#7A7A7A] transition-colors duration-200 group-hover:text-white/70">
                  {cert.organization}
                </p>
                <h3 className="mt-1 font-heading text-[14px] font-bold leading-tight text-white/90 transition-colors duration-200 group-hover:text-white line-clamp-2">
                  {cert.course}
                </h3>
              </div>
            </div>
            
            {/* Verified Badge */}
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 backdrop-blur-md">
              <VerifiedIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Verified</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-[12px] leading-relaxed text-[#A1A1AA] line-clamp-3">
            {cert.description}
          </p>

          <div className="mt-4 flex flex-col gap-3 flex-1 justify-end">
            {/* Date */}
            <div className="flex w-fit items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-1 text-xs font-mono text-[#7A7A7A]">
              <CalendarIcon className="h-3.5 w-3.5" />
              <time dateTime={cert.issuedDateTime}>{cert.issued}</time>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-[#D4D4D8] transition-colors duration-200 group-hover:border-white/[0.1] group-hover:bg-white/[0.04]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10 mt-4 pt-4 border-t border-white/[0.05]">
          <a
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[11px] font-semibold text-white/80 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
          >
            <span className="flex items-center gap-2">
              <span>View Certificate</span>
            </span>
            <ExternalLinkIcon className="h-4 w-4 text-white/50 transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title={certificationsContent.heading}
      subtitle={certificationsContent.description}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificationsContent.list.map((cert, i) => (
          <div key={cert.course} className="h-[440px]">
            <CertificationCard cert={cert} index={i} />
          </div>
        ))}
      </div>
    </Section>
  );
}
