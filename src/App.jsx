import React, { Suspense } from 'react';
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";

const Skills = React.lazy(() => import("./components/Skills"));
const Certifications = React.lazy(() => import("./components/Certifications"));
const Projects = React.lazy(() => import("./components/Projects"));
const Contact = React.lazy(() => import("./components/Contact"));
const Footer = React.lazy(() => import("./components/Footer"));

export default function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden bg-black text-primary selection:bg-accent/30 selection:text-white">
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
