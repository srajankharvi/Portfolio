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
            backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #E2E2E2 40%, #A0A0A0 100%)",
            backgroundClip: "text",
            filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.5))"
          }}
          className="font-heading text-[18vw] sm:text-[20vw] lg:text-[21.5vw] xl:text-[22.5vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap text-center select-none"
        >
          SRAJAN
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

      {/* Layer 3: Small UI Elements (Bottom Left & Right) */}
      <div className="absolute bottom-0 left-0 z-30 flex w-full justify-between p-6 pb-10 lg:p-12 lg:pb-16 pointer-events-none">
        
        {/* Subtitle - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          className="flex items-end z-40 relative"
        >
          <h2 className="font-sans text-sm font-medium uppercase tracking-[0.25em] text-[#A3A3A3] lg:text-base">
            Developer
          </h2>
        </motion.div>

        {/* Interaction Buttons - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          className="flex items-end pointer-events-auto mr-4 lg:mr-[8vw]"
        >
          <a
            href="#contact"
            className="group flex h-12 items-center justify-center rounded-full border border-white/20 bg-black/40 px-8 backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:scale-105"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-white">Contact</span>
          </a>
        </motion.div>
      </div>

      {/* Fog effect at the bottom for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30"></div>

    </section>
  );
}
