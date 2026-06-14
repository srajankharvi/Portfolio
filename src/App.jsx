import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = ["Home", "About", "Skills", "Projects", "Contact"];

const proficientSkills = [
  { name: "HTML", level: "Intermediate", color: "bg-orange-50", border: "border-orange-200/60", ink: "text-orange-800", icon: "html", rotateOffset: -1.5 },
  { name: "CSS", level: "Intermediate", color: "bg-sky-50", border: "border-sky-200/60", ink: "text-sky-800", icon: "css", rotateOffset: 1.2 },
  { name: "JavaScript", level: "Beginner", color: "bg-amber-50", border: "border-amber-200/60", ink: "text-amber-800", icon: "js", rotateOffset: -0.8 },
];

const learningSkills = [
  { name: "React", level: "Beginner", color: "bg-cyan-50", border: "border-cyan-200/60", ink: "text-cyan-800", icon: "react", rotateOffset: 1.5 },
  { name: "Python", level: "Beginner", color: "bg-blue-50", border: "border-blue-200/60", ink: "text-blue-800", icon: "python", rotateOffset: -1.2 },
  { name: "Java", level: "Beginner", color: "bg-purple-50", border: "border-purple-200/60", ink: "text-purple-800", icon: "java", rotateOffset: 0.8 },
  { name: "C / C++", level: "Beginner", color: "bg-emerald-50", border: "border-emerald-200/60", ink: "text-emerald-800", icon: "cpp", rotateOffset: -1.4 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink">
      <FloatingBackground />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState("Home");

  useEffect(() => {
    const sections = navItems.map(item => document.getElementById(item.toLowerCase()));
    
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // Trigger when section occupies center of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const capitalized = id.charAt(0).toUpperCase() + id.slice(1);
          setActiveItem(capitalized);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/30 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex min-h-20 w-[min(100%_-_1.5rem,1120px)] items-center justify-between gap-4">
        <a href="#home" className="group flex items-center gap-3 font-extrabold">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink/10 bg-white shadow-soft transition-transform group-hover:-rotate-6 group-hover:scale-105">
            SK
          </span>
          <span>Srajan</span>
        </a>

        <div 
          className="hidden items-center gap-1 rounded-full border border-white bg-white/80 p-2 shadow-soft md:flex"
          onMouseLeave={() => setHoveredItem(null)}
        >
          {navItems.map((item) => {
            const isSelected = hoveredItem ? (hoveredItem === item) : (activeItem === item);
            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onMouseEnter={() => setHoveredItem(item)}
                className={`relative rounded-full px-4 py-2 text-sm font-black transition-colors duration-300 ${
                  isSelected ? "text-ink" : "text-slate-500"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="headerHoverPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-skyPastel/75 -z-10"
                  />
                )}
                {item}
              </a>
            );
          })}
        </div>

        <CartoonButton
          href="#contact"
          className="hidden md:inline-flex min-h-0 py-3 px-6 text-sm font-extrabold"
        >
          Say Hello
        </CartoonButton>
      </nav>
      <div className="mx-auto flex w-[min(100%_-_1.5rem,1120px)] gap-2 overflow-x-auto pb-3 md:hidden">
        {navItems.map((item) => {
          const isActive = activeItem === item;
          return (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`shrink-0 rounded-full border-2 transition-all duration-200 px-4 py-2 text-sm font-black shadow-soft ${
                isActive 
                  ? "bg-skyPastel border-ink text-ink" 
                  : "bg-white/85 border-white text-slate-600"
              }`}
            >
              {item}
            </a>
          );
        })}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative isolate min-h-[calc(100vh_-_80px)] overflow-hidden py-16 sm:py-20">
      <div className="mx-auto grid w-[min(100%_-_1.5rem,1120px)] items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          <motion.p variants={fadeUp} className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-sky-600">
            Portfolio
          </motion.p>
          <motion.h1 variants={fadeUp} className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
            Srajan Kharvi
          </motion.h1>
          <motion.div variants={fadeUp} className="mt-6 text-xl font-extrabold text-slate-700 sm:text-2xl">
            <span className="typewriter inline-block max-w-full overflow-hidden whitespace-nowrap align-bottom">
              BCA Student | Aspiring Software Developer
            </span>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            A BCA student passionate about web development and building meaningful digital solutions. Always learning, growing, and excited to collaborate on impactful projects.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <CartoonButton href="#projects">View My Work</CartoonButton>
            <CartoonButton href="#contact" tone="light">Get In Touch</CartoonButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative z-10"
        >
          <img
            src="/developer-avatar.png"
            alt="Developer working on laptop"
            className="mx-auto h-auto w-full max-w-[540px] drop-shadow-[0_26px_35px_rgba(87,113,155,0.18)]"
          />
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Passionate developer committed to continuous learning.">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <MotionCard className="p-7 sm:p-9">
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              I'm a <span className="font-black text-ink">BCA Student</span> with a passion for technology and a curiosity for learning how things work behind the scenes.
            </p>
            <p>
              I enjoy building responsive and user-friendly <span className="font-black text-ink">Web Applications</span> using HTML, CSS, JavaScript, and modern web technologies. Creating projects that turn ideas into practical solutions is something I genuinely enjoy.
            </p>
            <p>
              Alongside web development, I'm actively exploring <span className="font-black text-ink">AI Integration</span> and learning how intelligent technologies can solve real-world problems. My goal is to grow into a skilled developer through <span className="font-black text-ink">Full Stack Learning</span> and hands-on experience.
            </p>
          </div>
        </MotionCard>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
        >
          <MiniInfo icon={<BookIcon />} title="Study" text="BCA student" />
          <MiniInfo icon={<LaptopIcon />} title="Build" text="Web projects" />
          <MiniInfo icon={<CodeIcon />} title="Practice" text="Coding skills" />
        </motion.div>
      </div>
    </Section>
  );
}

function HtmlIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <path
        d="M8 6h26l-3.5 24L21 36l-9.5-6L8 6z"
        fill="#FFD7BD"
        stroke="#27324A"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M21 12h-6.5l.5 5.5h6M21 22.5h-5l-.3-3"
        fill="none"
        stroke="#27324A"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12h6.5l-.6 6.5h-5.9M21 22.5h5l-.5-5.5"
        fill="none"
        stroke="#27324A"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CssIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <path
        d="M8 6h26l-3.5 24L21 36l-9.5-6L8 6z"
        fill="#BFE7FF"
        stroke="#27324A"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M26.5 12.5H15l.5 5h10.5l-1 9-3.5 3-3.5-3-.3-3"
        fill="none"
        stroke="#27324A"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function JsIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <rect x="6" y="6" width="30" height="30" rx="8" fill="#FFF2A8" stroke="#27324A" strokeWidth="3" />
      <path
        d="M17 22v6c0 1.5-1 2-2 2s-2-.5-2-1.5M23 22.5h2.5c1 0 1.5.5 1.5 1.5s-.5 1-1.5 1.5h-1c-1 .5-1.5 1-1.5 2s.5 1.5 1.5 1.5h3.5"
        fill="none"
        stroke="#27324A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <circle cx="21" cy="21" r="3" fill="#27324A" />
      <ellipse cx="21" cy="21" rx="14" ry="5.5" fill="none" stroke="#27324A" strokeWidth="2.5" transform="rotate(30 21 21)" />
      <ellipse cx="21" cy="21" rx="14" ry="5.5" fill="none" stroke="#27324A" strokeWidth="2.5" transform="rotate(90 21 21)" />
      <ellipse cx="21" cy="21" rx="14" ry="5.5" fill="none" stroke="#27324A" strokeWidth="2.5" transform="rotate(150 21 21)" />
    </svg>
  );
}

function PythonIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <path
        d="M21 5c-6 0-7 2-7 6v3h7v1.5h-9.5C9 15.5 7 17.5 7 21.5s2 6 5.5 6H14v-4c0-3 2.5-5.5 5.5-5.5H29v-3c0-4-1-10-8-10z"
        fill="#BFE7FF"
        stroke="#27324A"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M21 37c6 0 7-2 7-6v-3h-7v-1.5h9.5c2.5 0 4.5-2 4.5-6s-2-6-5.5-6H28v4c0 3-2.5 5.5-5.5 5.5H13v3c0 4 1 10 8 10z"
        fill="#FFF2A8"
        stroke="#27324A"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="10.5" r="1.5" fill="#27324A" />
      <circle cx="24.5" cy="31.5" r="1.5" fill="#27324A" />
    </svg>
  );
}

function JavaIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <path d="M16 11c1-3 3-3 4-5M21 11c1.5-2.5 3-2.5 4.5-5M26 13c1-2 2-2 3-4" stroke="#27324A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M12 18h18v9c0 4.5-3.5 8-8 8h-2c-4.5 0-8-3.5-8-8v-9z" fill="#FFD7BD" stroke="#27324A" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M30 20c3 0 5 1.5 5 4s-2 4-5 4" fill="none" stroke="#27324A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M9 37c0-2 6-3.5 12-3.5s12 1.5 12 3.5H9z" fill="#FFFFFF" stroke="#27324A" strokeWidth="2.8" strokeLinejoin="round" />
    </svg>
  );
}

function CppIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-8 w-8" aria-hidden="true">
      <path
        d="M20 13a8 8 0 1 0 0 16"
        fill="none"
        stroke="#27324A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M23 21h4M25 19v4M30 21h4M32 19v4" stroke="#27324A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SkillIcon({ type }) {
  switch (type) {
    case "html":
      return <HtmlIcon />;
    case "css":
      return <CssIcon />;
    case "js":
      return <JsIcon />;
    case "react":
      return <ReactIcon />;
    case "python":
      return <PythonIcon />;
    case "java":
      return <JavaIcon />;
    case "cpp":
      return <CppIcon />;
    default:
      return null;
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, borderColor: "#ffffff", boxShadow: "0 18px 45px rgba(87, 113, 155, 0.14)" },
  show: (delay) => ({
    opacity: 1,
    y: 0,
    borderColor: "#ffffff",
    boxShadow: "0 18px 45px rgba(87, 113, 155, 0.14)",
    transition: { duration: 0.45, delay, ease: "easeOut" }
  })
};

function SkillCard({ skill, delay }) {
  return (
    <motion.div
      variants={cardVariants}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{
        y: -10,
        rotate: skill.rotateOffset || 1,
        scale: 1.04,
        borderColor: "#27324a",
        boxShadow: "0 10px 0px #27324a"
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className="relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-white bg-white p-6 text-center shadow-soft"
    >
      <div className={`grid h-16 w-16 place-items-center rounded-2xl ${skill.color} border-2 ${skill.border} shadow-soft mb-4`}>
        <SkillIcon type={skill.icon} />
      </div>
      <h4 className="text-lg font-black text-ink">{skill.name}</h4>
      <span className={`mt-2 inline-block rounded-full px-3.5 py-1 text-xs font-black border-2 border-white/60 ${skill.color} ${skill.ink} shadow-sm`}>
        {skill.level}
      </span>
    </motion.div>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Technologies I work with and continue to develop.">
      <div className="space-y-12">
        {/* Proficient Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-black text-ink">Proficient</h3>
            <p className="text-sm font-bold text-slate-500">Technologies I use confidently to build web apps.</p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 max-w-4xl">
            {proficientSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} delay={index * 0.08} />
            ))}
          </div>
        </div>

        {/* Currently Learning Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-black text-ink">Currently Learning / Familiar With</h3>
            <p className="text-sm font-bold text-slate-500">Technologies I am actively exploring and practicing.</p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 max-w-4xl">
            {learningSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} delay={0.12 + index * 0.08} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Building solutions that make a difference.">
      <motion.article
        initial={{ opacity: 0, y: 36, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group grid overflow-hidden rounded-[2.2rem] border-2 border-white bg-white shadow-sticker lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-lemonPastel via-peachPastel to-skyPastel p-6 flex items-center justify-center">
          <img
            src="/future-map-preview.png"
            alt="Future Map project preview"
            className="h-full w-full object-contain rounded-2xl"
          />
        </div>
        <div className="relative p-7 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-600">Featured</p>
          <h3 className="mt-4 text-4xl font-black">Future Map</h3>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            AI-powered career guidance platform designed to help students explore career paths, discover learning roadmaps, and prepare for interviews with personalized recommendations.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Career paths", "AI - Mock Interviews", "Student focus"].map((item) => (
              <span key={item} className="rounded-2xl bg-skyPastel/45 px-4 py-3 text-center text-sm font-black text-slate-700">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CartoonButton href="https://github.com/srajankharvi/Future-Map" target="_blank" rel="noopener noreferrer">GitHub</CartoonButton>
            <CartoonButton href="https://future-map-xi.vercel.app" target="_blank" rel="noopener noreferrer" tone="light">View Project</CartoonButton>
          </div>
        </div>
      </motion.article>
    </Section>
  );
}

function Contact() {
  const mailtoLink = `mailto:srajankharvi.dev@gmail.com?subject=${encodeURIComponent("Portfolio Inquiry")}&body=${encodeURIComponent("Hi Srajan,\n\nI came across your portfolio and would like to connect with you.")}`;

  const socials = [
    { label: "GitHub", href: "https://github.com/srajankharvi", icon: <GitHubIcon /> },
    { label: "Instagram", href: "https://www.instagram.com/saju_kharvi_99/", icon: <InstagramIcon /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/srajan-kharvi-6aba9a3b8/", icon: <LinkedInIcon /> },
  ];

  return (
    <Section id="contact" eyebrow="Contact" title="Let's Connect">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="text-lg leading-8 text-slate-600">
          Have an opportunity, project idea, or just want to say hello? Feel free to reach out.
        </p>

        <CartoonButton href={mailtoLink} className="mt-6 gap-3 px-8 py-4 font-black">
          <EmailIcon />
          Email Me
        </CartoonButton>

        <div className="mt-6 flex items-center justify-center gap-4">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6, scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-white text-slate-600 shadow-soft transition hover:bg-skyPastel/55 hover:text-ink"
              aria-label={s.label}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="relative py-20 sm:py-24">
      <div className="mx-auto w-[min(100%_-_1.5rem,1120px)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-sky-600">{eyebrow}</p>
          <h2 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

const motionCardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    borderColor: "#ffffff",
    boxShadow: "0 18px 0 rgba(39, 50, 74, 0.05), 0 24px 54px rgba(87, 113, 155, 0.16)"
  },
  show: {
    opacity: 1,
    y: 0,
    borderColor: "#ffffff",
    boxShadow: "0 18px 0 rgba(39, 50, 74, 0.05), 0 24px 54px rgba(87, 113, 155, 0.16)",
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

function MotionCard({ children, className = "" }) {
  return (
    <motion.div
      variants={motionCardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -10,
        rotate: -0.5,
        scale: 1.01,
        borderColor: "#27324a",
        boxShadow: "0 12px 0px #27324a"
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className={`rounded-cartoon border-2 border-white bg-white shadow-sticker ${className}`}
    >
      {children}
    </motion.div>
  );
}

const miniInfoVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    borderColor: "#ffffff",
    boxShadow: "0 18px 45px rgba(87, 113, 155, 0.14)"
  },
  show: {
    opacity: 1,
    y: 0,
    borderColor: "#ffffff",
    boxShadow: "0 18px 45px rgba(87, 113, 155, 0.14)",
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function MiniInfo({ icon, title, text }) {
  return (
    <motion.div
      variants={miniInfoVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -8,
        scale: 1.03,
        borderColor: "#27324a",
        boxShadow: "0 10px 0px #27324a"
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className="rounded-3xl border-2 border-white bg-white p-5 shadow-soft"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-lemonPastel/75 shadow-soft">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="text-sm font-bold text-slate-500">{text}</p>
    </motion.div>
  );
}



function CartoonButton({ href, children, tone = "dark", target, rel, className = "", onClick }) {
  const baseClasses = "inline-flex min-h-14 items-center justify-center rounded-full px-7 text-center font-black border-2 transition-colors duration-200 cursor-pointer select-none";
  
  let toneClasses = "";
  let baseShadow = "0 4px 0px #27324a";
  let hoverShadow = "0 8px 0px #27324a";
  let activeShadow = "0 0px 0px #27324a";
  let hoverBg = "";
  let hoverTextColor = "#27324a";

  if (tone === "dark") {
    toneClasses = "bg-ink text-white border-ink";
    hoverBg = "#bfe7ff"; // skyPastel
  } else if (tone === "light") {
    toneClasses = "bg-white text-ink border-ink";
    hoverBg = "#fff2a8"; // lemonPastel
  }

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      initial={{
        y: 0,
        boxShadow: baseShadow,
        backgroundColor: tone === "dark" ? "#27324a" : "#ffffff",
        color: tone === "dark" ? "#ffffff" : "#27324a"
      }}
      whileHover={{
        y: -4,
        boxShadow: hoverShadow,
        backgroundColor: hoverBg,
        color: hoverTextColor
      }}
      whileTap={{
        y: 2,
        boxShadow: activeShadow,
        scale: 0.98
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20
      }}
      className={`${baseClasses} ${toneClasses} ${className}`}
    >
      {children}
    </motion.a>
  );
}

function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Hero Section Area */}
      <span className="cloud-shape left-[4%] top-[2%]" />
      <span className="cloud-shape right-[8%] top-[5%] scale-75" />
      <span className="blob-shape left-[12%] top-[14%] bg-mintPastel" />
      <span className="blob-shape right-[14%] top-[12%] bg-peachPastel" />
      <span className="star-shape left-[47%] top-[3%]" />
      <span className="star-shape right-[28%] top-[16%] scale-75" />

      {/* About Section Area */}
      <span className="cloud-shape right-[5%] top-[25%] scale-85" />
      <span className="star-shape left-[10%] top-[28%]" />
      <span className="blob-shape left-[5%] top-[34%] bg-lilacPastel scale-110" />
      <span className="cloud-shape left-[48%] top-[38%] scale-75" />

      {/* Skills Section Area */}
      <span className="cloud-shape left-[8%] top-[45%]" />
      <span className="star-shape right-[12%] top-[49%] scale-90" />
      <span className="blob-shape right-[6%] top-[55%] bg-lemonPastel" />
      <span className="star-shape left-[42%] top-[58%] scale-75" />

      {/* Projects Section Area */}
      <span className="cloud-shape right-[10%] top-[66%]" />
      <span className="star-shape left-[6%] top-[72%]" />
      <span className="blob-shape left-[15%] top-[78%] bg-peachPastel scale-110" />
      <span className="cloud-shape left-[50%] top-[80%] scale-75" />

      {/* Contact Section Area */}
      <span className="cloud-shape left-[4%] top-[88%]" />
      <span className="star-shape right-[8%] top-[91%]" />
      <span className="blob-shape right-[12%] top-[95%] bg-mintPastel" />
      <span className="star-shape left-[45%] top-[97%] scale-75" />
    </div>
  );
}

function DeveloperAvatar() {
  return (
    <div className="relative mx-auto max-w-[540px]">
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-4 z-20 hidden rounded-3xl border-2 border-white bg-white/95 p-4 shadow-sticker sm:block"
      >
        <div className="mb-3 flex gap-2">
          <span className="h-3 w-3 rounded-full bg-peachPastel" />
          <span className="h-3 w-3 rounded-full bg-lemonPastel" />
          <span className="h-3 w-3 rounded-full bg-mintPastel" />
        </div>
        <div className="grid gap-2">
          <span className="h-3 w-36 rounded-full bg-skyPastel" />
          <span className="h-3 w-28 rounded-full bg-mintPastel" />
          <span className="h-3 w-32 rounded-full bg-lilacPastel" />
        </div>
      </motion.div>

      <svg
        viewBox="0 0 540 470"
        className="relative z-10 h-auto w-full drop-shadow-[0_26px_35px_rgba(87,113,155,0.18)]"
        role="img"
        aria-labelledby="avatar-title"
      >
        <title id="avatar-title">Cartoon student developer with laptop</title>
        <path d="M88 405c47-40 315-42 365 0 22 19 10 42-26 48-77 13-251 13-318 0-36-7-44-30-21-48z" fill="#C8F6DD" />
        <path d="M116 110c30-58 96-83 162-64 79 22 128 90 130 168 2 76-50 148-132 163-82 15-162-26-196-95-27-55-13-123 36-172z" fill="#BFE7FF" opacity="0.55" />
        <path d="M128 178c-17 4-34 21-44 47-10 27-7 50 9 56 15 5 29-9 40-32 8-18 18-30 36-37l-41-34z" fill="#63B8FF" />
        <path d="M410 178c17 4 34 21 44 47 10 27 7 50-9 56-15 5-29-9-40-32-8-18-18-30-36-37l41-34z" fill="#A9D8FF" />
        <path d="M180 169c19-31 54-50 90-50 37 0 73 20 92 52 17 30 21 84 13 123H165c-9-42-3-93 15-125z" fill="#FFFFFF" />
        <path d="M186 170c32 31 128 31 165 0 21 19 31 60 28 99-65 30-153 29-219 0-2-40 6-79 26-99z" fill="#FFF2A8" />
        <circle cx="269" cy="104" r="48" fill="#FFD7BD" />
        <path d="M220 97c-1-37 32-67 73-58 34 8 52 38 42 67-28-17-69-20-115-9z" fill="#27324A" />
        <path d="M222 97c21-20 63-29 100-10 0 0-7 22-46 25-29 2-54-15-54-15z" fill="#27324A" />
        <circle cx="252" cy="107" r="5" fill="#27324A" />
        <circle cx="289" cy="107" r="5" fill="#27324A" />
        <path d="M255 132c10 8 23 8 34 0" fill="none" stroke="#27324A" strokeWidth="6" strokeLinecap="round" />
        <rect x="142" y="268" width="256" height="118" rx="28" fill="#27324A" />
        <rect x="165" y="294" width="210" height="58" rx="18" fill="#F9FCFF" />
        <path d="M220 323h101" stroke="#63B8FF" strokeWidth="11" strokeLinecap="round" />
        <path d="M114 392h310" stroke="#9EB5D1" strokeWidth="18" strokeLinecap="round" />
        <rect x="64" y="132" width="68" height="54" rx="19" fill="#FFFFFF" />
        <path d="M82 158h31M96 143v31" stroke="#63B8FF" strokeWidth="8" strokeLinecap="round" />
        <rect x="386" y="114" width="74" height="64" rx="22" fill="#FFFFFF" />
        <path d="M407 141h30M407 158h20" stroke="#A78BFA" strokeWidth="8" strokeLinecap="round" />
        <path d="M87 319l22-22 22 22-22 22-22-22z" fill="#FFF2A8" />
        <path d="M418 330c13-26 39-21 40 3 22-8 38 16 19 34h-74c-19-18-7-43 15-37z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

function ProjectFolder() {
  return (
    <motion.svg
      animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      viewBox="0 0 420 300"
      className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2"
      role="img"
      aria-labelledby="folder-title"
    >
      <title id="folder-title">Cartoon project folder illustration</title>
      <path d="M52 83c0-19 15-34 34-34h82c14 0 25 7 32 19l12 21h122c19 0 34 15 34 34v118c0 19-15 34-34 34H86c-19 0-34-15-34-34V83z" fill="#FFFFFF" />
      <path d="M52 121h316v120c0 19-15 34-34 34H86c-19 0-34-15-34-34V121z" fill="#63B8FF" />
      <path d="M88 154h244" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" opacity="0.55" />
      <path d="M102 198h78M214 198h92" stroke="#FFF2A8" strokeWidth="16" strokeLinecap="round" />
      <path d="M151 235h122" stroke="#C8F6DD" strokeWidth="16" strokeLinecap="round" />
      <circle cx="318" cy="79" r="26" fill="#FFD7BD" />
      <path d="M308 79h20M318 69v20" stroke="#27324A" strokeWidth="7" strokeLinecap="round" />
    </motion.svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-7 w-7" aria-hidden="true">
      <rect x="6" y="8" width="30" height="26" rx="8" fill="#C8F6DD" />
      <path
        d="M9 12c3 0 9-1 12-4 3 3 9 4 12 4v18c-3 0-9-1-12-4-3 3-9 4-12 4V12z"
        fill="#FFFFFF"
        stroke="#27324A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8v18"
        stroke="#27324A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M13 17h4M13 21h4M25 17h4M25 21h4"
        stroke="#27324A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-7 w-7" aria-hidden="true">
      <rect x="6" y="8" width="30" height="26" rx="8" fill="#BFE7FF" />
      <rect x="10" y="12" width="22" height="12" rx="2" fill="#FFFFFF" stroke="#27324A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M7 24h28l-3 4H10z" fill="#FFFFFF" stroke="#27324A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 16h8M14 20h12" stroke="#27324A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 42 42" className="h-7 w-7" aria-hidden="true">
      <rect x="6" y="8" width="30" height="26" rx="8" fill="#DFD4FF" />
      <rect x="10" y="12" width="22" height="18" rx="3" fill="#FFFFFF" stroke="#27324A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M10 18h22" stroke="#27324A" strokeWidth="2.5" />
      <circle cx="14" cy="15" r="1.2" fill="#27324A" />
      <circle cx="18" cy="15" r="1.2" fill="#27324A" />
      <circle cx="22" cy="15" r="1.2" fill="#27324A" />
      <path d="M14 22.5l3 2.5-3 2.5M19 27.5h4" stroke="#27324A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.83 0-9.74h3.554v1.379c-.009.015-.021.029-.033.042h.033v-.042c.431-.665 1.199-1.61 2.919-1.61 2.135 0 3.735 1.39 3.735 4.377v5.594zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.956.77-1.71 1.951-1.71 1.18 0 1.914.754 1.939 1.71 0 .951-.759 1.71-1.975 1.71zm1.581 11.597H3.754V9.567h3.164v10.885zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white bg-white/70 px-6 py-8 text-center text-sm font-bold text-slate-500">
      <p>Created on 2026, Developed and Designed by Srajan</p>
    </footer>
  );
}

export default App;
