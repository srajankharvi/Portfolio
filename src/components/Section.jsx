import { motion } from "framer-motion";

const sectionVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 80,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Section({ id, eyebrow, title, subtitle, children, className = "" }) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
      <div className="mx-auto w-[min(100%-2rem,1200px)]">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16"
        >
          {eyebrow && (
            <p className="mb-4 text-sm font-medium tracking-[0.2em] uppercase text-accent">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="max-w-2xl font-heading text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-secondary">
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
