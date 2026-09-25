"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  _id?: string;
  title: string;
  category: "saas" | "podcast" | "motion" | "fast";
  vimeoUrl: string;
  order: number;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingProject?: Project | null;
}

const CATEGORIES = [
  { value: "saas", label: "SaaS Animations" },
  { value: "podcast", label: "Head-Tracking / Podcast" },
  { value: "motion", label: "Motion Graphics" },
  { value: "fast", label: "Fast-Paced Reels" },
];

export default function ProjectModal({
  isOpen,
  onClose,
  onSaved,
  editingProject,
}: ProjectModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "saas" | "podcast" | "motion" | "fast"
  >("saas");
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!editingProject?._id;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingProject) {
        setTitle(editingProject.title);
        setCategory(editingProject.category);
        setVimeoUrl(editingProject.vimeoUrl);
        setOrder(editingProject.order);
      } else {
        setTitle("");
        setCategory("saas");
        setVimeoUrl("");
        setOrder(0);
      }
      setError("");
    }
  }, [isOpen, editingProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/projects/${editingProject!._id}`
        : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, vimeoUrl, order }),
      });

      const data = await res.json();

      if (data.success) {
        onSaved();
        onClose();
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
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
              className="relative w-full max-w-lg rounded-3xl p-6 md:p-8 pointer-events-auto max-h-[92vh] overflow-y-auto"
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
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>

              <h2 className="font-display text-2xl font-bold text-white mb-6">
                {isEdit ? "Edit Project" : "Add New Project"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Project Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SaaS Animation 3"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as
                          | "saas"
                          | "podcast"
                          | "motion"
                          | "fast"
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value} className="bg-neutral-900">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vimeo URL */}
                <div>
                  <label
                    htmlFor="vimeoUrl"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Vimeo URL *
                  </label>
                  <input
                    id="vimeoUrl"
                    type="url"
                    required
                    value={vimeoUrl}
                    onChange={(e) => setVimeoUrl(e.target.value)}
                    placeholder="https://vimeo.com/123456789"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Paste the normal Vimeo share link (not the embed).
                  </p>
                </div>

                {/* Order */}
                <div>
                  <label
                    htmlFor="order"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Display Order
                  </label>
                  <input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Lower number = shown first.
                  </p>
                </div>

                {error && (
                  <div className="text-red-400 text-xs text-center py-2">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                  className="mt-2 px-6 py-3 rounded-full text-white font-semibold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  style={{
                    background: "linear-gradient(180deg, #C000FF, #8A00E0)",
                    boxShadow:
                      "0 0 25px rgba(192, 0, 255, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}
                >
                  {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Project"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}