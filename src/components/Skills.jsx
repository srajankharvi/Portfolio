import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import SkillMarquee from "./SkillMarquee";
import { categorizedSkills } from "../data/content";
import { techIconMap, CodeBracketIcon } from "./Icons";

/* Badge colors for proficiency levels */
const levelStyles = {
  Proficient: {
    bg: "rgba(59, 130, 246, 0.14)",
    text: "#60A5FA",
    border: "rgba(59, 130, 246, 0.28)",
  },
  Intermediate: {
    bg: "rgba(34, 197, 94, 0.14)",
    text: "#4ADE80",
    border: "rgba(34, 197, 94, 0.28)",
  },
  Beginner: {
    bg: "rgba(250, 204, 21, 0.14)",
    text: "#FACC15",
    border: "rgba(250, 204, 21, 0.28)",
  },
  Familiar: {
    bg: "rgba(168, 85, 247, 0.14)",
    text: "#C084FC",
    border: "rgba(168, 85, 247, 0.28)",
  },
};

/* Stagger entrance animation variants */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 0.61, 0.36, 1],
      delay: i * 0.07,
    },
  }),
};

/* Individual Skill Card Component with Soft Inner Gradient & Glassmorphism */
function SkillCard({ skill, index }) {
  const Icon = techIconMap[skill.name] || CodeBracketIcon;
  const levelConfig = levelStyles[skill.level] || levelStyles.Beginner;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="skill-saas-card group relative flex cursor-default flex-col justify-between overflow-hidden rounded-[20px] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] via-[#141419]/90 to-[#0C0C10] p-6 backdrop-blur-md shadow-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-white/[0.20] hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)]"
    >
      {/* Subtle Glassmorphism Light Reflective Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-60" />

      {/* Subtle Mouse-Following Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.10), transparent 80%)`,
        }}
      />

      {/* Top Row: Icon + Badge */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Flat, Clean, and Static Technology Icon Wrapper */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.05] text-[#3B82F6]">
          <Icon className="h-7 w-7" />
        </div>

        {/* Proficiency Badge / Status Pill */}
        <span
          className="rounded-full border px-3 py-1 text-xs font-semibold tracking-wide"
          style={{
            backgroundColor: levelConfig.bg,
            color: levelConfig.text,
            borderColor: levelConfig.border,
          }}
        >
          {skill.level}
        </span>
      </div>

      {/* Bottom Row: Skill Name */}
      <div className="relative z-10 mt-6">
        <h4 className="font-heading text-lg font-bold tracking-tight text-white">
          {skill.name}
        </h4>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical Skills"
      subtitle="Technologies, languages, and software development tools I work with."
    >
      {/* Categorized Grid */}
      <div className="space-y-12">
        {categorizedSkills.map((section) => (
          <div key={section.categoryTitle} className="space-y-6">
            {/* Category Header */}
            <div className="flex items-center gap-3 border-b border-[#222222] pb-3">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <h3 className="font-heading text-xl font-bold tracking-tight text-white">
                {section.categoryTitle}
              </h3>
            </div>

            {/* Grid of SaaS Product Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.skills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Horizontal Marquee at the bottom */}
      <SkillMarquee />
    </Section>
  );
}
