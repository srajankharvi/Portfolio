import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for detecting real physical device shake motions using the DeviceMotionEvent API.
 * 
 * Features:
 * - Feature-detects DeviceMotionEvent and secure contexts
 * - Handles iOS 13+ permission request flow via explicit user gesture
 * - Auto-initializes on Android Chrome and other browsers where permissions are not gated
 * - Safe handling for null/undefined sensor values on desktop/unsupported devices
 * - Configurable shake threshold and cooldown to prevent false positives from scrolling or walking
 * - Zero React re-renders during sensor tracking (all high-frequency calculations in refs)
 * - Clean cleanup on unmount
 * - Respects prefers-reduced-motion
 */
export default function useDeviceMotionShake({
  onShake,
  threshold = 13.5,
  cooldown = 900,
  enabled = true
} = {}) {
  const [permissionState, setPermissionState] = useState('unsupported'); // 'unsupported' | 'prompt' | 'granted' | 'denied'
  const [isSensorActive, setIsSensorActive] = useState(false);

  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  const lastX = useRef(null);
  const lastY = useRef(null);
  const lastZ = useRef(null);
  const lastTime = useRef(0);
  const lastShakeTime = useRef(0);
  const pulseHistory = useRef([]);
  const hasValidReading = useRef(false);

  // Check initial support & permission model
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setPermissionState('unsupported');
      return;
    }

    // Must have DeviceMotionEvent in window
    if (!('DeviceMotionEvent' in window)) {
      setPermissionState('unsupported');
      return;
    }

    // Insecure contexts (non-https / non-localhost) cannot access device motion in modern browsers
    if (window.isSecureContext === false) {
      setPermissionState('unsupported');
      return;
    }

    // iOS 13+ Safari requires an explicit user gesture via DeviceMotionEvent.requestPermission
    if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
      // Check if user previously denied permission in this session to avoid prompting repeatedly
      try {
        if (sessionStorage.getItem('motion_permission_denied') === 'true') {
          setPermissionState('denied');
          return;
        }
      } catch {
        // Ignore sessionStorage restrictions
      }
      setPermissionState('prompt');
    } else {
      // Android Chrome and other standard compliant browsers: permission is granted by default
      setPermissionState('granted');
    }
  }, []);

  // Request permission on user gesture (required for iOS Safari)
  const requestPermission = useCallback(async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.DeviceMotionEvent !== 'undefined' &&
      typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await window.DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          return 'granted';
        } else {
          setPermissionState('denied');
          try {
            sessionStorage.setItem('motion_permission_denied', 'true');
          } catch {
            // Ignore sessionStorage restrictions
          }
          return 'denied';
        }
      } catch (err) {
        console.warn('DeviceMotionEvent permission request error:', err);
        setPermissionState('denied');
        try {
          sessionStorage.setItem('motion_permission_denied', 'true');
        } catch {
          // Ignore
        }
        return 'denied';
      }
    }
    return 'unsupported';
  }, []);

  // Attach devicemotion listener when permission is granted and enabled
  useEffect(() => {
    if (!enabled || permissionState !== 'granted') return;
    if (typeof window === 'undefined') return;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const { x, y, z } = acc;

      // Safe handling for null/undefined/NaN sensor data (common on desktops or unsupported hardware)
      if (
        typeof x !== 'number' ||
        typeof y !== 'number' ||
        typeof z !== 'number' ||
        isNaN(x) ||
        isNaN(y) ||
        isNaN(z)
      ) {
        return;
      }

      // Mark sensor as actually active and returning real readings
      if (!hasValidReading.current) {
        hasValidReading.current = true;
        setIsSensorActive(true);
      }

      const now = performance.now();

      // Respect cooldown
      if (now - lastShakeTime.current < cooldown) {
        lastX.current = x;
        lastY.current = y;
        lastZ.current = z;
        lastTime.current = now;
        return;
      }

      const dt = now - lastTime.current;
      // Skip micro-interval noise
      if (dt < 12) return;

      // Handle first frame or return after sleep/tab focus switch (>800ms)
      if (lastTime.current === 0 || dt > 800 || lastX.current === null) {
        lastX.current = x;
        lastY.current = y;
        lastZ.current = z;
        lastTime.current = now;
        return;
      }

      // Acceleration change (jerk)
      const deltaX = x - lastX.current;
      const deltaY = y - lastY.current;
      const deltaZ = z - lastZ.current;
      const deltaMag = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;
      lastTime.current = now;

      // Check if threshold crossed
      if (deltaMag >= threshold) {
        // Collect motion pulses within a 600ms sliding window to confirm oscillatory shaking
        const recentPulses = pulseHistory.current.filter((p) => now - p.time < 600);
        recentPulses.push({
          time: now,
          dx: deltaX,
          dy: deltaY,
          dz: deltaZ,
          mag: deltaMag
        });
        pulseHistory.current = recentPulses;

        // Trigger condition:
        // 1. At least 2 rapid acceleration peaks within 600ms (oscillating back and forth shake)
        // 2. OR a strong single shake impulse (deltaMag >= 20.0 m/s²)
        const hasOscillation = recentPulses.length >= 2;
        const isStrongSnap = deltaMag >= 20.0;

        if (hasOscillation || isStrongSnap) {
          lastShakeTime.current = now;
          pulseHistory.current = [];

          // Calculate normalized shake direction and relative intensity
          const dirX = Math.sign(deltaX) || 1;
          const dirY = Math.abs(deltaY) > 6 ? Math.sign(deltaY) : 0;
          const dirZ = Math.abs(deltaZ) > 6 ? Math.sign(deltaZ) : 0.4;
          const intensity = Math.min(Math.max(deltaMag / 15, 0.6), 1.8);

          onShakeRef.current?.({
            directionX: dirX,
            directionY: dirY,
            directionZ: dirZ,
            intensity,
            deltaMag
          });
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion, { passive: true });

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      pulseHistory.current = [];
      lastX.current = null;
      lastY.current = null;
      lastZ.current = null;
      lastTime.current = 0;
    };
  }, [enabled, permissionState, threshold, cooldown]);

  return {
    permissionState,
    isSensorActive,
    requestPermission
  };
}
