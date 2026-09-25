"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Project {
  _id: string;
  title: string;
  category: "saas" | "podcast" | "motion" | "fast";
  vimeoUrl: string;
  order: number;
}

interface SortableProjectRowProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  deleting: string | null;
}

export default function SortableProjectRow({
  project,
  onEdit,
  onDelete,
  deleting,
}: SortableProjectRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border bg-white/[0.03] transition-colors ${
        isDragging
          ? "border-purple-500 bg-purple-500/10"
          : "border-white/10 hover:bg-white/[0.06]"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-purple-400 transition-colors p-1 flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{project.title}</p>
        <a
          href={project.vimeoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-500 hover:text-purple-400 truncate block"
        >
          {project.vimeoUrl}
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(project)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-purple-500/50 hover:text-purple-400 transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project)}
          disabled={deleting === project._id}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
        >
          {deleting === project._id ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}