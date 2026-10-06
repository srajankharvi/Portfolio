import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { certificationsContent } from "../data/content";
import {
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

const shortNameMap = {
  "The Language of DevOps: DevOps Tools & Processes": "DevOps",
  "Python for Data Science": "Python",
  "Git & GitHub - Introduction": "Git & GitHub",
  "Introduction to Cloud Computing": "Cloud",
};

function CertificationCard({ cert, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const shortName = shortNameMap[cert.course] || cert.course.split(" ")[0];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`cert-ui-card ${isExpanded ? "expanded" : ""}`}
      onClick={handleToggle}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`Certificate for ${cert.course} from ${cert.organization}`}
    >
      <div className="cert-magic-glow" />
      <div className="cert-ui-bg">
        <div className="cert-ui-grid" />
      </div>
      
      <div className="cert-ui-content">
        <div className="cert-ui-logo">
          <span className="cert-ui-logo-text">{shortName}</span>
        </div>

        <div className="cert-ui-info">
          <h3 className="cert-ui-title">{cert.course}</h3>
          <p className="cert-ui-org">{cert.organization}</p>
          <a 
            href={cert.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="cert-ui-meta hover:bg-white/10 transition-colors"
            aria-label={`View ${cert.course} Certificate`}
          >
            <span className="cert-ui-date">{cert.issued}</span>
            <ExternalLinkIcon className="h-3 w-3" />
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
          <div key={cert.course} className="h-[320px]">
            <CertificationCard cert={cert} index={i} />
          </div>
        ))}
      </div>
    </Section>
  );
}
