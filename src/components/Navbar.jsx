import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { navItems } from "../data/content";
import { MenuIcon, XIcon } from "./Icons";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrollingRef = useRef(false);
  const { scrollY } = useScroll();

  // Add a subtle border when scrolled
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Intersection observer for active section
  useEffect(() => {
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

    const observeSections = () => {
      navItems.forEach((item) => {
        const el = document.getElementById(item.toLowerCase());
        if (el) observer.observe(el);
      });
    };

    observeSections();

    // Use MutationObserver to catch lazily loaded sections
    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
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
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-colors duration-300 ${
          isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/[0.04]" : "bg-transparent"
        }`}
      >
        <div className="flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-12 lg:py-6">
          {/* Minimalist Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "home")}
            className="font-heading text-lg font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
          >
            SRAJAN
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-10 lg:flex"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {navItems.map((item) => {
              const isActive = activeItem === item;
              const isHovered = hoveredItem === item;
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, item.toLowerCase())}
                  onMouseEnter={() => setHoveredItem(item)}
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive || isHovered ? "text-white" : "text-[#7A7A7A]"
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </nav>

          {/* Mobile Toggle Button */}
          <button
            className="flex h-10 w-10 items-center justify-center text-[#7A7A7A] transition-colors hover:text-white lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 top-full w-full bg-black/95 px-6 pb-8 pt-4 backdrop-blur-xl border-b border-white/[0.04] lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => scrollToSection(e, item.toLowerCase())}
                    className={`text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                      activeItem === item ? "text-white" : "text-[#7A7A7A]"
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
