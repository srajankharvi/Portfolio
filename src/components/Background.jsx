import { useEffect, useState } from "react";

export default function Background() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [normalizedPos, setNormalizedPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    function handleMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function animate() {
      // Smooth lerp for liquid-smooth cursor-reactive motion
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      const normX = (currentX / window.innerWidth - 0.5) * 2;
      const normY = (currentY / window.innerHeight - 0.5) * 2;

      setMousePos({ x: currentX, y: currentY });
      setNormalizedPos({ x: normX, y: normY });

      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Texture noise overlay */}
      <div className="noise-overlay" />

      {/* Base subtle grid pattern */}
      <div className="grid-pattern" />

      {/* Dynamic Cursor-illuminated Interactive Grid Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
          opacity: 0.8,
        }}
      />

      {/* Mouse-reactive motion ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-left blue glow - moves smoothly with cursor motion */}
        <div
          className="absolute -left-[15%] -top-[10%] h-[750px] w-[750px] rounded-full opacity-[0.09] transition-transform duration-700 ease-out"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            transform: `translate3d(${normalizedPos.x * 45}px, ${normalizedPos.y * 45}px, 0)`,
          }}
        />

        {/* Bottom-right purple glow - parallax shift opposite to cursor */}
        <div
          className="absolute -bottom-[20%] -right-[15%] h-[700px] w-[700px] rounded-full opacity-[0.07] transition-transform duration-700 ease-out"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            transform: `translate3d(${normalizedPos.x * -55}px, ${normalizedPos.y * -55}px, 0)`,
          }}
        />

        {/* Center cyan accent aura */}
        <div
          className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] transition-transform duration-1000 ease-out"
          style={{
            background: "radial-gradient(circle, #06B6D4 0%, transparent 65%)",
            transform: `translate3d(${normalizedPos.x * -25}px, ${normalizedPos.y * -25}px, 0)`,
          }}
        />
      </div>

      {/* Main Cursor Spotlight following mouse movement */}
      <div
        className="cursor-spotlight hidden lg:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
      />
    </>
  );
}
