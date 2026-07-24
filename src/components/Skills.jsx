import { motion } from "framer-motion";
import Section from "./Section";
import SkillMarquee from "./SkillMarquee";
import { skillCategories } from "../data/content";
import {
  CodeBracketIcon,
  LayoutIcon,
  DatabaseIcon,
  GitBranchIcon,
  WrenchIcon,
  RocketIcon,
} from "./Icons";

const categoryIconMap = {
  code: CodeBracketIcon,
  layout: LayoutIcon,
  database: DatabaseIcon,
  git: GitBranchIcon,
  tools: WrenchIcon,
  rocket: RocketIcon,
};

const cardVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 40,
    scale: 0.98,
  },
  visible: (i) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: i * 0.1,
    },
  }),
};

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical Skills"
      subtitle="My technical skills continue to grow through hands-on projects, continuous learning, and practical software development experience."
    >
      {/* 6 Categorized Skill Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category, i) => {
          const Icon = categoryIconMap[category.icon] || CodeBracketIcon;
          return (
            <motion.div
              key={category.title}
              variants={cardVariants}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{
                y: -6,
                borderColor: "rgba(59,130,246,0.35)",
                boxShadow: "0 0 30px rgba(59,130,246,0.12)",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="group glass-card flex flex-col justify-between rounded-3xl p-7 transition-all duration-300"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary">
                    {category.title}
                  </h3>
                </div>

                {/* Skill Items list */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-secondary transition-colors group-hover:border-white/[0.1] group-hover:text-primary"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="text-primary">{skill.name}</span>
                      {skill.level && (
                        <span className="ml-1 text-[10px] text-muted">
                          ({skill.level})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium Skill Marquee */}
      <SkillMarquee />
    </Section>
  );
}
