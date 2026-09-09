import { motion } from "framer-motion";

export default function Hero() {

  return (
    <section
      id="home"
      className="relative flex h-[100dvh] min-h-[700px] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Pure black background is set on the section via bg-black */}

      {/* Layer 1: Giant Typography */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            WebkitTextFillColor: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #D1D1D1 45%, #4A4A4A 100%)",
            filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.8))"
          }}
          className="font-heading text-[13vw] sm:text-[15vw] lg:text-[16.5vw] xl:text-[17.5vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap text-center select-none"
        >
          PORTFOLIO
        </motion.h1>
      </div>

      {/* Layer 2: Portrait Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="absolute bottom-0 z-20 flex w-full justify-center pointer-events-none"
      >
        <div className="relative w-[80vw] max-w-[650px]">
          {/* Subtle cinematic lighting behind the subject */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[50px]"></div>
          
          <img
            src="/Srajan_Developer.png"
            alt="Srajan - Developer"
            className="w-full h-auto object-cover object-top mask-portrait drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            style={{ 
              maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)' 
            }}
          />
        </div>
      </motion.div>

      {/* Layer 3: Small UI Elements (Top Left & Right) */}
      
      {/* Subtitle - Lower Left (Below large background text) */}
      <div className="absolute bottom-0 left-0 z-40 flex p-6 pb-10 lg:p-12 lg:pb-16 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          className="flex items-end z-50 relative"
        >
          <h2 className="font-sans text-sm font-medium uppercase tracking-[0.25em] text-[#FFFFFF] lg:text-base drop-shadow-md">
            Developer
          </h2>
        </motion.div>
      </div>

      {/* Interaction Buttons - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-40 flex justify-end w-full p-6 pb-10 lg:p-12 lg:pb-16 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          className="flex items-end pointer-events-auto mr-4 lg:mr-[8vw]"
        >
          <a
            href="#contact"
            style={{ fontFamily: "inherit" }}
            className="group relative flex h-12 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111111] px-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_8px_16px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:border-[#444444] hover:bg-[#161616] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_0_20px_rgba(255,255,255,0.1)] active:scale-95 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]"
          >
            <div className="flex text-xs font-semibold uppercase tracking-widest text-[#E5E5E5]">
              {"CONTACT".split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-1"
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </a>
        </motion.div>
      </div>

      {/* Fog effect at the bottom for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30"></div>

    </section>
  );
}
