import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import StarfieldButton from "./StarfieldButton";
import ParticleText from "./originkit/ui/pixeldrift";

const Hero = React.memo(function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0 });

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex h-[100dvh] min-h-[700px] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Pure black background is set on the section via bg-black */}

      {/* Layer 1: Giant Typography */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full h-[30vw] max-h-[400px] min-h-[150px] pointer-events-auto"
        >
          {isInView && (
            <ParticleText
              text="PORTFOLIO"
              colors={["#FFFFFF", "#D1D1D1", "#9A9A9A", "#4A4A4A"]}
              mode="onEnter"
              replay={false}
              position="middle"
              particleSize={10}
              particleCount={40}
              mouseEnabled={true}
              mouseRadius={80}
              mouseForce={20}
              fontSize={300}
              autoFit={true}
              transition={{ type: "tween", duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ minWidth: "100%", minHeight: "100%", width: "100%", height: "100%" }}
            />
          )}
        </motion.div>
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
            src="/Srajan_Developer.webp"
            alt="Srajan - Developer"
            width="1086"
            height="1448"
            loading="eager"
            fetchpriority="high"
            className="w-full h-auto object-cover object-top mask-portrait"
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
          <StarfieldButton link="#contact" label="CONTACT" />
        </motion.div>
      </div>

      {/* Fog effect at the bottom for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30"></div>

    </section>
  );
});

export default Hero;
