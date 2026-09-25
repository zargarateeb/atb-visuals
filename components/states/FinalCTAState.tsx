"use client";

import { motion } from "framer-motion";

interface FinalCTAStateProps {
  onOrder: () => void;
  onRestart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FinalCTAState({ onOrder, onRestart }: FinalCTAStateProps) {
  const topWords = ["Let's", "Build", "Your", "Content"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 55%, #3a0070 0%, #1a0033 45%, #10001F 75%, #050008 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute pointer-events-none"
        style={{
          width: "min(80vw, 700px)",
          height: "min(80vw, 700px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(160, 0, 255, 0.35) 0%, rgba(160, 0, 255, 0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {topWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-3"
              style={{ textShadow: "0 0 30px rgba(160, 0, 255, 0.5)" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.button
          onClick={onOrder}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.4 + topWords.length * 0.35 + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            scale: 1.05,
            textShadow:
              "0 0 40px rgba(192, 0, 255, 1), 0 0 80px rgba(160, 0, 255, 0.8), 0 0 120px rgba(160, 0, 255, 0.5)",
          }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 md:mt-8 font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight transition-all"
          style={{
            color: "#C000FF",
            textShadow:
              "0 0 30px rgba(192, 0, 255, 0.9), 0 0 60px rgba(160, 0, 255, 0.6), 0 0 100px rgba(160, 0, 255, 0.4)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ORDER NOW
        </motion.button>

        <motion.button
          onClick={(e) => onRestart(e)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          whileHover={{ scale: 1.05, opacity: 1 }}
          className="mt-16 md:mt-20 text-neutral-500 hover:text-purple-400 text-xs md:text-sm font-medium tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
        >
          ↻ Start Over
        </motion.button>
      </div>
    </motion.div>
  );
}