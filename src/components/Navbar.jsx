import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { navItems } from "../data/content";
import { MenuIcon, XIcon } from "./Icons";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrollingRef = useRef(false);
  const { scrollY } = useScroll();

  // Shrink navbar on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Intersection observer for active section
  useEffect(() => {
    const sections = navItems.map((item) =>
      document.getElementById(item.toLowerCase())
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveItem(id.charAt(0).toUpperCase() + id.slice(1));
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => s && observer.observe(s));
    return () => sections.forEach((s) => s && observer.unobserve(s));
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;

    isScrollingRef.current = true;
    const label = navItems.find((i) => i.toLowerCase() === sectionId) || sectionId;
    setActiveItem(label);
    setIsMobileOpen(false);

    requestAnimationFrame(() => {
      const headerH = document.querySelector("header")?.offsetHeight || 80;
      const top = section.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      window.history.replaceState(null, "", `#${sectionId}`);
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <motion.nav
          animate={{
            padding: isScrolled ? "0.5rem 1rem" : "0.625rem 1.25rem",
          }}
          transition={{ duration: 0.3 }}
          className="glass flex w-full max-w-3xl items-center justify-between rounded-2xl"
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "home")}
            className="flex items-center gap-2.5 font-heading text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
              SK
            </span>
            <span className="hidden sm:inline">Srajan</span>
          </a>

          {/* Desktop nav */}
          <div
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {navItems.map((item) => {
              const isActive = hoveredItem
                ? hoveredItem === item
                : activeItem === item;
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, item.toLowerCase())}
                  onMouseEnter={() => setHoveredItem(item)}
                  className={`relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted hover:text-secondary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navPill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06]"
                    />
                  )}
                  {item}
                </a>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:text-primary lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass absolute left-4 right-4 top-full mt-2 rounded-2xl p-4 lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => scrollToSection(e, item.toLowerCase())}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      activeItem === item
                        ? "bg-white/[0.06] text-primary"
                        : "text-muted hover:text-secondary"
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
