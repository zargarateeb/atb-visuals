"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
<Link
  href="/admin/testimonials"
  className="text-xs text-neutral-500 hover:text-purple-400 transition-colors"
>
  Testimonials →
</Link>

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  brand?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  length?: string;
  foundVia?: string;
  contactPref?: string;
  footageReady?: string;
  references?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i._id === id ? { ...i, read: !currentRead } : i))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      setInquiries((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = inquiries.filter((i) => {
    if (filter === "unread") return !i.read;
    if (filter === "read") return i.read;
    return true;
  });

  const unreadCount = inquiries.filter((i) => !i.read).length;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
  <Link
    href="/admin"
    className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-purple-400 transition-colors mb-3"
  >
    ← Back to Projects
  </Link>
  <h1 className="font-display text-3xl font-bold text-white">
    Inquiries
  </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {inquiries.length} total · {unreadCount} unread
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "unread", "read"] as const).map((f) => (
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
              {f === "unread" && unreadCount > 0 && (
                <span className="ml-2 bg-white/20 px-1.5 rounded">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-neutral-400">
            Loading inquiries...
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            {filter === "unread"
              ? "No unread inquiries. You're caught up! ✨"
              : "No inquiries yet."}
          </div>
        )}

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.map((inquiry) => (
            <motion.div
              key={inquiry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border transition-colors ${
                inquiry.read
                  ? "border-white/5 bg-white/[0.02]"
                  : "border-purple-500/40 bg-purple-500/[0.05]"
              }`}
            >
              {/* Header row */}
              <div
                className="flex items-center justify-between gap-4 p-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(
                    expandedId === inquiry._id ? null : inquiry._id
                  )
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!inquiry.read && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    )}
                    <p className="font-semibold text-sm text-white truncate">
                      {inquiry.name}
                    </p>
                    <span className="text-xs text-neutral-500 truncate">
                      · {inquiry.projectType}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {inquiry.email} · {formatDate(inquiry.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(inquiry._id, inquiry.read);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-purple-500/50 hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    {inquiry.read ? "Unread" : "Read"}
                  </button>
                  <span className="text-neutral-500 text-xs">
                    {expandedId === inquiry._id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedId === inquiry._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <Detail label="Email" value={inquiry.email} />
                      {inquiry.phone && (
                        <Detail label="Phone" value={inquiry.phone} />
                      )}
                      {inquiry.brand && (
                        <Detail label="Brand" value={inquiry.brand} />
                      )}
                      <Detail label="Project Type" value={inquiry.projectType} />
                      {inquiry.budget && (
                        <Detail label="Budget" value={inquiry.budget} />
                      )}
                      {inquiry.timeline && (
                        <Detail label="Deadline" value={inquiry.timeline} />
                      )}
                      {inquiry.length && (
                        <Detail label="Video Length" value={inquiry.length} />
                      )}
                      {inquiry.foundVia && (
                        <Detail label="Found Via" value={inquiry.foundVia} />
                      )}
                      {inquiry.contactPref && (
                        <Detail
                          label="Preferred Contact"
                          value={inquiry.contactPref}
                        />
                      )}
                      {inquiry.footageReady && (
                        <Detail
                          label="Footage Ready"
                          value={inquiry.footageReady}
                        />
                      )}
                      {inquiry.references && (
                        <div className="md:col-span-2">
                          <Detail
                            label="References"
                            value={inquiry.references}
                          />
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <p className="text-xs text-neutral-500 mb-1 font-medium">
                          Message
                        </p>
                        <p className="text-white text-sm whitespace-pre-wrap">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 flex items-center gap-2 flex-wrap">
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: Your inquiry about ${inquiry.projectType}`}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      >
                        📧 Reply via Email
                      </a>
                      {inquiry.phone && (
                        <a
                          href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="px-4 py-2 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-auto"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-500 mb-1 font-medium">{label}</p>
      <p className="text-white text-sm break-words">{value}</p>
    </div>
  );
}