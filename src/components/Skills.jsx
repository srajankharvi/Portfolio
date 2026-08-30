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
    text: "#60A5FA",
    border: "rgba(59, 130, 246, 0.25)",
  },
  Intermediate: {
    bg: "rgba(168, 85, 247, 0.12)",
    text: "#C084FC",
    border: "rgba(168, 85, 247, 0.25)",
  },
  Advanced: {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34D399",
    border: "rgba(16, 185, 129, 0.25)",
  },
  Beginner: {
    bg: "rgba(245, 158, 11, 0.12)",
    text: "#FBBF24",
    border: "rgba(245, 158, 11, 0.25)",
  },
  Familiar: {
    bg: "rgba(255, 255, 255, 0.05)",
    text: "#A1A1AA",
    border: "rgba(255, 255, 255, 0.1)",
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
const CARD_GAP = 28;
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
      opacity: 0.08 + Math.random() * 0.18,
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
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        background: "linear-gradient(180deg, #15151e 0%, #0d0d13 100%)",
        borderRadius: 16,
        // Gradient border via box-shadow trick — lighter top, darker bottom
        boxShadow: `
          inset 0 1px 0 0 rgba(255, 255, 255, 0.10),
          inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
          inset 1px 0 0 0 rgba(255, 255, 255, 0.05),
          inset -1px 0 0 0 rgba(255, 255, 255, 0.03)
        `,
        border: "1px solid rgba(255, 255, 255, 0.06)",
        flexShrink: 0,
      }}
      tabIndex={isFocusable ? 0 : -1}
      role="group"
      aria-label={`${skill.name} — ${skill.level} — ${skill.category}`}
    >
      {/* Top-left sheen overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 16,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 25%, transparent 55%, rgba(0,0,0,0.20) 100%)",
        }}
      />

      {/* Subtle horizontal light band near top */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[1px]"
        style={{
          borderRadius: "16px 16px 0 0",
          background:
            "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#3B82F6]"
          style={{
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            boxShadow:
              "inset 0 1px 0 rgba(59, 130, 246, 0.08), 0 2px 6px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: levelConfig.bg,
            color: levelConfig.text,
            border: `1px solid ${levelConfig.border}`,
            boxShadow: `0 1px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 ${levelConfig.border}`,
          }}
        >
          {skill.level}
        </span>
      </div>

      <div className="relative z-10 mt-auto">
        <h4 className="font-heading text-base font-bold text-white leading-tight">
          {skill.name}
        </h4>
        <span className="mt-1 block text-[10px] font-medium uppercase tracking-widest text-white/30">
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

  // Wrap x so the strip never scrolls past the clone boundary
  const wrapX = useCallback(
    (x) => {
      const totalRealWidth = TOTAL * STRIP_ITEM_WIDTH;
      const vc = getViewportCenter();
      // The leftmost "real" card center appears at screen position: realStartOffset + CARD_WIDTH/2 + x
      // The rightmost "real" card center: realStartOffset + (TOTAL-1)*STRIP_ITEM_WIDTH + CARD_WIDTH/2 + x
      // We want to keep the strip from running past clones
      const minX = vc - (realStartOffset + TOTAL * STRIP_ITEM_WIDTH - CARD_WIDTH / 2);
      const maxX = vc - (realStartOffset + CARD_WIDTH / 2);

      if (x > maxX) return x - totalRealWidth;
      if (x < minX) return x + totalRealWidth;
      return x;
    },
    [getViewportCenter]
  );

  // Reduced motion check
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
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
      const dt = Math.min(now - prevTime, 32); // cap at ~30fps minimum
      prevTime = now;
      const s = state.current;

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
          startSnap(getNearestIndex(s.x));
        }
      } else if (s.autoAdvance && !s.isHovering) {
        // Auto advance
        s.x -= AUTO_SPEED;
      }

      // Wrap for infinite loop
      s.x = wrapX(s.x);

      // Apply transform
      if (stripRef.current) {
        stripRef.current.style.transform = `translate3d(${s.x}px, 0, 0)`;
      }

      // Update active index (throttled to avoid excessive React renders)
      const newIdx = getNearestIndex(s.x);
      setActiveIndex((prev) => (prev !== newIdx ? newIdx : prev));

      // Update per-card opacity/scale based on distance from center
      updateCardVisuals(s.x);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReducedMotion, getNearestIndex, wrapX, getXForIndex]);

  // Update opacity/scale/arc/shadow of cards based on distance from center
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

        // ── Arc curve (Fix 1) ──
        // Normalize distance across half the viewport
        const norm = Math.min(distFromCenter / (vw * 0.5), 1.2);
        // Parabolic Y offset: center = 0, edges = ~20px down
        const arcY = norm * norm * 22;
        // Z rotation: cards left of center tilt clockwise, right tilt counter-clockwise
        const arcRotZ = (signedDist / (vw * 0.5)) * 3.5; // max ~3.5 degrees

        // ── Shadow (Fix 2) ──
        // Stronger/tighter shadow for center, softer for edges
        const shadowBlur = 16 + smoothT * 20; // 16–36px
        const shadowY = 8 + smoothT * 14; // 8–22px
        const shadowAlpha = 0.25 + smoothT * 0.35; // 0.25–0.60
        // Shift shadow slightly opposite to tilt
        const shadowX = -arcRotZ * 0.6;

        // ── Apply all transforms as one composite ──
        cardContainer.style.opacity = opacity;
        cardContainer.style.transform = `scale(${scale}) translateY(${arcY}px) rotate(${arcRotZ}deg)`;
        cardContainer.style.filter = `brightness(${brightness}) drop-shadow(${shadowX.toFixed(1)}px ${shadowY.toFixed(0)}px ${shadowBlur.toFixed(0)}px rgba(0, 0, 0, ${shadowAlpha.toFixed(2)}))`;
      });
    },
    [getViewportCenter]
  );

  const startSnap = useCallback(
    (index) => {
      const s = state.current;
      s.isSnapping = true;
      s.snapFrom = s.x;
      s.snapTo = getXForIndex(index);

      // Choose the shortest path (wrapping)
      const totalRealWidth = TOTAL * STRIP_ITEM_WIDTH;
      const diff = s.snapTo - s.snapFrom;
      if (Math.abs(diff) > totalRealWidth / 2) {
        if (diff > 0) s.snapTo -= totalRealWidth;
        else s.snapTo += totalRealWidth;
      }

      s.snapStartTime = performance.now();
      s.snapDuration = 500 + Math.min(Math.abs(s.snapTo - s.snapFrom) * 0.5, 400);
    },
    [getXForIndex]
  );

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
        startSnap(getNearestIndex(s.x));
      }
      // Otherwise let momentum carry and the loop will snap when it slows
    },
    [startSnap, getNearestIndex]
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
      style={{ background: "#070a18" }}
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
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 0.15s, transform 0.15s, filter 0.15s",
                }}
              >
                {/* Floating label above card */}
                <span
                  className="mb-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50"
                  aria-hidden={isClone ? "true" : undefined}
                >
                  {skill.name}
                </span>

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
                      "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 70%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 70%)",
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
        {/* Counter */}
        <span className="font-mono text-sm tracking-wider text-white/40">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(TOTAL).padStart(2, "0")}
        </span>

        {/* Active card title */}
        <h3
          className="text-center font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl"
          style={{ minHeight: "2.5rem" }}
          aria-live="polite"
        >
          {allSkills[activeIndex]?.name}
        </h3>

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
