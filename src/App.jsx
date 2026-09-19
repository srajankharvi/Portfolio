import React, { Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import ParticleTether from "./components/originkit/ui/particle-tether";

const Skills = React.lazy(() => import("./components/Skills"));
const Certifications = React.lazy(() => import("./components/Certifications"));
const Projects = React.lazy(() => import("./components/Projects"));
const Contact = React.lazy(() => import("./components/Contact"));
const Footer = React.lazy(() => import("./components/Footer"));

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force scroll to top on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden bg-black text-primary selection:bg-accent/30 selection:text-white">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
            >
              <div className="w-64 h-64 sm:w-[400px] sm:h-[400px]">
                <ParticleTether dotColor="#E5E7EB" />
              </div>
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                className="mt-6 flex flex-col items-center gap-3 relative z-10"
              >
                <h1 className="font-heading text-2xl font-bold tracking-[0.25em] uppercase sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 text-center px-4">
                  Welcome To Portfolio
                </h1>
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.5 }}
                  transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                  className="h-[1px] w-32 sm:w-48 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global noise overlay */}
        <div className="noise-overlay" />

        <Navbar />

        <main className="relative z-10">
          <Hero />
          <About />
          <Suspense fallback={<div className="flex h-40 items-center justify-center text-secondary">Loading...</div>}>
            <Skills />
            <Certifications />
            <Projects />
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </SmoothScroll>
  );
}
