import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Handle anchor clicks for smooth scrolling
    function handleAnchorClick(e) {
      const target = e.target.closest("a[href^='#']");
      if (!target) return;
      const id = target.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80, duration: 1.2 });
      }
    }
    document.addEventListener("click", handleAnchorClick);

    // RAF loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return children;
}
