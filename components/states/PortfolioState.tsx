"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoCard from "@/components/VideoCard";

interface PortfolioStateProps {
  index: number;
  onOrder: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTestimonials: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface Project {
  _id: string;
  title: string;
  category: "saas" | "podcast" | "motion" | "fast";
  vimeoUrl: string;
  order: number;
}

interface Category {
  id: "saas" | "podcast" | "motion" | "fast";
  title: string[];
  subtitle: string;
  shape: "vertical" | "horizontal";
  videos: { url: string; title: string }[];
}

const CATEGORY_META: Omit<Category, "videos">[] = [
  {
    id: "saas",
    title: ["SaaS", "Animations"],
    subtitle: "Premium Advertisements using Motion Graphics",
    shape: "horizontal",
  },
  {
    id: "podcast",
    title: ["Head-Tracking /", "Podcast Edits"],
    subtitle: "Facecam Edits to gain more views",
    shape: "vertical",
  },
  {
    id: "motion",
    title: ["Motion Graphics", "Reels Edits"],
    subtitle: "Powerful reels with premium visuals",
    shape: "vertical",
  },
  {
    id: "fast",
    title: ["Fast-Paced Reels", "Edits"],
    subtitle: "Motivational/Influencial Reels Editing",
    shape: "vertical",
  },
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function PortfolioState({
  onOrder,
  onTestimonials,
}: PortfolioStateProps) {
  const [grid, setGrid] = useState({ x: 0, y: 0 });
  const [entering, setEntering] = useState<
    "left" | "right" | "up" | "down"
  >("right");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from DB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Build categories with their videos from DB
  const CATEGORIES: Category[] = CATEGORY_META.map((meta) => ({
    ...meta,
    videos: projects
      .filter((p) => p.category === meta.id)
      .sort((a, b) => a.order - b.order)
      .map((p) => ({ url: p.vimeoUrl, title: p.title })),
  }));

  const current = CATEGORIES[mod(grid.x + grid.y, CATEGORIES.length)];
  const isVertical = current.shape === "vertical";
  const categoryIndex = mod(grid.x + grid.y, CATEGORIES.length);

  const go = (dir: "left" | "right" | "up" | "down") => {
    setEntering(dir);
    if (dir === "left") setGrid((g) => ({ x: g.x + 1, y: g.y }));
    else if (dir === "right") setGrid((g) => ({ x: g.x - 1, y: g.y }));
    else if (dir === "up") setGrid((g) => ({ x: g.x, y: g.y - 1 }));
    else if (dir === "down") setGrid((g) => ({ x: g.x, y: g.y + 1 }));
  };

  const entryOffset =
    entering === "right"
      ? { x: 80, y: 0 }
      : entering === "left"
      ? { x: -80, y: 0 }
      : entering === "down"
      ? { x: 0, y: 80 }
      : { x: 0, y: -80 };

  if (loading) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ background: "#DDE5FC" }}
      >
        <p className="text-neutral-500 text-sm font-medium">
          Loading portfolio...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: "#DDE5FC" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${grid.x}-${grid.y}`}
          initial={{ opacity: 0, x: entryOffset.x, y: entryOffset.y }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{
            opacity: 0,
            x: -entryOffset.x * 0.6,
            y: -entryOffset.y * 0.6,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 h-full w-full flex flex-col items-center justify-center px-8 md:px-16"
        >
          <div className="text-center mb-8 md:mb-10">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.05]">
              {current.title[0]} {current.title[1]}
            </h2>
            <p className="text-neutral-600 text-sm md:text-base font-medium mt-3">
              {current.subtitle}
            </p>
          </div>

          {current.videos.length === 0 ? (
            <p className="text-neutral-500 text-sm italic">
              No projects in this category yet.
            </p>
          ) : isVertical ? (
            <div className="flex items-center justify-center gap-6">
              {current.videos.map((v) => (
                <VideoCard key={v.url} vimeoUrl={v.url} shape="vertical" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              {current.videos.map((v) => (
                <div
                  key={v.url}
                  className="flex justify-center"
                  style={{
                    width: "100%",
                    maxWidth: "min(50vw, 640px)",
                  }}
                >
                  <VideoCard vimeoUrl={v.url} shape="horizontal" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <ClickableHints onNavigate={go} />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.id}
            className={`h-1.5 rounded-full transition-all ${
              i === categoryIndex
                ? "w-8 bg-purple-600"
                : "w-1.5 bg-neutral-900/30"
            }`}
          />
        ))}
      </div>
      {/* Reviews button */}
<motion.button
  onClick={(e) => onTestimonials(e)}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.75 }}
  whileHover={{ scale: 1.06 }}
  whileTap={{ scale: 0.96 }}
  className="fixed bottom-6 right-52 z-40 px-5 py-3 rounded-full text-white font-semibold text-xs md:text-sm cursor-pointer"
  style={{
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(230, 162, 60, 0.5)",
    boxShadow: "0 0 20px rgba(230, 162, 60, 0.3)",
  }}
>
  ⭐ Reviews
</motion.button>
      <motion.button
        onClick={(e) => onOrder(e)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-40 px-6 py-3 rounded-full text-white font-semibold text-sm md:text-base cursor-pointer"
        style={{
          background: "linear-gradient(180deg, #C000FF, #8A00E0)",
          boxShadow:
            "0 0 25px rgba(192, 0, 255, 0.7), 0 0 50px rgba(160, 0, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          ORDER NOW →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

function ClickableHints({
  onNavigate,
}: {
  onNavigate: (dir: "left" | "right" | "up" | "down") => void;
}) {
  const bounce = 8;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      <motion.button
        onClick={() => onNavigate("up")}
        aria-label="Previous (up)"
        animate={{ y: [0, -bounce, 0] }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.3, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 text-3xl text-neutral-900/50 hover:text-purple-600 font-thin pointer-events-auto transition-colors cursor-pointer"
      >
        ↑
      </motion.button>

      <motion.button
        onClick={() => onNavigate("down")}
        aria-label="Next (down)"
        animate={{ y: [0, bounce, 0] }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.3, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-3xl text-neutral-900/50 hover:text-purple-600 font-thin pointer-events-auto transition-colors cursor-pointer"
      >
        ↓
      </motion.button>

      <motion.button
        onClick={() => onNavigate("left")}
        aria-label="Next (left)"
        animate={{ x: [0, -bounce, 0] }}
        transition={{
          x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.3, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-neutral-900/50 hover:text-purple-600 font-thin pointer-events-auto transition-colors cursor-pointer"
      >
        ←
      </motion.button>

      <motion.button
        onClick={() => onNavigate("right")}
        aria-label="Previous (right)"
        animate={{ x: [0, bounce, 0] }}
        transition={{
          x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.3, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl text-neutral-900/50 hover:text-purple-600 font-thin pointer-events-auto transition-colors cursor-pointer"
      >
        →
      </motion.button>
    </div>
  );
}