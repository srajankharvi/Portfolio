import { useEffect, useState } from "react";

export default function Background() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function handleMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function animate() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMousePos({ x: currentX, y: currentY });
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
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Grid pattern */}
      <div className="grid-pattern" />

      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-left blue glow */}
        <div
          className="absolute -left-[20%] -top-[10%] h-[600px] w-[600px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          }}
        />
        {/* Bottom-right purple glow */}
        <div
          className="absolute -bottom-[15%] -right-[15%] h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          }}
        />
        {/* Center subtle glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Cursor spotlight */}
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
