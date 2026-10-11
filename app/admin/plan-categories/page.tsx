"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PlanCategoryModal from "@/components/PlanCategoryModal";

interface Tier {
  tier: "basic" | "advanced";
  name: string;
  startingPrice: number;
  features: string[];
  eligibleServices: string[];
}

interface Category {
  _id: string;
  slug: string;
  name: string;
  icon: string;
  subtitle: string;
  order: number;
  active: boolean;
  tiers: Tier[];
  isCustom?: boolean;
}

export default function AdminPlanCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plan-categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const del = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/plan-categories/${c._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) fetchAll();
    else alert(data.error);
  };

  return (
    <div
      className="min-h-screen bg-[#0a0014] text-white"
      style={{ overflow: "auto", height: "100vh" }}
    >
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0014]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="font-display text-xl font-bold">
              ATB Visuals — Admin
            </h1>
            <p className="text-neutral-500 text-xs mt-0.5">
              {categories.length} plan categories
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-neutral-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/admin/inquiries"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-neutral-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
            >
              Inquiries
            </Link>
            <Link
              href="/admin/testimonials"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-neutral-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
            >
              Testimonials
            </Link>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-600 text-white">
              Plans
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="w-full mb-6 px-6 py-4 rounded-2xl font-semibold text-sm cursor-pointer"
          style={{
            background:
              "linear-gradient(180deg, rgba(192,0,255,0.15), rgba(138,0,224,0.1))",
            border: "1px dashed rgba(192, 0, 255, 0.5)",
            color: "#C000FF",
          }}
        >
          + Add New Plan Category
        </button>

        {loading && (
          <div className="text-center py-20 text-neutral-400">Loading...</div>
        )}

        <div className="flex flex-col gap-3">
          {categories
            .sort((a, b) => a.order - b.order)
            .map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 ${
                  c.active
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-yellow-500/20 bg-yellow-500/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{c.icon}</span>
                      <h3 className="font-display font-bold">{c.name}</h3>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {c.slug}
                      </span>
                      {!c.active && (
                        <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                          INACTIVE
                        </span>
                      )}
                      {c.isCustom && (
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          CUSTOM
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">
                      {c.subtitle} · order {c.order}
                    </p>
                    {!c.isCustom && (
                      <div className="flex flex-wrap gap-2">
                        {c.tiers.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400"
                          >
                            {t.name} · ₹{t.startingPrice}
                          </span>
                        ))}
                        {c.tiers.length === 0 && (
                          <span className="text-[10px] text-neutral-600 italic">
                            No tiers yet
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditing(c);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-purple-500/50 hover:text-purple-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => del(c)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-red-500/50 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <PlanCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchAll}
        editingCategory={editing}
      />
    </div>
  );
}