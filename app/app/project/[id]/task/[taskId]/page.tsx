"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";
import AppHeader from "@/app/components/AppHeader";
import AddSkillModal from "@/app/components/AddSkillsModal";
import type { Task } from "@/app/components/NewTaskModal";

interface Project {
  id: string;
  name: string;
  owner_id: string;
}

interface Volunteer {
  user_id: string;
  volunteered_at: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Skill {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
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

/** Returns up-to-2-character initials from a display name or user id. */
function initials(displayName: string | null, userId: string): string {
  const source = displayName?.trim() || userId;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function TaskPage() {
  const { id: projectId, taskId } = useParams<{ id: string; taskId: string }>();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [task, setTask] = useState<Task | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [myProfile, setMyProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const supabase = getSupabase();

  // Edit state
  const [editing, setEditing] = useState(false);
  const [draftDescription, setDraftDescription] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Skill state
  const [showAddSkills, setShowAddSkills] = useState(false);

  // Volunteer state
  const [volunteerStatus, setVolunteerStatus] = useState<"idle" | "loading">("idle");

  // Assign state
  const [assigningTo, setAssigningTo] = useState<string | null>(null);

  // Assignee action state
  const [actionStatus, setActionStatus] = useState<"idle" | "loading">("idle");

  const isOwner = !!userId && project?.owner_id === userId;
  const isAssignee = !!userId && !!task?.assigned_to && task.assigned_to === userId;

  const canEdit =
    !!userId &&
    !!task &&
    (task.created_by === userId || project?.owner_id === userId);

  const isVolunteered = !!userId && volunteers.some((v) => v.user_id === userId);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setEmail(data.user.email ?? "");

      const [
        { data: projectRow },
        { data: taskRow },
        { data: volunteerRows },
        { data: profileRow },
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, owner_id")
          .eq("id", projectId)
          .maybeSingle(),
        supabase
          .from("tasks")
          .select("id, title, description, status, created_by, assigned_to")
          .eq("id", taskId)
          .eq("project_id", projectId)
          .maybeSingle(),
        supabase
          .from("task_volunteers")
          .select("user_id, volunteered_at, profiles(display_name, avatar_url)")
          .eq("task_id", taskId)
          .order("volunteered_at", { ascending: true }),
        supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle(),
      ]);

      if (!taskRow || !projectRow) {
        setNotFound(true);
      } else {
        setProject(projectRow);
        setTask({ ...(taskRow as Task), assigned_to: (taskRow as Task).assigned_to ?? null });
        setDraftDescription(taskRow.description ?? "");
        setVolunteers((volunteerRows ?? []) as Volunteer[]);
        setMyProfile(profileRow ?? null);
      }

      setLoading(false);
    });
  }, [projectId, taskId, router]);

  // Focus textarea when edit mode opens
  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  function startEditing() {
    setDraftDescription(task?.description ?? "");
    setSaveStatus("idle");
    setSaveError("");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setSaveStatus("idle");
  }

  async function saveDescription() {
    if (!task) return;
    setSaveStatus("saving");
    setSaveError("");

    const { error } = await supabase
      .from("tasks")
      .update({ description: draftDescription.trim() || null })
      .eq("id", task.id);

    if (error) {
      setSaveError(error.message);
      setSaveStatus("error");
    } else {
      setTask((prev) => prev ? { ...prev, description: draftDescription.trim() || null } : prev);
      setEditing(false);
      setSaveStatus("idle");
    }
  }

  async function handleVolunteer() {
    if (!userId) return;
    setVolunteerStatus("loading");

    if (isVolunteered) {
      const { error } = await supabase
        .from("task_volunteers")
        .delete()
        .eq("task_id", taskId)
        .eq("user_id", userId);

      if (!error) {
        setVolunteers((prev) => prev.filter((v) => v.user_id !== userId));
      }
    } else {
      const { error } = await supabase
        .from("task_volunteers")
        .insert({ task_id: taskId, user_id: userId });

      if (!error) {
        const newVolunteer: Volunteer = {
          user_id: userId,
          volunteered_at: new Date().toISOString(),
          profiles: myProfile
            ? { display_name: myProfile.display_name, avatar_url: myProfile.avatar_url }
            : null,
        };
        setVolunteers((prev) => [...prev, newVolunteer]);
      }
    }

    setVolunteerStatus("idle");
  }

  async function handleAddSkillsOpen() {
    setShowAddSkills(true);
  }

  async function handleAddSkillClose() {
  }

  async function handleAssign(volunteerId: string) {
    if (!task) return;
    const newAssignee = task.assigned_to === volunteerId ? null : volunteerId;
    setAssigningTo(volunteerId);

    const { error } = await supabase
      .from("tasks")
      .update({ assigned_to: newAssignee })
      .eq("id", task.id);

    if (!error) {
      setTask((prev) => prev ? { ...prev, assigned_to: newAssignee } : prev);
    }
    setAssigningTo(null);
  }

  async function handleAssigneeAction(newStatus: Task["status"]) {
    if (!task) return;
    setActionStatus("loading");

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (!error) {
      setTask((prev) => prev ? { ...prev, status: newStatus } : prev);
    }
    setActionStatus("idle");
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
        <p className="text-slate-400 text-lg">Task not found.</p>
        <Link href={`/project/${projectId}`} className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          ← Back to project
        </Link>
      </main>
    );
  }

  // Derive the action button(s) for the assignee based on current status
  const assigneeActions: { label: string; nextStatus: Task["status"]; style: string }[] = [];
  if (isAssignee && task) {
    if (task.status === "backlog") {
      assigneeActions.push({ label: "Advocate", nextStatus: "todo", style: "bg-slate-600 hover:bg-slate-500 text-white" });
    } else if (task.status === "todo") {
      assigneeActions.push({ label: "Start", nextStatus: "in_progress", style: "bg-indigo-600 hover:bg-indigo-500 text-white" });
    } else if (task.status === "in_progress") {
      assigneeActions.push({ label: "Ready for Review", nextStatus: "in_review", style: "bg-amber-600 hover:bg-amber-500 text-white" });
    } else if (task.status === "in_review") {
      assigneeActions.push({ label: "Accept", nextStatus: "done", style: "bg-emerald-600 hover:bg-emerald-500 text-white" });
      assigneeActions.push({ label: "Request Changes", nextStatus: "in_progress", style: "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white" });
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex flex-col">
      {userId && <AppHeader userId={userId} email={email} />}

      <div className="flex-1 px-8 py-10 max-w-3xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
            Projects
          </Link>
          <span className="text-slate-700">/</span>
          <Link href={`/project/${projectId}`} className="text-slate-500 hover:text-slate-300 transition-colors">
            {project?.name}
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400 truncate max-w-xs">{task?.title}</span>
        </nav>

        {/* Task header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-white leading-snug">{task?.title}</h1>
          <span className={`shrink-0 mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[task!.status]}`}>
            {STATUS_LABEL[task!.status]}
          </span>
        </div>

        {/* Assignee action buttons */}
        {assigneeActions.length > 0 && (
          <div className="flex gap-3 mb-6">
            {assigneeActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleAssigneeAction(action.nextStatus)}
                disabled={actionStatus === "loading"}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.style}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Description */}
          <section className="rounded-xl bg-slate-800/60 border border-slate-700 px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Description</h2>
              {canEdit && !editing && (
                <button
                  onClick={startEditing}
                  className="text-slate-500 hover:text-indigo-400 text-xs transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.474ZM4.75 14.25h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 0 1.5Z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="flex flex-col gap-3">
                <textarea
                  ref={textareaRef}
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  rows={6}
                  maxLength={1000}
                  placeholder="Add a description…"
                  className="w-full rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                {saveStatus === "error" && (
                  <p className="text-red-400 text-xs">{saveError}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEditing}
                    className="rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 px-4 py-2 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveDescription}
                    disabled={saveStatus === "saving"}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 text-sm transition-colors"
                  >
                    {saveStatus === "saving" ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={canEdit ? startEditing : undefined}
                className={canEdit ? "cursor-text" : undefined}
              >
                {task?.description ? (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-slate-600 text-sm italic">
                    {canEdit ? "Click to add a description…" : "No description provided."}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Volunteers */}
          <section className="rounded-xl bg-slate-800/60 border border-slate-700 px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Volunteers
                {volunteers.length > 0 && (
                  <span className="ml-2 text-slate-500">{volunteers.length}</span>
                )}
              </h2>
              <button
                onClick={handleVolunteer}
                disabled={volunteerStatus === "loading"}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isVolunteered
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {isVolunteered ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.78-4.22a.75.75 0 0 1-1.06 0L8 8.06 5.28 10.78a.75.75 0 0 1-1.06-1.06L6.94 7 4.22 4.28a.75.75 0 0 1 1.06-1.06L8 5.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 7l2.72 2.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                    </svg>
                    Withdraw
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    Volunteer
                  </>
                )}
              </button>
            </div>

            {volunteers.length === 0 ? (
              <p className="text-slate-600 text-sm italic">No volunteers yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {volunteers.map((v) => {
                  const name = v.profiles?.display_name ?? null;
                  const isMe = v.user_id === userId;
                  const isAssigned = task?.assigned_to === v.user_id;
                  const isAssigning = assigningTo === v.user_id;
                  return (
                    <li key={v.user_id} className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden">
                        {v.profiles?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.profiles.avatar_url} alt={name ?? v.user_id} className="w-full h-full object-cover" />
                        ) : (
                          initials(name, v.user_id)
                        )}
                      </div>

                      {/* Name */}
                      <span className="text-slate-300 text-sm flex-1 min-w-0 truncate">
                        {name ?? <span className="text-slate-500 italic">Unnamed user</span>}
                        {isMe && <span className="ml-1.5 text-slate-500 text-xs">(you)</span>}
                      </span>

                      {/* Assigned badge */}
                      {isAssigned && (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-xs font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                          </svg>
                          Assigned
                        </span>
                      )}

                      {/* Assign / Unassign button — owner only */}
                      {isOwner && (
                        <button
                          onClick={() => handleAssign(v.user_id)}
                          disabled={isAssigning}
                          aria-label={isAssigned ? "Unassign" : "Assign"}
                          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isAssigned
                              ? "border border-slate-600 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                              : "border border-slate-600 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400"
                          }`}
                        >
                          {isAssigning ? "…" : isAssigned ? "Unassign" : "Assign"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Skills */}
          <section className="rounded-xl bg-slate-800/60 border border-slate-700 px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Skills
                {skills.length > 0 && (
                  <span className="ml-2 text-slate-500">{skills.length}</span>
                )}
              </h2>

              <button
                  onClick={handleAddSkillsOpen}
                  className="text-slate-500 hover:text-indigo-400 text-xs transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.474ZM4.75 14.25h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 0 1.5Z" />
                  </svg>
                  Edit
                </button>
            </div>

            {skills.length === 0 ? (
              <p className="text-slate-600 text-sm italic">No skills needed.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {skills.map((v) => {
                  const name = v.name ?? null;
                  return (
                    <li key={v.id} className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden">
                        {v.iconUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.iconUrl} alt={name ?? v.name} className="w-full h-full object-cover" />
                        ) : (
                          initials(name, v.id)
                        )}
                      </div>

                      {/* Name */}
                      <span className="text-slate-300 text-sm flex-1 min-w-0 truncate">
                        {name ?? <span className="text-slate-500 italic">Unnamed skill</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>

      {showAddSkills && userId && project && (
        <AddSkillModal
        projectId={project.id}
        userId={userId}
        onClose={() => setShowAddSkills(false)}
        onCreated={handleAddSkillClose}
        />
      )}
    </main>
  );
}
