"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface OpeningStateProps {
  onYes: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function OpeningState({ onYes }: OpeningStateProps) {
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const lastDodge = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noBtnRef.current) return;

      const now = Date.now();
      if (now - lastDodge.current < 250) return;

      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 140) {
        lastDodge.current = now;
        const maxX = Math.min(window.innerWidth * 0.35, 420);
        const maxY = Math.min(window.innerHeight * 0.35, 320);
        const newX = (Math.random() - 0.5) * 2 * maxX;
        const newY = (Math.random() - 0.5) * 2 * maxY;
        setNoPos({ x: newX, y: newY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 70%, #3d0070 0%, #1a0033 40%, #10001F 70%, #0a0014 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute pointer-events-none"
        style={{
          left: "10%",
          top: "65%",
          width: "50%",
          height: "3px",
          transform: "rotate(-25deg)",
          transformOrigin: "left center",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 40%, rgba(200,100,255,0.6) 60%, transparent 100%)",
          filter: "blur(4px)",
          boxShadow:
            "0 0 40px 10px rgba(200, 100, 255, 0.5), 0 0 80px 20px rgba(160, 0, 255, 0.3)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-center leading-tight"
        >
          <span className="text-white">Looking for a </span>
          <span
            className="text-[#C000FF]"
            style={{
              textShadow:
                "0 0 20px rgba(192, 0, 255, 0.8), 0 0 40px rgba(160, 0, 255, 0.5)",
            }}
          >
            Video Editor?
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative mt-16 flex items-center justify-center gap-6"
          style={{ minHeight: "120px", minWidth: "400px" }}
        >
          <button
            onClick={(e) => onYes(e)}
            className="relative z-20 px-10 py-3 rounded-full text-white font-semibold text-base border border-emerald-300/40 transition-transform hover:scale-105 cursor-pointer"
            style={{
              background:
                "linear-gradient(180deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))",
              boxShadow:
                "0 0 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            Yes
          </button>

          <motion.button
            ref={noBtnRef}
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              mass: 1.2,
            }}
            className="relative z-10 px-10 py-3 rounded-full text-white font-semibold text-base border border-red-300/30 cursor-pointer"
            style={{
              background:
                "linear-gradient(180deg, rgba(190, 24, 93, 0.9), rgba(136, 19, 55, 0.9))",
              boxShadow:
                "0 0 20px rgba(190, 24, 93, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            No
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}