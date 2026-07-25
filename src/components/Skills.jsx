import { useRef } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import SkillMarquee from "./SkillMarquee";
import { categorizedSkills } from "../data/content";
import { techIconMap, CodeBracketIcon } from "./Icons";

/* Badge colors for proficiency levels */
const levelStyles = {
  Proficient: {
    bg: "rgba(59, 130, 246, 0.12)", // Soft blue
    text: "#60A5FA",
    border: "rgba(59, 130, 246, 0.25)",
  },
  Intermediate: {
    bg: "rgba(168, 85, 247, 0.12)", // Soft purple
    text: "#C084FC",
    border: "rgba(168, 85, 247, 0.25)",
  },
  Advanced: {
    bg: "rgba(16, 185, 129, 0.12)", // Soft emerald
    text: "#34D399",
    border: "rgba(16, 185, 129, 0.25)",
  },
  Beginner: {
    bg: "rgba(245, 158, 11, 0.12)", // Soft amber
    text: "#FBBF24",
    border: "rgba(245, 158, 11, 0.25)",
  },
  Familiar: {
    bg: "rgba(255, 255, 255, 0.05)",
    text: "#A1A1AA",
    border: "rgba(255, 255, 255, 0.1)",
  },
};

/* Stagger entrance animation variants */
const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

/* Individual Skill Card Component with Soft Inner Gradient & Glassmorphism */
function SkillCard({ skill, index }) {
  const Icon = techIconMap[skill.name] || CodeBracketIcon;
  const levelConfig = levelStyles[skill.level] || levelStyles.Beginner;
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      onMouseMove={handleMouseMove}
      className="skill-saas-card group relative flex cursor-default flex-col justify-between overflow-hidden rounded-[20px] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] via-[#141419]/90 to-[#0C0C10] p-6 backdrop-blur-md shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)]"
    >
      {/* Subtle Glassmorphism Light Reflective Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-60" />

      {/* Ultra-fast Mouse-Following Radial Spotlight via CSS variables */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.10), transparent 80%)`,
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
