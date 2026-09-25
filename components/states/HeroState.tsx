"use client";

import { motion } from "framer-motion";

interface HeroStateProps {
  onPortfolio: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onAbout: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function HeroState({ onPortfolio, onAbout }: HeroStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#DDE5FC" }}
    >
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-2 items-center px-8 md:px-16 max-w-7xl mx-auto">
        <div className="relative flex items-center justify-center h-full">
          <div className="relative" style={{ width: "min(70vw, 360px)", aspectRatio: "1" }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, #C000FF 0%, #A000FF 60%, #7A00CC 100%)",
                boxShadow:
                  "0 0 80px 20px rgba(160, 0, 255, 0.5), 0 0 120px 40px rgba(160, 0, 255, 0.25)",
              }}
            />

            <motion.img
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              src="https://ik.imagekit.io/5xwchyocd7/potrailt.png"
              alt="Ateeb"
              className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none"
              style={{ transform: "scale(1.15) translateY(5%)" }}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 text-left">
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10"
            style={{
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span className="text-xs md:text-sm font-medium text-neutral-800">
              Available for Freelance Work!
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-[1.05]"
          >
            Hi, I am{" "}
            <span
              className="text-[#A000FF]"
              style={{ textShadow: "0 0 30px rgba(160, 0, 255, 0.5)" }}
            >
              Ateeb
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="text-neutral-700 text-base md:text-lg font-medium max-w-md"
          >
            Short Form Video Editor & Motion Designer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={(e) => onPortfolio(e)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-semibold text-sm md:text-base transition-transform hover:scale-105 cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #B000FF, #8A00E0)",
                boxShadow:
                  "0 0 25px rgba(160, 0, 255, 0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              See my Portfolio →
            </button>

            <button
              onClick={(e) => onAbout(e)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm md:text-base transition-all hover:scale-105 cursor-pointer border border-neutral-900/20 text-neutral-900 hover:bg-neutral-900 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              About Me
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}