"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";
import AppHeader from "@/app/components/AppHeader";
import NewTaskModal from "@/app/components/NewTaskModal";
import type { Task } from "@/app/components/NewTaskModal";

interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
}

const STATUS_LABEL: Record<Task["status"], string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

const STATUS_STYLE: Record<Task["status"], string> = {
  backlog: "bg-slate-700/60 text-slate-400",
  todo: "bg-slate-700 text-slate-300",
  in_progress: "bg-indigo-500/20 text-indigo-300",
  in_review: "bg-amber-500/20 text-amber-300",
  done: "bg-emerald-500/20 text-emerald-400",
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const supabase = getSupabase();

  const isOwner = !!userId && project?.owner_id === userId;

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setEmail(data.user.email ?? "");

      const [{ data: projectRow, error }, { data: taskRows }] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, description, owner_id")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("tasks")
          .select("id, title, description, status, created_by, assigned_to")
          .eq("project_id", id)
          .order("created_at", { ascending: true }),
      ]);

      if (error || !projectRow) {
        setNotFound(true);
      } else {
        setProject(projectRow);
        setTasks((taskRows ?? []) as Task[]);
      }

      setLoading(false);
    });
  }, [id, router]);

  function handleTaskCreated(task: Task) {
    setTasks((prev) => [...prev, task]);
    setShowNewTask(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <span className="text-slate-500 text-sm">Loading…</span>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-lg">Project not found.</p>
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex flex-col">
      {userId && <AppHeader userId={userId} email={email} />}

      <div className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Projects
          </Link>
        </nav>

        {/* Project header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">{project?.name}</h1>
          {project?.description ? (
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
              {project.description}
            </p>
          ) : (
            <p className="text-slate-600 text-sm italic">No description provided.</p>
          )}
        </div>

        {/* Tasks section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-xl font-semibold">Tasks</h2>
            {isOwner && (
              <button
                onClick={() => setShowNewTask(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 text-sm transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Add Task
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-slate-700/50 border-dashed px-6 py-12 text-center">
              <p className="text-slate-500 text-sm">No tasks yet.</p>
              {isOwner && (
                <p className="text-slate-600 text-xs mt-1">
                  Use &ldquo;Add Task&rdquo; to create the first one.
                </p>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/project/${id}/task/${task.id}`}
                    className="flex items-start justify-between gap-4 rounded-xl bg-slate-800/60 border border-slate-700 px-5 py-4 hover:border-indigo-500/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[task.status]}`}
                    >
                      {STATUS_LABEL[task.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Placeholder sections */}
        <div className="grid gap-4 sm:grid-cols-2 mt-8">
          {(["Features", "Contributors"] as const).map((section) => (
            <div
              key={section}
              className="rounded-xl border border-slate-700/50 border-dashed px-6 py-8 text-center"
            >
              <p className="text-slate-600 text-sm">{section}</p>
              <p className="text-slate-700 text-xs mt-1">Coming soon</p>
            </div>
          ))}
        </div>
      </div>

      {showNewTask && userId && project && (
        <NewTaskModal
          projectId={project.id}
          userId={userId}
          onClose={() => setShowNewTask(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </main>
  );
}
