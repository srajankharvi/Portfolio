import { useEffect, useRef, useCallback } from "react";

/**
 * Premium 3D Interactive Grid Background — Hero Section Only
 *
 * Renders a perspective-projected grid plane on an absolutely-positioned
 * HTML Canvas that fills its parent container (the Hero section).
 */
export default function Background() {
  const canvasRef = useRef(null);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Parent = the wrapper div, heroSection = the actual hero <section>
    const parent = canvas.parentElement;
    const heroSection = parent.parentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Configuration ---
    const CONFIG = {
      gridSpacing: 40,
      gridLineWidth: 0.6,
      gridBaseColor: { r: 40, g: 42, b: 54 },
      gridBaseAlpha: 0.35,

      perspectiveOriginY: 0.55,
      perspectiveStrength: 900,
      gridTiltX: 60,
      gridRowCount: 70,
      gridColCount: 90,

      mouseInfluenceRadius: 220,
      waveAmplitude: 12,
      waveFrequency: 0.04,
      waveSpeed: 3.5,
      mouseLerp: 0.06,

      glowColorR: 59,
      glowColorG: 130,
      glowColorB: 246,
      glowIntensity: 0.65,
      glowRadius: 280,

      ambientSpeed: 0.0008,
      ambientAmplitude: 4,
      ambientFrequency: 0.015,

      depthFadeStart: 0.05,
      depthFadeEnd: 0.92,
    };

    // --- State ---
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let animId = null;
    let isTabVisible = true;
    let isIntersecting = true;
    let time = 0;

    let mouseTarget = { x: 0, y: 0 };
    let mouseCurrent = { x: 0, y: 0 };
    let mouseActive = false;
    let lastInteraction = 0;

    // --- 3D math ---
    const DEG2RAD = Math.PI / 180;
    const cosTilt = Math.cos(CONFIG.gridTiltX * DEG2RAD);
    const sinTilt = Math.sin(CONFIG.gridTiltX * DEG2RAD);

    function project3DWithWave(gx, gz, waveHeight) {
      const gy = waveHeight;
      const rotatedY = gy * cosTilt - gz * sinTilt;
      const rotatedZ = gy * sinTilt + gz * cosTilt;
      const perspective = CONFIG.perspectiveStrength / (CONFIG.perspectiveStrength + rotatedZ + 400);
      const screenX = W / 2 + gx * perspective;
      const screenY = H * CONFIG.perspectiveOriginY + rotatedY * perspective;
      return { x: screenX, y: screenY, depth: perspective };
    }

    function screenToGrid(sx, sy) {
      const relY = sy - H * CONFIG.perspectiveOriginY;
      const relX = sx - W / 2;
      let gz = 0;
      for (let i = 0; i < 8; i++) {
        const p = CONFIG.perspectiveStrength / (CONFIG.perspectiveStrength + gz * cosTilt + 400);
        gz = -relY / (sinTilt * p + 0.001);
      }
      const p = CONFIG.perspectiveStrength / (CONFIG.perspectiveStrength + gz * cosTilt + 400);
      const gx = relX / p;
      return { gx, gz };
    }

    // --- Resize to parent container (the hero <section>) ---
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Use the hero section itself for dimensions
      W = heroSection.offsetWidth;
      H = heroSection.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Init mouse to center
      if (!mouseActive) {
        mouseTarget.x = W / 2;
        mouseTarget.y = H / 2;
        mouseCurrent.x = W / 2;
        mouseCurrent.y = H / 2;
      }
    }

    resize();

    // ResizeObserver for robust container resize tracking
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(heroSection);
    }

    // Intersection Observer to pause when off-screen
    let intersectionObserver;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isIntersecting = entry.isIntersecting;
          });
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(heroSection);
    }

    // --- Mouse handlers (convert to hero-local coords) ---
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseTarget.x = (e.clientX - rect.left) * (W / rect.width);
      mouseTarget.y = (e.clientY - rect.top) * (H / rect.height);
      mouseActive = true;
      lastInteraction = time;
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseTarget.x = (e.touches[0].clientX - rect.left) * (W / rect.width);
        mouseTarget.y = (e.touches[0].clientY - rect.top) * (H / rect.height);
        mouseActive = true;
        lastInteraction = time;
      }
    }

    function onTouchEnd() {
      mouseActive = false;
    }

    function onMouseLeave() {
      mouseActive = false;
    }

    function onVisibilityChange() {
      isTabVisible = !document.hidden;
    }

    // --- Animation ---
    function render(timestamp) {
      if (!isTabVisible || !isIntersecting) {
        animId = requestAnimationFrame(render);
        return;
      }

      time = timestamp * 0.001;

      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * CONFIG.mouseLerp;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * CONFIG.mouseLerp;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      const mouseGrid = screenToGrid(mouseCurrent.x, mouseCurrent.y);
      const timeSinceInteraction = time - lastInteraction;
      const interactionFade = mouseActive ? 1 : Math.max(0, 1 - timeSinceInteraction * 0.3);

      const isMobile = W < 768;
      const isTablet = W >= 768 && W < 1024;
      const spacing = isMobile ? 60 : isTablet ? 50 : CONFIG.gridSpacing;
      const rows = isMobile ? 35 : isTablet ? 45 : CONFIG.gridRowCount;
      const cols = isMobile ? 40 : isTablet ? 60 : CONFIG.gridColCount;

      const halfCols = cols / 2;

      const points = [];
      for (let r = 0; r <= rows; r++) {
        const row = [];
        for (let c = 0; c <= cols; c++) {
          const gx = (c - halfCols) * spacing;
          const gz = r * spacing;

          const dx = gx - mouseGrid.gx;
          const dz = gz - mouseGrid.gz;
          const dist = Math.sqrt(dx * dx + dz * dz);

          let waveHeight = 0;

          if (interactionFade > 0.01) {
            const influence = Math.max(0, 1 - dist / (CONFIG.mouseInfluenceRadius * 6));
            if (influence > 0) {
              const wave = Math.sin(dist * CONFIG.waveFrequency - time * CONFIG.waveSpeed);
              waveHeight += wave * CONFIG.waveAmplitude * influence * influence * interactionFade;
            }
          }

          if (!prefersReducedMotion) {
            const ambientWave = Math.sin(gx * CONFIG.ambientFrequency + time * 0.5) *
              Math.cos(gz * CONFIG.ambientFrequency * 0.7 + time * 0.3) *
              CONFIG.ambientAmplitude;
            waveHeight += ambientWave;
          }

          const projected = project3DWithWave(gx, gz, waveHeight);

          const depthNorm = r / rows;
          let depthAlpha = 1;
          if (depthNorm < CONFIG.depthFadeStart) {
            depthAlpha = depthNorm / CONFIG.depthFadeStart;
          } else if (depthNorm > CONFIG.depthFadeEnd) {
            depthAlpha = 1 - (depthNorm - CONFIG.depthFadeEnd) / (1 - CONFIG.depthFadeEnd);
          }

          const colNorm = Math.abs(c - halfCols) / halfCols;
          const horizontalFade = 1 - Math.pow(colNorm, 2.5);

          let mouseBrightness = 0;
          if (interactionFade > 0.01) {
            const screenDx = projected.x - mouseCurrent.x;
            const screenDy = projected.y - mouseCurrent.y;
            const screenDist = Math.sqrt(screenDx * screenDx + screenDy * screenDy);
            mouseBrightness = Math.max(0, 1 - screenDist / CONFIG.glowRadius) * CONFIG.glowIntensity * interactionFade;
          }

          row.push({
            x: projected.x,
            y: projected.y,
            depth: projected.depth,
            alpha: depthAlpha * horizontalFade * CONFIG.gridBaseAlpha,
            brightness: mouseBrightness,
          });
        }
        points.push(row);
      }

      ctx.lineWidth = CONFIG.gridLineWidth;

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c <= cols; c++) {
          const p = points[r][c];
          if (p.alpha < 0.005) continue;
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
        const avgBrightness = points[r].reduce((s, p) => s + p.brightness, 0) / (cols + 1);
        const avgAlpha = points[r].reduce((s, p) => s + p.alpha, 0) / (cols + 1);
        if (avgBrightness > 0.01) {
          const br = CONFIG.gridBaseColor.r + (CONFIG.glowColorR - CONFIG.gridBaseColor.r) * avgBrightness;
          const bg = CONFIG.gridBaseColor.g + (CONFIG.glowColorG - CONFIG.gridBaseColor.g) * avgBrightness;
          const bb = CONFIG.gridBaseColor.b + (CONFIG.glowColorB - CONFIG.gridBaseColor.b) * avgBrightness;
          ctx.strokeStyle = `rgba(${br|0},${bg|0},${bb|0},${Math.min(avgAlpha + avgBrightness * 0.5, 0.9)})`;
        } else {
          ctx.strokeStyle = `rgba(${CONFIG.gridBaseColor.r},${CONFIG.gridBaseColor.g},${CONFIG.gridBaseColor.b},${avgAlpha})`;
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        let started = false;
        for (let r = 0; r <= rows; r++) {
          const p = points[r][c];
          if (p.alpha < 0.005) continue;
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
        const avgBrightness = points.reduce((s, row) => s + row[c].brightness, 0) / (rows + 1);
        const avgAlpha = points.reduce((s, row) => s + row[c].alpha, 0) / (rows + 1);
        if (avgBrightness > 0.01) {
          const br = CONFIG.gridBaseColor.r + (CONFIG.glowColorR - CONFIG.gridBaseColor.r) * avgBrightness;
          const bg = CONFIG.gridBaseColor.g + (CONFIG.glowColorG - CONFIG.gridBaseColor.g) * avgBrightness;
          const bb = CONFIG.gridBaseColor.b + (CONFIG.glowColorB - CONFIG.gridBaseColor.b) * avgBrightness;
          ctx.strokeStyle = `rgba(${br|0},${bg|0},${bb|0},${Math.min(avgAlpha + avgBrightness * 0.5, 0.9)})`;
        } else {
          ctx.strokeStyle = `rgba(${CONFIG.gridBaseColor.r},${CONFIG.gridBaseColor.g},${CONFIG.gridBaseColor.b},${avgAlpha})`;
        }
        ctx.stroke();
      }

      // Cell fill near mouse
      if (interactionFade > 0.01) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            if (p.brightness > 0.05 && p.alpha > 0.01) {
              const p2 = points[r][c + 1];
              const p3 = points[r + 1][c + 1];
              const p4 = points[r + 1][c];
              const cellBrightness = (p.brightness + p2.brightness + p3.brightness + p4.brightness) / 4;
              if (cellBrightness > 0.03) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.closePath();
                ctx.fillStyle = `rgba(${CONFIG.glowColorR},${CONFIG.glowColorG},${CONFIG.glowColorB},${cellBrightness * 0.08 * interactionFade})`;
                ctx.fill();
              }
            }
          }
        }
      }

      // Cursor glow
      if (interactionFade > 0.01 && !isMobile) {
        const gradient = ctx.createRadialGradient(
          mouseCurrent.x, mouseCurrent.y, 0,
          mouseCurrent.x, mouseCurrent.y, CONFIG.glowRadius * 1.5
        );
        gradient.addColorStop(0, `rgba(${CONFIG.glowColorR},${CONFIG.glowColorG},${CONFIG.glowColorB},${0.06 * interactionFade})`);
        gradient.addColorStop(0.4, `rgba(${CONFIG.glowColorR},${CONFIG.glowColorG},${CONFIG.glowColorB},${0.03 * interactionFade})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      }

      // Soft vignette — centered on the hero, very gentle
      const vignetteGradient = ctx.createRadialGradient(
        W / 2, H * 0.5, Math.min(W, H) * 0.35,
        W / 2, H * 0.5, Math.max(W, H) * 0.95
      );
      vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGradient.addColorStop(0.7, "rgba(0,0,0,0.15)");
      vignetteGradient.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, W, H);

      // Bottom fade — smooth blend into sections below (last 15%)
      const bottomFade = ctx.createLinearGradient(0, H * 0.82, 0, H);
      bottomFade.addColorStop(0, "rgba(0,0,0,0)");
      bottomFade.addColorStop(0.6, "rgba(0,0,0,0.4)");
      bottomFade.addColorStop(1, "rgba(0,0,0,0.95)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, H * 0.82, W, H * 0.18);

      // Top fade — subtle blend behind navbar area
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.12);
      topFade.addColorStop(0, "rgba(0,0,0,0.5)");
      topFade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, W, H * 0.12);

      animId = requestAnimationFrame(render);
    }

    // --- Event listeners ---
    window.addEventListener("resize", resize, { passive: true });
    heroSection.addEventListener("mousemove", onMouseMove, { passive: true });
    heroSection.addEventListener("mouseleave", onMouseLeave, { passive: true });
    heroSection.addEventListener("touchmove", onTouchMove, { passive: true });
    heroSection.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Start
    if (prefersReducedMotion) {
      time = 0;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      const spacing = 50;
      const rows = 40;
      const cols = 60;
      const halfCols = cols / 2;
      ctx.lineWidth = 0.4;

      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const gx = (c - halfCols) * spacing;
          const gz = r * spacing;
          const projected = project3DWithWave(gx, gz, 0);
          if (c === 0) ctx.moveTo(projected.x, projected.y);
          else ctx.lineTo(projected.x, projected.y);
        }
        ctx.strokeStyle = `rgba(40,42,54,0.15)`;
        ctx.stroke();
      }

      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const gx = (c - halfCols) * spacing;
          const gz = r * spacing;
          const projected = project3DWithWave(gx, gz, 0);
          if (r === 0) ctx.moveTo(projected.x, projected.y);
          else ctx.lineTo(projected.x, projected.y);
        }
        ctx.strokeStyle = `rgba(40,42,54,0.15)`;
        ctx.stroke();
      }

      // Vignette
      const vignetteGradient = ctx.createRadialGradient(
        W / 2, H * 0.5, Math.min(W, H) * 0.35,
        W / 2, H * 0.5, Math.max(W, H) * 0.95
      );
      vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGradient.addColorStop(0.7, "rgba(0,0,0,0.15)");
      vignetteGradient.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, W, H);

      // Bottom fade
      const bottomFade = ctx.createLinearGradient(0, H * 0.82, 0, H);
      bottomFade.addColorStop(0, "rgba(0,0,0,0)");
      bottomFade.addColorStop(0.6, "rgba(0,0,0,0.4)");
      bottomFade.addColorStop(1, "rgba(0,0,0,0.95)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, H * 0.82, W, H * 0.18);

      // Top fade
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.12);
      topFade.addColorStop(0, "rgba(0,0,0,0.5)");
      topFade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, W, H * 0.12);
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      heroSection.removeEventListener("mousemove", onMouseMove);
      heroSection.removeEventListener("mouseleave", onMouseLeave);
      heroSection.removeEventListener("touchmove", onTouchMove);
      heroSection.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const cleanup = setup();
    return cleanup;
  }, [setup]);

  return (
    <div
      className="absolute inset-0 z-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}
