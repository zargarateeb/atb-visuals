"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ProjectModal from "@/components/ProjectModal";
import SortableProjectRow from "@/components/SortableProjectRow";

interface Project {
  _id: string;
  title: string;
  category: "saas" | "podcast" | "motion" | "fast";
  vimeoUrl: string;
  order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  saas: "SaaS Animations",
  podcast: "Head-Tracking / Podcast",
  motion: "Motion Graphics",
  fast: "Fast-Paced Reels",
};

const CATEGORY_ORDER = ["saas", "podcast", "motion", "fast"];

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.error || "Failed to load projects");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    setDeleting(project._id);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        fetchProjects();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(null);
    }
  };

  const handleDragEnd = async (
    category: string,
    event: DragEndEvent
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const categoryProjects = projects
      .filter((p) => p.category === category)
      .sort((a, b) => a.order - b.order);

    const oldIndex = categoryProjects.findIndex((p) => p._id === active.id);
    const newIndex = categoryProjects.findIndex((p) => p._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categoryProjects, oldIndex, newIndex);

    // Update local state immediately
    setProjects((prev) => {
      const others = prev.filter((p) => p.category !== category);
      const updated = reordered.map((p, i) => ({ ...p, order: i }));
      return [...others, ...updated];
    });

    // Send to server
    try {
      await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((p, i) => ({ id: p._id, order: i })),
        }),
      });
    } catch (err) {
      console.error("Reorder failed:", err);
      // Revert on failure
      fetchProjects();
    }
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, Project[]>>(
    (acc, cat) => {
      acc[cat] = projects
        .filter((p) => p.category === cat)
        .sort((a, b) => a.order - b.order);
      return acc;
    },
    {}
  );

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
              {projects.length} projects · {CATEGORY_ORDER.length} categories
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-2">
  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-600 text-white">
    Projects
  </span>
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
</nav>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-white/15 hover:bg-white/5 transition-colors cursor-pointer"
        >
          Log Out
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        <motion.button
          onClick={handleAdd}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mb-8 px-6 py-4 rounded-2xl font-semibold text-sm cursor-pointer"
          style={{
            background:
              "linear-gradient(180deg, rgba(192,0,255,0.15), rgba(138,0,224,0.1))",
            border: "1px dashed rgba(192, 0, 255, 0.5)",
            color: "#C000FF",
          }}
        >
          + Add New Project
        </motion.button>

        {loading && (
          <div className="text-center py-20 text-neutral-400">
            Loading projects...
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {!loading &&
          !error &&
          CATEGORY_ORDER.map((cat) => (
            <div key={cat} className="mb-10">
              <h2 className="font-display text-lg font-semibold text-neutral-300 mb-4">
                {CATEGORY_LABELS[cat]}{" "}
                <span className="text-neutral-600 text-sm font-normal">
                  ({grouped[cat]?.length || 0})
                </span>
              </h2>

              {grouped[cat]?.length === 0 ? (
                <p className="text-neutral-600 text-sm italic pl-2">
                  No projects in this category
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(cat, event)}
                >
                  <SortableContext
                    items={grouped[cat].map((p) => p._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3">
                      {grouped[cat].map((project) => (
                        <SortableProjectRow
                          key={project._id}
                          project={project}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          deleting={deleting}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          ))}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchProjects}
        editingProject={editingProject}
      />
    </div>
  );
}