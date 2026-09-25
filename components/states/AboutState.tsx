"use client";

import { motion } from "framer-motion";

const paragraph =
  "Hi, I'm Ateeb, owner of ATB Visuals. I am a Short-Form Video Editor and Motion Graphics Designer specializing in short-form content that performs, Hooks that land in the first frame, Pacing that holds attention, and an edit that feels like it was made for the algorithm and the viewer at the same time. I don't just cut clips, I build moments that make viewers stop, watch, share.";

const words = paragraph.split(" ");

export default function AboutState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 45%, #1a0033 0%, #0d0018 50%, #050008 100%)",
      }}
    >
      {/* Warm golden glow behind heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "200px",
          background:
            "radial-gradient(ellipse, rgba(230, 162, 60, 0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Diagonal golden light streak — lower right */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          bottom: "15%",
          width: "45%",
          height: "2px",
          transform: "rotate(-30deg)",
          transformOrigin: "right center",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(230, 162, 60, 0.9) 50%, rgba(255, 200, 100, 0.7) 70%, transparent 100%)",
          filter: "blur(3px)",
          boxShadow:
            "0 0 30px 8px rgba(230, 162, 60, 0.6), 0 0 60px 15px rgba(230, 162, 60, 0.3)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-16 max-w-4xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-10"
          style={{
            color: "#E6A23C",
            textShadow:
              "0 0 30px rgba(230, 162, 60, 0.6), 0 0 60px rgba(230, 162, 60, 0.3)",
          }}
        >
          About me
        </motion.h2>

        {/* Paragraph — word-by-word reveal */}
        <p className="text-neutral-200 text-sm md:text-base leading-relaxed max-w-3xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.025,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-1"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </motion.div>
  );
}