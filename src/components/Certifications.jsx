import { motion } from "framer-motion";
import Section from "./Section";
import { certificationsContent } from "../data/content";
import { VerifiedIcon, CalendarIcon, ExternalLinkIcon } from "./Icons";

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
      delay: i * 0.12,
    },
  }),
};

export default function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title={certificationsContent.heading}
      subtitle={certificationsContent.description}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {certificationsContent.list.map((cert, i) => (
          <motion.div
            key={cert.course}
            variants={cardVariants}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group glass-card relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 transition-colors hover:border-border-hover"
          >
            {/* Ambient subtle glow overlay */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/5 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {cert.organization}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-bold leading-snug text-primary">
                    {cert.course}
                  </h3>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <VerifiedIcon className="h-3.5 w-3.5" />
                  {cert.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-secondary">
                {cert.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <CalendarIcon className="h-4 w-4 text-accent" />
                <time dateTime={cert.issuedDateTime}>{cert.issued}</time>
              </div>

              {/* Skills learned badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary border border-white/[0.05]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action button */}
            <div className="mt-8 border-t border-border pt-6">
              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-between text-xs sm:text-sm"
              >
                <span>View Certificate</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
