import { motion } from "framer-motion";
import Section from "./Section";
import { aboutContent, aboutCards } from "../data/content";
import { AcademicCapIcon, MapPinIcon, TargetIcon, SparklesIcon } from "./Icons";

const iconMap = {
  education: AcademicCapIcon,
  location: MapPinIcon,
  goal: TargetIcon,
  learning: SparklesIcon,
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

export default function About() {
  return (
    <Section
      id="about"
      eyebrow={aboutContent.eyebrow}
      title={aboutContent.heading}
    >
      {/* Bento grid layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Main narrative card — spans 7 cols */}
        <motion.div
          variants={cardVariants}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="glass-card flex flex-col justify-center rounded-3xl p-8 lg:col-span-7 lg:p-10"
        >
          <div className="space-y-4 text-base leading-[1.8] text-secondary sm:text-lg">
            {aboutContent.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* 4 Information Cards — spans 5 cols */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {aboutCards.map((card, i) => {
            const Icon = iconMap[card.icon] || AcademicCapIcon;
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -4, borderColor: "rgba(59,130,246,0.3)" }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group glass-card rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted">
                      {card.title}
                    </h3>
                    <p className="mt-1 font-heading text-sm font-bold text-primary">
                      {card.subtitle}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">
                      {card.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
