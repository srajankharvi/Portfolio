import { motion, useMotionValue, useTransform } from "framer-motion";
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

function DraggableProfileCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Resting length of the hanging belt
  const beltLength = 80;

  // Rotate slightly based on x, creating a natural pendulum swinging effect
  const rotate = useTransform(x, [-250, 250], [-12, 12]);

  // Generate dynamic SVG path for the elastic belt
  const beltPath = useTransform([x, y], ([latestX, latestY]) => {
    // Start at top anchor (0,0)
    // End at the card's clip (-6px offset from base)
    const endX = latestX;
    const endY = beltLength - 6 + latestY;
    
    // Smooth bezier control point to simulate slight bending/tension
    // Bends outwards slightly when pulled sideways, but pulls taut when pulled down
    const tension = Math.max(1, 1 + latestY * 0.01);
    const controlX = latestX * (0.4 / tension);
    const controlY = (beltLength + latestY) * 0.5;

    return `M 0 0 Q ${controlX} ${controlY} ${endX} ${endY}`;
  });

  return (
    <div className="relative flex h-full w-full min-h-[450px] items-start justify-center pt-0 lg:min-h-[500px]">
      
      {/* Top Anchor Point */}
      <div className="absolute top-0 left-1/2 z-20 h-3 w-10 -translate-x-1/2 rounded-b-lg border border-t-0 border-[#333] bg-gradient-to-b from-[#111] to-[#0a0a0a] shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
        <div className="mx-auto mt-1 h-1 w-6 rounded-full bg-[#222] shadow-inner"></div>
      </div>
      
      {/* Dynamic Elastic Belt Canvas */}
      <svg className="absolute top-0 left-1/2 w-0 h-0 z-10 overflow-visible pointer-events-none">
        {/* Belt Shadow */}
        <motion.path 
          d={beltPath}
          stroke="rgba(0,0,0,0.6)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          className="translate-y-[2px]"
        />
        {/* Belt Core */}
        <motion.path 
          d={beltPath}
          stroke="#1a1a1a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Belt Highlight (Metallic texture) */}
        <motion.path 
          d={beltPath}
          stroke="#444"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          className="opacity-70"
        />
      </svg>
      
      {/* Draggable Card */}
      <motion.div
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
        style={{ x, y, rotate, marginTop: beltLength, transformOrigin: "center -6px" }}
        whileDrag={{ cursor: "grabbing", scale: 1.02 }}
        whileHover={{ cursor: "grab" }}
        className="relative z-30 flex w-[75%] max-w-[280px] flex-col items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#111] p-3 pb-8 shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-colors duration-300 hover:border-[#333]"
      >
        {/* Attachment Clip / Hardware */}
        <div className="absolute -top-4 left-1/2 h-8 w-6 -translate-x-1/2 rounded-md border border-[#555] bg-gradient-to-b from-[#333] to-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.8)]">
          {/* Rivet */}
          <div className="absolute bottom-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-[#222] bg-[#555] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"></div>
          {/* Top Ring/Loop */}
          <div className="absolute -top-2 left-1/2 h-3 w-4 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-[#555]"></div>
        </div>

        {/* Inner Light Panel (Polaroid style) */}
        <div className="relative w-full overflow-hidden rounded-xl border border-[#ddd] bg-[#e5e5e5] p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
          {/* Photo Container */}
          <div className="relative w-full overflow-hidden rounded-lg bg-black">
            {/* Subtle glossy overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-to-br from-white/20 via-transparent to-black/40 pointer-events-none mix-blend-overlay"></div>
            
            <img
              src="/Srajan_Developer.webp"
              alt="Srajan"
              width="1086"
              height="1448"
              loading="lazy"
              draggable="false"
              className="w-full h-auto object-cover object-top select-none pointer-events-none saturate-[0.9] contrast-125"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <Section
      id="about"
      eyebrow={aboutContent.eyebrow}
      title={aboutContent.heading}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Draggable Card (Spans 5 cols) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="lg:col-span-5"
        >
          <DraggableProfileCard />
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
