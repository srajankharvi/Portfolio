import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroContent, roles } from "../data/content";
import { ArrowRightIcon } from "./Icons";
import Background from "./Background";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function RoleText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -24, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="inline-block text-accent"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SpotlightName({ firstName, lastName }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <h1
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="font-heading text-6xl font-bold tracking-tight text-primary sm:text-7xl lg:text-8xl leading-[0.95] select-none inline-block transition-colors duration-300"
      style={
        isHovered
          ? {
              backgroundImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, #60A5FA 0%, #3B82F6 40%, #FFFFFF 85%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : {
              color: "#FFFFFF",
            }
      }
    >
      {firstName}
      <br />
      {lastName}
    </h1>
  );
}

export default function Hero() {
  const imageRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Mouse parallax for image
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function handleMouse(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      setParallax({ x, y });
    }
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28"
    >

      <div className="mx-auto grid w-[min(100%-2rem,1200px)] items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-8"
        >
          {/* Large Minimal Heading with Glyph-Clipped Cursor Spotlight Effect */}
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-lg font-medium text-muted sm:text-xl">
              {heroContent.greeting}
            </p>
            <SpotlightName
              firstName={heroContent.firstName}
              lastName={heroContent.lastName}
            />
          </motion.div>

          {/* Subtitle with smooth role cycle */}
          <motion.div
            variants={itemVariants}
            className="text-xl font-medium text-secondary sm:text-2xl"
          >
            <RoleText />
          </motion.div>

          {/* Single concise sentence */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl text-base leading-relaxed text-secondary sm:text-lg"
          >
            {heroContent.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2"
          >
            <a href="#projects" className="btn-primary group">
              {heroContent.primaryButtonText}
              <ArrowRightIcon className="arrow h-4 w-4" />
            </a>
            <a href="#contact" className="btn-ghost group">
              {heroContent.secondaryButtonText}
              <ArrowRightIcon className="arrow h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right side 3D illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="relative z-10 hidden lg:block"
        >
          {/* Subtle blue radial glow behind image */}
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15]"
              style={{
                background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)",
              }}
            />
          </div>

          <motion.div
            ref={imageRef}
            animate={{
              x: parallax.x,
              y: parallax.y,
            }}
            transition={{ type: "spring", stiffness: 45, damping: 20 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <img
                src="/developer-avatar-3d.png"
                alt="Srajan Kharvi — 3D Software Developer Illustration"
                width="1024"
                height="1024"
                className="mx-auto h-auto w-full max-w-[480px] rounded-3xl object-cover drop-shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-muted">
            Scroll
          </span>
          <div className="h-6 w-[1px] bg-gradient-to-b from-muted to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
