import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import Section from "./Section";
import SkillMarquee from "./SkillMarquee";
import { categorizedSkills } from "../data/content";
import { techIconMap, CodeBracketIcon } from "./Icons";

/* ═══════════════════════════════════════════
   BADGE COLORS
   ═══════════════════════════════════════════ */
const levelStyles = {
  Proficient: {
    bg: "rgba(59, 130, 246, 0.12)",
    text: "#3B82F6",
    border: "rgba(59, 130, 246, 0.25)",
    glowRgb: "59, 130, 246",
  },
  Intermediate: {
    bg: "rgba(168, 85, 247, 0.12)",
    text: "#C084FC",
    border: "rgba(168, 85, 247, 0.25)",
    glowRgb: "192, 132, 252",
  },
  Advanced: {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34D399",
    border: "rgba(16, 185, 129, 0.25)",
    glowRgb: "52, 211, 153",
  },
  Beginner: {
    bg: "rgba(245, 158, 11, 0.12)",
    text: "#FBBF24",
    border: "rgba(245, 158, 11, 0.25)",
    glowRgb: "251, 191, 36",
  },
  Familiar: {
    bg: "rgba(255, 255, 255, 0.05)",
    text: "#A1A1AA",
    border: "rgba(255, 255, 255, 0.1)",
    glowRgb: "161, 161, 170",
  },
};

/* ═══════════════════════════════════════════
   FLATTEN SKILLS (category-grouped order)
   ═══════════════════════════════════════════ */
const allSkills = categorizedSkills.flatMap((section) =>
  section.skills.map((skill) => ({
    ...skill,
    category: section.categoryTitle.replace(" Development", ""),
  }))
);

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const CARD_WIDTH = 280;
const CARD_HEIGHT = 200;
const CARD_GAP = 4;
const TOTAL = allSkills.length;
const CLONE_COUNT = 6; // cards cloned on each side for seamless loop
const STRIP_ITEM_WIDTH = CARD_WIDTH + CARD_GAP;
const AUTO_SPEED = 0.80; // px per frame (~48px/sec at 60fps)
const SNAP_EASE = (t) => 1 - Math.pow(1 - t, 4); // smooth ease-out quartic
const MOMENTUM_FRICTION = 0.94;

/* ═══════════════════════════════════════════
   STARFIELD (static, generated once)
   ═══════════════════════════════════════════ */
function generateStars(count = 120) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.4,
      opacity: 0.03 + Math.random() * 0.12, // Reduced opacity for pure black background
    });
  }
  return stars;
}

const staticStars = generateStars();

/* ═══════════════════════════════════════════
   SKILL CARD COMPONENT
   ═══════════════════════════════════════════ */
function SkillCard({ skill, isFocusable = true }) {
  const Icon = techIconMap[skill.name] || CodeBracketIcon;
  const levelConfig = levelStyles[skill.level] || levelStyles.Beginner;

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden p-5"
      data-glow={levelConfig.glowRgb}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        // Charcoal base fill (contrast against pure black page)
        // Stronger top-light bevel border (0.25 opacity)
        background: `
          linear-gradient(180deg, #1c1d24 0%, #111216 100%) padding-box,
          linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.02) 100%) border-box
        `,
        border: "1px solid transparent",
        borderRadius: 18,
        flexShrink: 0,
      }}
      tabIndex={isFocusable ? 0 : -1}
      role="group"
      aria-label={`${skill.name} — ${skill.level} — ${skill.category}`}
    >
      {/* Soft matte sheen highlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 18,
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Icon Chip - distinct inset panel */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            boxShadow:
              "inset 0 1px 4px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 1px 0 rgba(255, 255, 255, 0.05)",
            color: "#60A5FA", // subtle blue tint matching brand
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Proficiency Badge */}
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: levelConfig.bg,
            color: levelConfig.text,
            border: `1px solid ${levelConfig.border}`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            lineHeight: 1,
            height: "max-content", // Consistent height
          }}
        >
          {skill.level}
        </span>
      </div>

      <div className="relative z-10 mt-auto">
        <h4 className="font-heading text-lg font-bold text-white leading-tight">
          {skill.name}
        </h4>
        <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#8C93A8]">
          {skill.category}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN SKILLS COMPONENT
   ═══════════════════════════════════════════ */
