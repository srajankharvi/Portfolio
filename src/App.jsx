import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden bg-bg text-primary selection:bg-accent/30 selection:text-white">
        <ScrollProgress />
        <Background />
        <Navbar />

        <main className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Certifications />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
