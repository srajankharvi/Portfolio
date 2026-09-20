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

function CertificationCard({ cert, index }) {
  const OrgIcon = orgIconMap[cert.organization] || ComputerIcon;

  return (
    <motion.a
      href={cert.certificateUrl}
      target="_blank"
      rel="noopener noreferrer"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="cert-outer block cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
    >
      <div className="cert-dot" />
      <div className="cert-inner">
        <div className="cert-ray" />
        
        {/* Content */}
        <div className="cert-title">{cert.course}</div>
        
        <div className="text-[#A1A1AA] text-sm mt-1 mb-2 font-medium flex items-center gap-1.5 z-10">
          from 
          <span className="flex items-center gap-1 text-[#D4D4D8] font-semibold bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
            <OrgIcon className="h-3.5 w-3.5" />
            {cert.organization}
          </span>
        </div>
        
        <p className="text-[12px] leading-relaxed text-[#8f8f94] line-clamp-4 mb-4 z-10">
          {cert.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 w-full z-10">

          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-1 text-xs font-mono text-[#7A7A7A]">
              <CalendarIcon className="h-3.5 w-3.5" />
              <time dateTime={cert.issuedDateTime}>{cert.issued}</time>
            </div>
            <ExternalLinkIcon className="h-4 w-4 text-white/40" />
          </div>
        </div>

        {/* Lines */}
        <div className="cert-line cert-topl" />
        <div className="cert-line cert-leftl" />
        <div className="cert-line cert-bottoml" />
        <div className="cert-line cert-rightl" />
      </div>
    </motion.a>
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
