"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CircleWipeProps {
  isActive: boolean;
  color?: string;
  originX: number; // px
  originY: number; // px
}

export default function CircleWipe({
  isActive,
  color = "#DDE5FC",
  originX,
  originY,
}: CircleWipeProps) {
  // Circle needs to expand far enough to cover the whole screen
  const maxDimension =
    typeof window !== "undefined"
      ? Math.max(window.innerWidth, window.innerHeight) * 1.6
      : 2000;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={`${originX}-${originY}-${color}`}
          initial={{
            clipPath: `circle(0px at ${originX}px ${originY}px)`,
          }}
          animate={{
            clipPath: `circle(${maxDimension}px at ${originX}px ${originY}px)`,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[90] pointer-events-none"
          style={{ background: color }}
        />
      )}
    </AnimatePresence>
  );
}