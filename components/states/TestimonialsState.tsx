"use client";

import ReviewModal from "@/components/ReviewModal";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  projectType: string;
  rating: number;
  text: string;
  avatarUrl?: string;
  verified: boolean;
  createdAt: string;
}

const INITIAL_SHOW = 6;
const LOAD_STEP = 6;

export default function TestimonialsState() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | 1 | 2 | 3 | 4 | 5>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_SHOW);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (data.success) setTestimonials(data.testimonials);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Stats
  const stats = useMemo(() => {
    if (testimonials.length === 0) {
      return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    }
    const total = testimonials.length;
    const sum = testimonials.reduce((s, t) => s + t.rating, 0);
    const avg = sum / total;
    const distribution = [0, 0, 0, 0, 0];
    testimonials.forEach((t) => {
      if (t.rating >= 1 && t.rating <= 5) {
        distribution[t.rating - 1]++;
      }
    });
    return { avg, total, distribution };
  }, [testimonials]);

  const filtered = useMemo(() => {
    if (filter === "all") return testimonials;
    return testimonials.filter((t) => t.rating === filter);
  }, [testimonials, filter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // Color by rating
  const ratingColor = (r: number) => {
    if (r >= 4) return "#10B981"; // green
    if (r === 3) return "#E6A23C"; // gold
    return "#EF4444"; // red
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#DDE5FC" }}
    >
      <div
        className="relative z-10 h-full w-full overflow-y-auto px-6 md:px-16 py-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.05]">
              What Clients Say
            </h2>
            <p className="text-neutral-600 text-sm md:text-base font-medium mt-3">
              Real reviews from real collaborations
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-neutral-500">
              Loading reviews...
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
  <p className="text-neutral-600 text-lg mb-6">
    No reviews yet. Be the first!
  </p>
  <button
    onClick={() => setModalOpen(true)}
    className="inline-block px-8 py-3 rounded-full text-white font-semibold text-sm cursor-pointer"
    style={{
      background: "linear-gradient(180deg, #C000FF, #8A00E0)",
      boxShadow: "0 0 25px rgba(192, 0, 255, 0.5)",
    }}
  >
    ✍️ Write a Review
  </button>
</div>
          ) : (
            <>
              {/* Summary Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80">
                {/* Big average */}
                <div className="text-center md:border-r border-neutral-300/50">
                  <div className="font-display text-6xl md:text-7xl font-bold text-neutral-900">
                    {stats.avg.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`text-2xl ${
                          s <= Math.round(stats.avg)
                            ? "text-yellow-500"
                            : "text-neutral-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-neutral-600 text-xs">
                    Based on {stats.total}{" "}
                    {stats.total === 1 ? "review" : "reviews"}
                  </p>
                </div>

                {/* Distribution bars */}
                <div className="md:col-span-2 flex flex-col gap-2 justify-center">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = stats.distribution[stars - 1];
                    const pct =
                      stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <button
                        key={stars}
                        onClick={() =>
                          setFilter(
                            filter === stars ? "all" : (stars as 1 | 2 | 3 | 4 | 5)
                          )
                        }
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <span className="text-xs text-neutral-600 w-10 text-left font-medium">
                          {stars} ★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-neutral-300/50 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: ratingColor(stars) }}
                          />
                        </div>
                        <span className="text-xs text-neutral-600 w-8 text-right">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    filter === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-white/60 border border-neutral-300/50 text-neutral-700 hover:border-purple-400"
                  }`}
                >
                  All ({testimonials.length})
                </button>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = stats.distribution[stars - 1];
                  return (
                    <button
                      key={stars}
                      onClick={() =>
                        setFilter(
                          filter === stars ? "all" : (stars as 1 | 2 | 3 | 4 | 5)
                        )
                      }
                      disabled={count === 0}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        filter === stars
                          ? "bg-purple-600 text-white"
                          : "bg-white/60 border border-neutral-300/50 text-neutral-700 hover:border-purple-400"
                      }`}
                    >
                      {stars}★ ({count})
                    </button>
                  );
                })}
              </div>

              {/* Reviews grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <AnimatePresence mode="popLayout">
                  {visible.map((t, i) => (
                    <motion.div
                      key={t._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 hover:border-purple-300/60 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        {t.avatarUrl ? (
                          <img
                            src={t.avatarUrl}
                            alt={t.name}
                            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #C000FF, #8A00E0)",
                            }}
                          >
                            {getInitials(t.name)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-neutral-900 text-sm truncate">
                              {t.name}
                            </p>
                            {t.verified && (
                              <span
                                className="text-[10px] flex items-center gap-1 text-green-600 flex-shrink-0"
                                title="Verified Client"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          {(t.role || t.company) && (
                            <p className="text-xs text-neutral-500 truncate">
                              {[t.role, t.company]
                                .filter(Boolean)
                                .join(" @ ")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stars + date */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`text-sm ${
                                s <= t.rating
                                  ? "text-yellow-500"
                                  : "text-neutral-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-neutral-500">
                          · {formatDate(t.createdAt)}
                        </span>
                      </div>

                      {/* Review text */}
                      <p className="text-sm text-neutral-800 leading-relaxed">
                        {t.text}
                      </p>

                      {/* Project type */}
                      <p className="text-[11px] text-purple-600 mt-3 font-medium">
                        {t.projectType}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="text-center mb-6">
                  <button
                    onClick={() => setVisibleCount((c) => c + LOAD_STEP)}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold border border-neutral-400/50 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}

              {/* Write a Review CTA */}
              <div className="text-center py-6">
  <button
    onClick={() => setModalOpen(true)}
    className="inline-block px-8 py-3 rounded-full text-white font-semibold text-sm cursor-pointer"
    style={{
      background: "linear-gradient(180deg, #C000FF, #8A00E0)",
      boxShadow: "0 0 25px rgba(192, 0, 255, 0.5)",
    }}
  >
    ✍️ Write a Review
  </button>
</div>
            </>
          )}
        </div>
      </div>
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </motion.div>
  );
}