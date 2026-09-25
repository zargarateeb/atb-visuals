"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  "SaaS Animation",
  "Influencer Edit",
  "YT Shorts",
  "Basic IG Reels",
  "Hardcore GYM / CAR Edits",
  "Brand/Product Showcase",
  "Podcast Edit",
  "Gaming Montage",
  "Motion Graphics",
  "Fast-Paced Reels",
  "Other",
];

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setRating(0);
        setHoverRating(0);
        setName("");
        setRole("");
        setCompany("");
        setProjectType("");
        setText("");
        setEmail("");
        setAvatarUrl("");
        setSubmitted(false);
        setError("");
      }, 400);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    if (text.length < 20) {
      setError("Review must be at least 20 characters");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          company,
          projectType,
          rating,
          text,
          email,
          avatarUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{
              background: "rgba(221, 229, 252, 0.4)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-xl rounded-3xl p-6 md:p-8 pointer-events-auto max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow:
                  "0 20px 80px rgba(0, 0, 0, 0.15), 0 0 60px rgba(160, 0, 255, 0.1)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all cursor-pointer z-10"
              >
                ✕
              </button>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🙏</div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                    Thank You!
                  </h2>
                  <p className="text-neutral-600 text-sm max-w-sm mx-auto">
                    Your review has been submitted and will appear after a
                    quick review. I really appreciate it!
                  </p>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                    Leave a Review
                  </h2>
                  <p className="text-neutral-600 text-sm mb-6">
                    Worked with me? Share your experience.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {/* Star Rating */}
                    <div>
                      <label className="block text-xs text-neutral-500 mb-2 font-medium">
                        Your Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110 cursor-pointer"
                            aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-9 h-9"
                              fill={
                                star <= (hoverRating || rating)
                                  ? "#E6A23C"
                                  : "transparent"
                              }
                              stroke="#E6A23C"
                              strokeWidth="1.5"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        ))}
                        <span className="text-neutral-500 text-sm ml-2 font-medium">
                          {rating > 0
                            ? ratingLabels[rating]
                            : "Click to rate"}
                        </span>
                      </div>
                    </div>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="rev-name"
                          className="block text-xs text-neutral-500 mb-1.5 font-medium"
                        >
                          Your Name *
                        </label>
                        <input
                          id="rev-name"
                          type="text"
                          required
                          value={name}
                          placeholder="Your Name"
                          onChange={(e) => setName(e.target.value)}
                          
                          className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="rev-email"
                          className="block text-xs text-neutral-500 mb-1.5 font-medium"
                        >
                          Email (private) *
                        </label>
                        <input
                          id="rev-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your-email@gmail.com"
                          className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Role + Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="rev-role"
                          className="block text-xs text-neutral-500 mb-1.5 font-medium"
                        >
                          Your Role
                        </label>
                        <input
                          id="rev-role"
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Content Creator"
                          className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="rev-company"
                          className="block text-xs text-neutral-500 mb-1.5 font-medium"
                        >
                          Company / Channel
                        </label>
                        <input
                          id="rev-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="@yourhandle"
                          className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label
                        htmlFor="rev-projectType"
                        className="block text-xs text-neutral-500 mb-1.5 font-medium"
                      >
                        What did I work on? *
                      </label>
                      <select
                        id="rev-projectType"
                        required
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                      >
                        <option value="" disabled className="bg-white">
                          Select a project type...
                        </option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-white">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label
                        htmlFor="rev-text"
                        className="block text-xs text-neutral-500 mb-1.5 font-medium"
                      >
                        Your Review *
                      </label>
                      <textarea
                        id="rev-text"
                        required
                        rows={4}
                        maxLength={500}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Tell others about your experience..."
                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none transition-colors text-sm resize-none"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-neutral-400">
                          Minimum 20 characters
                        </p>
                        <p
                          className={`text-[10px] ${
                            text.length < 20
                              ? "text-neutral-400"
                              : text.length > 450
                              ? "text-orange-500"
                              : "text-green-600"
                          }`}
                        >
                          {text.length}/500
                        </p>
                      </div>
                    </div>

                    {/* Avatar URL */}
                    <div>
                      <label
                        htmlFor="rev-avatar"
                        className="block text-xs text-neutral-500 mb-1.5 font-medium"
                      >
                        Profile Image URL (optional)
                      </label>
                      <input
                        id="rev-avatar"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/your-photo.jpg"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-xs text-center py-2">
                        {error}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="mt-2 px-6 py-3 rounded-full text-white font-semibold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                      style={{
                        background:
                          "linear-gradient(180deg, #C000FF, #8A00E0)",
                        boxShadow:
                          "0 0 25px rgba(192, 0, 255, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Review →"}
                    </motion.button>

                    <p className="text-[10px] text-neutral-400 text-center">
                      Your review will appear on the site after approval.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}