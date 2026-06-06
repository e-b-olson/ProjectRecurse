"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";
import NewProjectModal from "@/app/components/NewProjectModal";
import AppHeader from "@/app/components/AppHeader";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setEmail(data.user.email ?? "");

      const { data: rows } = await supabase
        .from("projects")
        .select("id, name, description")
        .order("created_at", { ascending: false });

      setProjects(rows ?? []);
      setLoading(false);
    });
  }, [router]);

  function handleProjectCreated(project: Project) {
    setProjects((prev) => [project, ...prev]);
    setShowNewProject(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <span className="text-slate-500 text-sm">Loading…</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex flex-col">
      {userId && <AppHeader userId={userId} email={email} />}

      <div className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-2xl font-bold">Projects</h2>
          <button
            onClick={() => setShowNewProject(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
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
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-slate-400 text-lg mb-2">No projects yet</p>
            <p className="text-slate-600 text-sm">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/project/${p.id}`}
                  className="block rounded-xl bg-slate-800/60 border border-slate-700 px-6 py-5 hover:border-indigo-500/50 hover:bg-slate-800 transition-colors"
                >
                  <h3 className="text-white font-semibold text-base mb-1 truncate">{p.name}</h3>
                  {p.description && (
                    <p className="text-slate-400 text-sm line-clamp-2">{p.description}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showNewProject && userId && (
        <NewProjectModal
          userId={userId}
          onClose={() => setShowNewProject(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </main>
  );
}
