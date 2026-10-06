import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";
import { certificationsContent } from "../data/content";
import {
  CalendarIcon,
  ExternalLinkIcon,
  GitHubTechIcon,
  ComputerIcon,
  AcademicCapIcon,
} from "./Icons";
import { Slow, Branches, Router, Padlock, Terminal, Exploded, Cabinet, Terrain, Dish, Laptop, Turntable } from "@lucasmarkes/hairline/react";

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
  "The Language of DevOps: DevOps Tools & Processes": "DEVOPS",
  "Python for Data Science": "PYTHON",
  "Git & GitHub - Introduction": "GIT & GITHUB",
  "Introduction to Cloud Computing": "CLOUD",
};

const FIGURES = { 
  slow: Slow, 
  branches: Branches, 
  router: Router, 
  padlock: Padlock, 
  terminal: Terminal, 
  exploded: Exploded, 
  cabinet: Cabinet, 
  terrain: Terrain, 
  dish: Dish,
  laptop: Laptop,
  turntable: Turntable
};

function FigureWrapper({ figureKey, label }) {
  const Figure = FIGURES[figureKey] ?? Slow;

  return (
    <div 
      className="w-full"
      style={{ "--hairline-plate": "#111216" }}
    >
      <Figure theme="dark" intensity={0.5} label={label} />
    </div>
  );
}

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
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
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
        <div className="cert-layout-wrapper">
          
          {/* Left Column: Text Stack */}
          <div className="cert-left-col">
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
                className="cert-ui-meta hover:bg-white/10 transition-colors mt-2"
                aria-label={`View ${cert.course} Certificate`}
              >
                <span className="cert-ui-date">{cert.issued}</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Figure */}
          <div className="cert-right-col">
            <FigureWrapper figureKey={cert.figure} label={`Illustration for ${cert.course}`} />
          </div>

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
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {certificationsContent.list.map((cert, i) => (
            <div key={cert.course} className="h-auto min-h-[320px]">
              <CertificationCard cert={cert} index={i} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
