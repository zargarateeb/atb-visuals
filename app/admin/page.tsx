"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
import CategoryModal from "@/components/CategoryModal";
import SortableProjectRow from "@/components/SortableProjectRow";

interface Project {
  _id: string;
  title: string;
  category: string;
  vimeoUrl: string;
  thumbnailUrl?: string;
  order: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shape: "vertical" | "horizontal";
  order: number;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [projRes, catRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/categories"),
      ]);
      const projData = await projRes.json();
      const catData = await catRes.json();
      if (projData.success) setProjects(projData.projects);
      if (catData.success) setCategories(catData.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setDeleting(project._id);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchAll();
      else alert(data.error || "Failed to delete");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(null);
    }
  };

  const handleProjectDragEnd = async (
    categorySlug: string,
    event: DragEndEvent
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const categoryProjects = projects
      .filter((p) => p.category === categorySlug)
      .sort((a, b) => a.order - b.order);

    const oldIndex = categoryProjects.findIndex((p) => p._id === active.id);
    const newIndex = categoryProjects.findIndex((p) => p._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categoryProjects, oldIndex, newIndex);

    setProjects((prev) => {
      const others = prev.filter((p) => p.category !== categorySlug);
      const updated = reordered.map((p, i) => ({ ...p, order: i }));
      return [...others, ...updated];
    });

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
      fetchAll();
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (
      !confirm(
        `Delete category "${category.name}"? This will only work if no projects use it.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchAll();
      else alert(data.error || "Failed to delete");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const grouped: Record<string, Project[]> = {};
  categories.forEach((cat) => {
    grouped[cat.slug] = projects
      .filter((p) => p.category === cat.slug)
      .sort((a, b) => a.order - b.order);
  });

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
              {projects.length} projects · {categories.length} categories
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
          onClick={handleAddProject}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mb-6 px-6 py-4 rounded-2xl font-semibold text-sm cursor-pointer"
          style={{
            background:
              "linear-gradient(180deg, rgba(192,0,255,0.15), rgba(138,0,224,0.1))",
            border: "1px dashed rgba(192, 0, 255, 0.5)",
            color: "#C000FF",
          }}
        >
          + Add New Project
        </motion.button>

        {/* Categories Section */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <button
            onClick={() => setCategoriesOpen((o) => !o)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 text-xs">
                {categoriesOpen ? "▼" : "▶"}
              </span>
              <span className="font-display font-semibold text-sm">
                Categories
              </span>
              <span className="text-neutral-500 text-xs">
                ({categories.length})
              </span>
            </div>
            <span className="text-neutral-500 text-xs">
              Manage portfolio sections
            </span>
          </button>

          <AnimatePresence>
            {categoriesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-white/5"
              >
                <div className="p-5 flex flex-col gap-3">
                  {categories.length === 0 ? (
                    <p className="text-neutral-500 text-sm italic">
                      No categories yet.
                    </p>
                  ) : (
                    [...categories]
                      .sort((a, b) => a.order - b.order)
                      .map((cat) => (
                        <div
                          key={cat._id}
                          className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{cat.name}</p>
                              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                                {cat.slug}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 truncate">
                              {cat.description || "No description"} ·{" "}
                              {cat.shape} · order {cat.order}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEditCategory(cat)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-purple-500/50 hover:text-purple-400 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                  )}

                  <button
                    onClick={handleAddCategory}
                    className="mt-2 w-full px-4 py-3 rounded-xl text-xs font-semibold border border-dashed border-purple-500/40 text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer"
                  >
                    + Add Category
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {loading && (
          <div className="text-center py-20 text-neutral-400">Loading...</div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {!loading &&
          !error &&
          [...categories]
            .sort((a, b) => a.order - b.order)
            .map((cat) => (
              <div key={cat._id} className="mb-10">
                <h2 className="font-display text-lg font-semibold text-neutral-300 mb-4">
                  {cat.name}{" "}
                  <span className="text-neutral-600 text-sm font-normal">
                    ({grouped[cat.slug]?.length || 0})
                  </span>
                </h2>

                {grouped[cat.slug]?.length === 0 ? (
                  <p className="text-neutral-600 text-sm italic pl-2">
                    No projects in this category
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) =>
                      handleProjectDragEnd(cat.slug, event)
                    }
                  >
                    <SortableContext
                      items={grouped[cat.slug].map((p) => p._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-3">
                        {grouped[cat.slug].map((project) => (
                          <SortableProjectRow
                            key={project._id}
                            project={project}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
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
        onSaved={fetchAll}
        editingProject={editingProject}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={fetchAll}
        editingCategory={editingCategory}
      />
    </div>
  );
}