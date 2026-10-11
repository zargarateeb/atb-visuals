"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TierEditor, { Tier } from "./TierEditor";

interface Category {
  _id?: string;
  slug: string;
  name: string;
  icon: string;
  subtitle: string;
  order: number;
  active: boolean;
  tiers: Tier[];
  isCustom?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingCategory: Category | null;
}

const EMPTY: Category = {
  slug: "",
  name: "",
  icon: "💼",
  subtitle: "",
  order: 0,
  active: true,
  tiers: [],
  isCustom: false,
};

export default function PlanCategoryModal({
  isOpen,
  onClose,
  onSaved,
  editingCategory,
}: Props) {
  const [form, setForm] = useState<Category>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(editingCategory ? { ...editingCategory } : EMPTY);
  }, [isOpen, editingCategory]);

  const save = async () => {
    setSaving(true);
    try {
      const url = form._id
        ? `/api/admin/plan-categories/${form._id}`
        : "/api/admin/plan-categories";
      const method = form._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else {
        alert(data.error || "Save failed");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 pointer-events-auto"
              style={{
                background: "#10001F",
                border: "1.5px solid rgba(160,0,255,0.3)",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-white"
              >
                ✕
              </button>

              <h2 className="font-display text-xl font-bold mb-5">
                {form._id ? "Edit Category" : "New Category"}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <input
                  placeholder="Slug (e.g. reels-shorts)"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  className="col-span-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                />
                <input
                  placeholder="Display name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                />
                <input
                  placeholder="Icon (emoji)"
                  value={form.icon}
                  onChange={(e) =>
                    setForm({ ...form, icon: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                />
                <input
                  placeholder="Subtitle"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  className="col-span-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: Number(e.target.value) })
                  }
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                />
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm col-span-2">
                  <input
                    type="checkbox"
                    checked={!!form.isCustom}
                    onChange={(e) =>
                      setForm({ ...form, isCustom: e.target.checked })
                    }
                  />
                  This is the Custom / Build Your Own category
                </label>
              </div>

              {!form.isCustom && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Tiers
                  </p>
                  <TierEditor
                    tiers={form.tiers}
                    onChange={(tiers) => setForm({ ...form, tiers })}
                  />
                </>
              )}

              <button
                onClick={save}
                disabled={saving}
                className="mt-5 w-full py-3 rounded-full font-bold text-sm cursor-pointer disabled:opacity-50"
                style={{
                  background: "linear-gradient(180deg, #C000FF, #8A00E0)",
                  color: "#FFFFFF",
                }}
              >
                {saving ? "Saving..." : form._id ? "Save Changes" : "Create"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}