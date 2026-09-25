"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMSPREE_URL = "https://formspree.io/f/mzezznpa";

const PROJECT_TYPES = [
  "SaaS Animation",
  "Influencer Edit",
  "YT Shorts",
  "Basic IG Reels",
  "Hardcore GYM / CAR Edits",
  "Brand/Product Showcase",
  "Podcast Edit",
  "Gaming Montage",
  "Case Studies",
  "Advertisements",
  "Motion Graphics",
  "Fast-Paced Reels",
  "Other",
];

const BUDGET_RANGES = [
  "Under ₹500",
  "₹500 – ₹1000",
  "₹1000 – ₹1500",
  "₹1500 – ₹3,000",
  "₹3,000+",
  "Not sure yet",
];

const TIMELINES = [
  "URGENT (Within 24 Hours)",
  "ASAP (1-2 days)",
  "This week",
  "Within 2 weeks",
  "This month",
  "Flexible",
];

const FOUND_VIA = [
  "Instagram",
  "YouTube",
  "Referral",
  "Google Search",
  "X / Twitter",
  "Other",
];

const CONTACT_PREF = ["Email", "WhatsApp", "Call"];

const FOOTAGE_READY = ["Yes", "No", "Partially"];

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Lock body scroll while modal is open
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitting(true);

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());

  try {
    // 1. Save to our MongoDB (primary)
    const dbPromise = fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // 2. Also send to Formspree (backup email notification)
    const formspreePromise = fetch(FORMSPREE_URL, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    const [dbRes] = await Promise.all([dbPromise, formspreePromise]);

    if (dbRes.ok) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => setSubmitted(false), 500);
      }, 2500);
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch {
    alert("Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
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
              className="relative w-full max-w-2xl rounded-3xl p-6 md:p-8 pointer-events-auto max-h-[92vh] overflow-y-auto"
              style={{
                background: "linear-gradient(180deg, #1a0033 0%, #10001F 100%)",
                border: "1px solid rgba(192, 0, 255, 0.3)",
                boxShadow:
                  "0 0 60px rgba(160, 0, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-10"
              >
                ✕
              </button>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    I&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    Let&apos;s Build Your Content
                  </h2>
                  <p className="text-neutral-400 text-sm mb-6">
                    Tell me about your project and I&apos;ll reply soon.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Your Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Your Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your-email@gmail.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone + Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          WhatsApp / Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="brand"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Brand / Channel Name
                        </label>
                        <input
                          id="brand"
                          name="brand"
                          type="text"
                          placeholder="@yourhandle"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Row 3: Project Type + Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="projectType"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Project Type *
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          required
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                        >
                          <option value="" disabled className="bg-neutral-900">
                            Select a type...
                          </option>
                          {PROJECT_TYPES.map((t) => (
                            <option key={t} value={t} className="bg-neutral-900">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="budget"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                        >
                          <option value="" disabled className="bg-neutral-900">
                            Select budget...
                          </option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b} className="bg-neutral-900">
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Timeline + Video Length */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="timeline"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Deadline
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                        >
                          <option value="" disabled className="bg-neutral-900">
                            Select deadline...
                          </option>
                          {TIMELINES.map((t) => (
                            <option key={t} value={t} className="bg-neutral-900">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="length"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Final Video Length
                        </label>
                        <input
                          id="length"
                          name="length"
                          type="text"
                          placeholder="e.g. 30 seconds"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Row 5: Found via + Contact preference */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="foundVia"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          How did you find me?
                        </label>
                        <select
                          id="foundVia"
                          name="foundVia"
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                        >
                          <option value="" disabled className="bg-neutral-900">
                            Select...
                          </option>
                          {FOUND_VIA.map((f) => (
                            <option key={f} value={f} className="bg-neutral-900">
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contactPref"
                          className="block text-xs text-neutral-400 mb-1.5 font-medium"
                        >
                          Preferred contact method
                        </label>
                        <select
                          id="contactPref"
                          name="contactPref"
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                        >
                          <option value="" disabled className="bg-neutral-900">
                            Select...
                          </option>
                          {CONTACT_PREF.map((c) => (
                            <option key={c} value={c} className="bg-neutral-900">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 6: Footage ready */}
                    <div>
                      <label
                        htmlFor="footageReady"
                        className="block text-xs text-neutral-400 mb-1.5 font-medium"
                      >
                        Is your raw footage ready?
                      </label>
                      <select
                        id="footageReady"
                        name="footageReady"
                        defaultValue=""
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                      >
                        <option value="" disabled className="bg-neutral-900">
                          Select...
                        </option>
                        {FOOTAGE_READY.map((f) => (
                          <option key={f} value={f} className="bg-neutral-900">
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Row 7: Clip / Reference Link */}
                    <div>
                      <label
                        htmlFor="references"
                        className="block text-xs text-neutral-400 mb-1.5 font-medium"
                      >
                        📎 Paste your clip or reference link (optional)
                      </label>
                      <input
                        id="references"
                        name="references"
                        type="url"
                        placeholder="https://drive.google.com/...  or  https://we.tl/..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                      />
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Google Drive, Dropbox, WeTransfer, YouTube — any link works.
                      </p>
                    </div>

                    {/* Row 8: Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs text-neutral-400 mb-1.5 font-medium"
                      >
                        Tell me about your project *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        placeholder="Describe your idea, style, key moments, music vibe, anything important..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="mt-2 px-6 py-3 rounded-full text-white font-semibold text-sm md:text-base cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                      style={{
                        background: "linear-gradient(180deg, #C000FF, #8A00E0)",
                        boxShadow:
                          "0 0 25px rgba(192, 0, 255, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      {submitting ? "Sending..." : "Send Message →"}
                    </motion.button>

                    <p className="text-[10px] text-neutral-500 text-center mt-1">
                      I typically respond within 24 hours.
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