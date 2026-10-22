import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Lanyard from "./Lanyard";
import Section from "./Section";
import { aboutContent, aboutCards } from "../data/content";
import { AcademicCapIcon, MapPinIcon, TargetIcon, SparklesIcon } from "./Icons";
import useDeviceMotionShake from "../hooks/useDeviceMotionShake";

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
  const lanyardRef = useRef(null);

  const handleShake = useCallback((shakeData) => {
    lanyardRef.current?.shake?.(shakeData);
  }, []);

  useDeviceMotionShake({
    onShake: handleShake,
    threshold: 13.5,
    cooldown: 900
  });

  return (
    <Section
      id="about"
      eyebrow={aboutContent.eyebrow}
      title={aboutContent.heading}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: 3D Interactive Lanyard Card (Spans 5 cols) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="lg:col-span-5 flex flex-col items-center"
        >
          <div className="relative w-full h-[600px]">
            <Lanyard
              ref={lanyardRef}
              frontImage="/Srajan_Developer.webp"
              cardColor="#121316"
              finish="glossy"
              whiteReflection={0.6}
              stillReflection={0}
              metal="silver"
              size={0.62}
              strapLength={0.48}
              strapWidth={0.7}
              strapColor="#1d4ed8"
              elasticity={0.6}
              breeze={0.4}
              damping={0.5}
              backDetails={{
                name: 'Srajan',
                role: 'Developer',
                status: 'Ready for Collaboration'
              }}
            />
          </div>
        </motion.div>

        {/* Right Column: Existing Content (Spans 7 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Main narrative card */}
          <motion.div
            variants={cardVariants}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="glass-card flex flex-col justify-center rounded-3xl p-8 lg:p-10"
          >
            <div className="space-y-4 text-base leading-[1.8] text-secondary sm:text-lg">
              {aboutContent.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* 4 Information Cards grid */}
          <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
    </Section>
  );
}
