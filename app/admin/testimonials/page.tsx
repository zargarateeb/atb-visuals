"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  projectType: string;
  rating: number;
  text: string;
  email: string;
  avatarUrl?: string;
  verified: boolean;
  approved: boolean;
  createdAt: string;
}

type Filter = "all" | "pending" | "approved";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials?all=true");
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
      else setError(data.error || "Failed to load");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const updateField = async (
    id: string,
    updates: Partial<Testimonial>
  ) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, ...updates } : t))
        );
      } else {
        alert(data.error || "Failed to update");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial permanently?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = testimonials.filter((t) => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  const total = testimonials.length;
  const pending = testimonials.filter((t) => !t.approved).length;
  const approved = testimonials.filter((t) => t.approved).length;
  const avgRating =
    approved > 0
      ? (
          testimonials
            .filter((t) => t.approved)
            .reduce((sum, t) => sum + t.rating, 0) / approved
        ).toFixed(1)
      : "—";

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen bg-[#0a0014] text-white"
      style={{ overflow: "auto", height: "100vh" }}
    >
      {/* Top Bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0014]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="font-display text-xl font-bold">
              ATB Visuals — Admin
            </h1>
            <p className="text-neutral-500 text-xs mt-0.5">
              {total} testimonials · {pending} pending · {approved} approved
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
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-600 text-white">
              Testimonials
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total" value={total.toString()} />
          <StatCard
            label="Pending"
            value={pending.toString()}
            color="#E6A23C"
          />
          <StatCard
            label="Approved"
            value={approved.toString()}
            color="#10B981"
          />
          <StatCard label="Avg Rating" value={`${avgRating} ★`} />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "border border-white/10 text-neutral-400 hover:border-purple-500/50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "pending" && pending > 0 && (
                <span className="ml-2 bg-white/20 px-1.5 rounded">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-neutral-400">
            Loading testimonials...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            {filter === "pending"
              ? "No pending testimonials. All caught up! ✨"
              : filter === "approved"
              ? "No approved testimonials yet."
              : "No testimonials yet."}
          </div>
        )}

        {/* List */}
        <div className="flex flex-col gap-4">
          {filtered.map((t) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${
                t.approved
                  ? "border-green-500/30 bg-green-500/[0.03]"
                  : "border-yellow-500/30 bg-yellow-500/[0.03]"
              }`}
            >
              {/* Status Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    t.approved
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {t.approved ? "✓ Approved" : "⏳ Pending"}
                </span>
                {t.verified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400">
                    ⭐ Verified Client
                  </span>
                )}
                <span className="text-neutral-500 text-xs ml-auto">
                  {formatDate(t.createdAt)}
                </span>
              </div>

              {/* Rating + Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= t.rating ? "text-yellow-500" : "text-neutral-700"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">
                  {t.name}
                </span>
                {(t.role || t.company) && (
                  <span className="text-xs text-neutral-500">
                    · {[t.role, t.company].filter(Boolean).join(" @ ")}
                  </span>
                )}
              </div>

              {/* Project type */}
              <p className="text-xs text-purple-400 mb-3">
                {t.projectType}
              </p>

              {/* Review text */}
              <p className="text-sm text-neutral-200 leading-relaxed mb-4 whitespace-pre-wrap">
                {t.text}
              </p>

              {/* Email */}
              <p className="text-xs text-neutral-500 mb-4">
                📧 {t.email}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {!t.approved ? (
                  <button
                    onClick={() =>
                      updateField(t._id, { approved: true })
                    }
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer"
                  >
                    ✓ Approve
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      updateField(t._id, { approved: false })
                    }
                    className="px-4 py-2 rounded-lg text-xs font-medium border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-colors cursor-pointer"
                  >
                    ⏳ Unapprove
                  </button>
                )}

                <button
                  onClick={() =>
                    updateField(t._id, { verified: !t.verified })
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    t.verified
                      ? "border-blue-500/40 text-blue-400 hover:bg-blue-500/10"
                      : "border-white/10 text-neutral-400 hover:border-blue-500/50 hover:text-blue-400"
                  }`}
                >
                  {t.verified ? "★ Verified" : "☆ Mark Verified"}
                </button>

                <a
                  href={`mailto:${t.email}`}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-white/10 text-neutral-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
                >
                  📧 Reply
                </a>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-auto"
                >
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
      <p className="text-neutral-500 text-xs font-medium mb-1">{label}</p>
      <p
        className="font-display text-2xl font-bold"
        style={{ color: color || "white" }}
      >
        {value}
      </p>
    </div>
  );
}