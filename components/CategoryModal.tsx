"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  shape: "vertical" | "horizontal";
  order: number;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingCategory?: Category | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSaved,
  editingCategory,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shape, setShape] = useState<"vertical" | "horizontal">("vertical");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!editingCategory?._id;

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    // Only auto-fill slug if adding new category (not editing)
    if (!isEdit) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(autoSlug);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setName(editingCategory.name);
        setSlug(editingCategory.slug);
        setDescription(editingCategory.description || "");
        setShape(editingCategory.shape);
        setOrder(editingCategory.order);
      } else {
        setName("");
        setSlug("");
        setDescription("");
        setShape("vertical");
        setOrder(0);
      }
      setError("");
    }
  }, [isOpen, editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/categories/${editingCategory!._id}`
        : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, shape, order }),
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

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
                {isEdit ? "Edit Category" : "Add New Category"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="cat-name"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Display Name *
                  </label>
                  <input
                    id="cat-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Case Studies"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="cat-slug"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Slug * (URL-safe, no spaces)
                  </label>
                  <input
                    id="cat-slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="case-studies"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm font-mono"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Used internally. Must be unique. Lowercase + hyphens.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="cat-description"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Description / Subtitle
                  </label>
                  <input
                    id="cat-description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Long-form breakdowns of my best work"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* Shape */}
                <div>
                  <label
                    htmlFor="cat-shape"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Video Card Shape *
                  </label>
                  <select
                    id="cat-shape"
                    required
                    value={shape}
                    onChange={(e) =>
                      setShape(e.target.value as "vertical" | "horizontal")
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    <option value="vertical" className="bg-neutral-900">
                      Vertical (9:16 — Reels, Shorts, TikTok)
                    </option>
                    <option value="horizontal" className="bg-neutral-900">
                      Horizontal (16:9 — YouTube, SaaS ads)
                    </option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label
                    htmlFor="cat-order"
                    className="block text-xs text-neutral-400 mb-1.5 font-medium"
                  >
                    Display Order
                  </label>
                  <input
                    id="cat-order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Lower number shows first. Auto-sorted in admin.
                  </p>
                </div>

                {error && (
                  <div className="text-red-400 text-xs text-center py-2">
                    {error}
                  </div>
                )}

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
                  {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Category"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}