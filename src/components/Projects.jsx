import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import { projectsContent } from "../data/content";
import { GitHubIcon, ExternalLinkIcon, ArrowUpRightIcon } from "./Icons";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={projectsContent.heading}
      subtitle={projectsContent.description}
    >
      <div className="space-y-12">
        {projectsContent.list.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: transform.rotateX,
          rotateY: transform.rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="group glass-card overflow-hidden rounded-3xl border border-border transition-colors hover:border-border-hover"
      >
        <div className={`grid items-center gap-8 p-6 lg:grid-cols-12 lg:p-10 ${isEven ? "" : "lg:grid-flow-dense"}`}>
          {/* Image container */}
          <div className={`relative overflow-hidden rounded-2xl border border-border lg:col-span-7 ${isEven ? "" : "lg:col-start-6"}`}>
            <div className="aspect-[16/10] w-full overflow-hidden bg-surface">
              <picture>
                <source srcSet={project.image} type="image/webp" />
                <img
                  src={project.imageFallback || project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </picture>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Details container */}
          <div className={`space-y-6 lg:col-span-5 ${isEven ? "" : "lg:col-start-1"}`}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Featured Project
              </span>
              <h3 className="mt-2 font-heading text-3xl font-bold text-primary">
                {project.title}
              </h3>
            </div>

            <p className="text-base leading-relaxed text-secondary">
              {project.description}
            </p>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-2">
              {project.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-lg bg-accent-dim px-3 py-1 text-xs font-medium text-accent"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>Live Demo</span>
                  <ArrowUpRightIcon className="h-4 w-4" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <GitHubIcon className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