export default function Skills() {
  const stripRef = useRef(null);
  const viewportRef = useRef(null);
  const rafRef = useRef(null);

  // Carousel physics state — all in a ref to avoid re-renders
  const state = useRef({
    x: 0, // current translateX
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartScrollX: 0,
    lastDragX: 0,
    lastDragTime: 0,
    isHovering: false,
    isSnapping: false,
    snapFrom: 0,
    snapTo: 0,
    snapProgress: 0,
    snapDuration: 600, // ms
    snapStartTime: 0,
    autoAdvance: true,
    settled: false,
    isIntersecting: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Build the extended card array (clones on each side for infinite loop)
  const extendedSkills = useMemo(() => {
    const clonesBefore = allSkills.slice(-CLONE_COUNT);
    const clonesAfter = allSkills.slice(0, CLONE_COUNT);
    return [...clonesBefore, ...allSkills, ...clonesAfter];
  }, []);

  // The "real" range starts at index CLONE_COUNT
  const realStartOffset = CLONE_COUNT * STRIP_ITEM_WIDTH;

  // Center the strip on card index 0 initially
  const getCardCenterX = useCallback(
    (index) => {
      // Position of the center of the card at `index` within the extended strip
      const extendedIndex = CLONE_COUNT + index;
      return extendedIndex * STRIP_ITEM_WIDTH + CARD_WIDTH / 2;
    },
    []
  );

  const getViewportCenter = useCallback(() => {
    if (!viewportRef.current) return 0;
    return viewportRef.current.offsetWidth / 2;
  }, []);

  // Given current x, which real card index is nearest center?
  const getNearestIndex = useCallback(
    (x) => {
      const vc = getViewportCenter();
      // The center of card i (in extended coords) is at (CLONE_COUNT + i) * STRIP_ITEM_WIDTH + CARD_WIDTH/2
      // It appears at screen position: (CLONE_COUNT + i) * STRIP_ITEM_WIDTH + CARD_WIDTH/2 + x
      // We want this to equal vc
      // So: i = (vc - x - CARD_WIDTH/2) / STRIP_ITEM_WIDTH - CLONE_COUNT
      const rawIndex =
        (vc - x - CARD_WIDTH / 2) / STRIP_ITEM_WIDTH - CLONE_COUNT;
      let idx = Math.round(rawIndex);
      // Wrap to [0, TOTAL)
      idx = ((idx % TOTAL) + TOTAL) % TOTAL;
      return idx;
    },
    [getViewportCenter]
  );

  // X position to center a real card index
  const getXForIndex = useCallback(
    (index) => {
      const vc = getViewportCenter();
      return vc - getCardCenterX(index);
    },
    [getViewportCenter, getCardCenterX]
  );

  // Wrap x using a stable modulo so the strip loops seamlessly without conditional boundary flip-flopping
  const wrapX = useCallback(
    (x) => {
      const totalRealWidth = TOTAL * STRIP_ITEM_WIDTH;
      const vc = getViewportCenter();
      
      // c_x is the point in the strip that is currently at the center of the viewport
      const c_x = vc - x;
      
      // Map c_x into the bounds of [realStartOffset, realStartOffset + totalRealWidth) using stable modulo
      const wrapped_c_x = realStartOffset + (((c_x - realStartOffset) % totalRealWidth) + totalRealWidth) % totalRealWidth;
      
      return vc - wrapped_c_x;
    },
    [getViewportCenter]
  );

  const cardEls = useRef([]);
  const updateCardVisuals = useCallback(
    (x) => {
      const vc = getViewportCenter();
      const vw = viewportRef.current ? viewportRef.current.offsetWidth : 1536;

      cardEls.current.forEach((el) => {
        if (!el) return;
        const cardContainer = el;
        const cardLeft = cardContainer.offsetLeft + x;
        const cardCenter = cardLeft + CARD_WIDTH / 2;
        const distFromCenter = Math.abs(cardCenter - vc);
        // Signed distance for rotation direction
        const signedDist = cardCenter - vc;

        // ── Focus falloff (unchanged) ──
        const falloff = STRIP_ITEM_WIDTH * 1.1;
        const t = Math.max(0, Math.min(1, 1 - distFromCenter / falloff));
        const smoothT = t * t * (3 - 2 * t); // smoothstep

        // Opacity: center = 1, far = 0.4
        const opacity = 0.4 + smoothT * 0.6;
        // Scale: center = 1, far = 0.96
        const scale = 0.96 + smoothT * 0.04;
        // Brightness: center = 1, far = 0.55
        const brightness = 0.55 + smoothT * 0.45;

        // ── 3D Coverflow Perspective (Fix 1) ──
        // Normalize distance across half the viewport for smooth interpolation
        const norm = Math.min(distFromCenter / (vw * 0.5), 1.2);
        
        // Z rotation (removed) -> Y rotation (3D tilt)
        // Max angle ~32 degrees at the edges. Left cards tilt right edge forward (positive rotateY), right cards tilt left edge forward (negative rotateY).
        const maxAngle = 32;
        const normalizedSigned = Math.max(-1.2, Math.min(1.2, signedDist / (vw * 0.5)));
        const rotateY = -normalizedSigned * maxAngle;
        
        // Z translation: center = 0, edges = pushed back ~25px
        const translateZ = -norm * 25;
        
        // Vertical Arc (Parabola): center = 0, edges = drop ~50px down
        const translateY = norm * norm * 50;

        // ── Soft Colored Under-Glow (Replaces contact shadow) ──
        // Read the per-card badge color passed via data-glow
        const glowRgb = cardContainer.dataset.glow || "59, 130, 246";
        const glowBlur = 40 + smoothT * 40; // 40–80px soft bleed
        const glowY = 10 + smoothT * 10; // offset down slightly
        const glowAlpha = 0.02 + smoothT * 0.10; // very low opacity (0.02-0.12)

        // ── Apply all transforms as one composite ──
        cardContainer.style.opacity = opacity;
        cardContainer.style.transform = `scale(${scale}) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
        cardContainer.style.filter = `brightness(${brightness}) drop-shadow(0px ${glowY.toFixed(0)}px ${glowBlur.toFixed(0)}px rgba(${glowRgb}, ${glowAlpha.toFixed(2)}))`;
      });
    },
    [getViewportCenter]
  );

  const startSnap = useCallback(
    (index) => {
      const s = state.current;
      s.isSnapping = true;
      s.snapFrom = s.x;

      const currentRenderedX = wrapX(s.x);
      const targetRenderedX = getXForIndex(index);
      const totalRealWidth = TOTAL * STRIP_ITEM_WIDTH;
      
      let diff = targetRenderedX - currentRenderedX;
      // Choose the shortest path (wrapping)
      if (Math.abs(diff) > totalRealWidth / 2) {
        if (diff > 0) diff -= totalRealWidth;
        else diff += totalRealWidth;
      }
      
      s.snapTo = s.x + diff;

      s.snapStartTime = performance.now();
      s.snapDuration = 500 + Math.min(Math.abs(diff) * 0.5, 400);
    },
    [getXForIndex, wrapX]
  );

  // Reduced motion check
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Intersection Observer to pause animation when off-screen
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          state.current.isIntersecting = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initialize position
  useEffect(() => {
    state.current.x = getXForIndex(0);
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(${state.current.x}px, 0, 0)`;
    }
  }, [getXForIndex]);

  // Main animation loop
  useEffect(() => {
    if (prefersReducedMotion) {
      // Just place it statically centered on card 0
      if (stripRef.current) {
        stripRef.current.style.transform = `translate3d(${getXForIndex(0)}px, 0, 0)`;
      }
      return;
    }

    let prevTime = performance.now();

    const loop = (now) => {
      const s = state.current;
      
      // Pause updates if not intersecting
      if (!s.isIntersecting) {
        prevTime = now;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(now - prevTime, 32); // cap at ~30fps minimum
      prevTime = now;

      if (s.isSnapping) {
        // Snap animation
        const elapsed = now - s.snapStartTime;
        const t = Math.min(elapsed / s.snapDuration, 1);
        const eased = SNAP_EASE(t);
        s.x = s.snapFrom + (s.snapTo - s.snapFrom) * eased;
        if (t >= 1) {
          s.isSnapping = false;
          s.x = s.snapTo;
          s.velocity = 0;
        }
      } else if (s.isDragging) {
        // Drag is handled directly in pointer events
      } else if (Math.abs(s.velocity) > 0.15) {
        // Momentum decay
        s.x += s.velocity;
        s.velocity *= MOMENTUM_FRICTION;
        // When velocity is low enough, snap to nearest
        if (Math.abs(s.velocity) < 0.5) {
          s.velocity = 0;
          startSnap(getNearestIndex(wrapX(s.x)));
        }
      } else if (s.autoAdvance && !s.isHovering) {
        // Auto advance
        s.x -= AUTO_SPEED;
      }

      // Canonical position is s.x. Compute wrapped position for rendering this frame.
      const renderedX = wrapX(s.x);

      // Apply transform
      if (stripRef.current) {
        stripRef.current.style.transform = `translate3d(${renderedX}px, 0, 0)`;
      }

      // Update active index
      const newIdx = getNearestIndex(renderedX);
      setActiveIndex((prev) => (prev !== newIdx ? newIdx : prev));

      // Update per-card visuals
      updateCardVisuals(renderedX);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReducedMotion, getNearestIndex, wrapX, getXForIndex, startSnap]);

  /* ─── Pointer / Touch Events ─── */
  const handlePointerDown = useCallback(
    (e) => {
      if (prefersReducedMotion) return;
      const s = state.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.velocity = 0;
      s.dragStartX = e.clientX || e.touches?.[0]?.clientX || 0;
      s.dragStartScrollX = s.x;
      s.lastDragX = s.dragStartX;
      s.lastDragTime = performance.now();

      if (stripRef.current) stripRef.current.style.willChange = "transform";
      // Change cursor
      if (viewportRef.current) viewportRef.current.style.cursor = "grabbing";
    },
    [prefersReducedMotion]
  );

  const handlePointerMove = useCallback(
    (e) => {
      const s = state.current;
      if (!s.isDragging) return;
      e.preventDefault();
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const dx = clientX - s.dragStartX;
      s.x = s.dragStartScrollX + dx;

      // Track velocity
      const now = performance.now();
      const dt = now - s.lastDragTime;
      if (dt > 0) {
        s.velocity = (clientX - s.lastDragX) / Math.max(dt, 1) * 16; // normalize to ~px/frame
      }
      s.lastDragX = clientX;
      s.lastDragTime = now;
    },
    []
  );

  const handlePointerUp = useCallback(
    () => {
      const s = state.current;
      if (!s.isDragging) return;
      s.isDragging = false;
      if (viewportRef.current) viewportRef.current.style.cursor = "grab";

      // If velocity is very low, snap immediately
      if (Math.abs(s.velocity) < 1.5) {
        s.velocity = 0;
        startSnap(getNearestIndex(wrapX(s.x)));
      }
      // Otherwise let momentum carry and the loop will snap when it slows
    },
    [startSnap, getNearestIndex, wrapX]
  );

  // Mouse enter/leave for auto-advance pause
  const handleMouseEnter = useCallback(() => {
    state.current.isHovering = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    state.current.isHovering = false;
    if (state.current.isDragging) {
      handlePointerUp();
    }
  }, [handlePointerUp]);

  // Pagination dot click
  const handleDotClick = useCallback(
    (index) => {
      if (prefersReducedMotion) {
        state.current.x = getXForIndex(index);
        if (stripRef.current) {
          stripRef.current.style.transform = `translate3d(${state.current.x}px, 0, 0)`;
        }
        setActiveIndex(index);
        return;
      }
      state.current.velocity = 0;
      state.current.isDragging = false;
      startSnap(index);
    },
    [prefersReducedMotion, startSnap, getXForIndex]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (activeIndex + 1) % TOTAL;
        handleDotClick(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (activeIndex - 1 + TOTAL) % TOTAL;
        handleDotClick(prev);
      }
    },
    [activeIndex, handleDotClick]
  );

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "#000000" }}
    >
      {/* ─── Starfield Background ─── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {staticStars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: `rgba(180, 200, 255, ${star.opacity})`,
            }}
          />
        ))}
      </div>

      {/* ─── Section Header (static, never moves) ─── */}
      <div className="relative z-10 mx-auto mb-16 w-[min(100%-2rem,1200px)]">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#60A5FA]">
          Skills
        </p>
        <h2 className="max-w-2xl font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Technical Stack
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#B3B3B3]">
          Technologies, languages, and software development tools I work with.
        </p>
      </div>

      {/* ─── Carousel Viewport ─── */}
      <div
        ref={viewportRef}
        className="relative z-10 select-none overflow-hidden mx-auto"
        style={{
          cursor: "grab",
          touchAction: "pan-y",
          width: "100%",
          maxWidth: "100vw",
          perspective: "1200px", // 3D Camera for Coverflow
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Skills carousel"
        aria-roledescription="carousel"
      >
        {/* Strip */}
        <div
          ref={stripRef}
          className="flex items-start"
          style={{
            gap: CARD_GAP,
            willChange: "transform",
            transformStyle: "preserve-3d", // Let children exist in 3D space
          }}
        >
          {extendedSkills.map((skill, i) => {
            const isClone =
              i < CLONE_COUNT || i >= CLONE_COUNT + TOTAL;
            return (
              <div
                key={`${skill.name}-${i}`}
                ref={(el) => {
                  cardEls.current[i] = el;
                }}
                className="flex flex-col items-center"
                style={{
                  flexShrink: 0,
                  width: CARD_WIDTH,
                  transformStyle: "preserve-3d", // Ensure label and reflection inherit tilt correctly
                }}
              >


                {/* The card */}
                <SkillCard skill={skill} isFocusable={!isClone} />

                {/* Mirror reflection */}
                <div
                  className="pointer-events-none overflow-hidden"
                  aria-hidden="true"
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT * 0.6,
                    marginTop: 2,
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 50%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 50%)",
                  }}
                >
                  <div
                    style={{
                      transform: "scaleY(-1)",
                      transformOrigin: "bottom center",
                      opacity: 0.45,
                      marginTop: -CARD_HEIGHT,
                    }}
                  >
                    <SkillCard skill={skill} isFocusable={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Counter + Title + Dots ─── */}
      <div className="relative z-10 mx-auto mt-12 flex w-[min(100%-2rem,1200px)] flex-col items-center gap-4">

        {/* Pagination dots */}
        <div
          className="mt-2 flex items-center gap-2"
          role="tablist"
          aria-label="Skill cards"
        >
          {allSkills.map((skill, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={skill.name}
                onClick={() => handleDotClick(i)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${skill.name}`}
                aria-current={isActive ? "true" : undefined}
                className="rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
                style={{
                  width: isActive ? 28 : 8,
                  height: 8,
                  background: isActive
                    ? "#3B82F6"
                    : "rgba(255, 255, 255, 0.18)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ─── Skill Marquee ─── */}
      <div className="relative z-10 mx-auto mt-16 w-[min(100%-2rem,1200px)]">
        <SkillMarquee />
      </div>
    </section>
  );
}
