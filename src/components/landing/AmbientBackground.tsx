'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

// CSS-only ambient background - no JS animations for better scroll performance
export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[#050507]" />
      {/* Static blurred blobs with CSS animations for GPU-accelerated transforms */}
      <div
        className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-ambient-blob-1"
        style={{ willChange: 'transform, opacity' }}
      />
      <div
        className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-ambient-blob-2"
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
};

export const MouseSpotlight: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const lastUpdateRef = useRef(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on mobile/touch devices for better performance
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Throttle to ~30fps (33ms) for better scroll performance
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdateRef.current < 33) return;
      lastUpdateRef.current = now;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  // Don't render spotlight on mobile
  if (isMobile) return null;

  const background = useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, rgba(59, 130, 246, 0.08), transparent 80%)`;

  return <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background }} />;
};

export default AmbientBackground;
