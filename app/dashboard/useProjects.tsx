"use client";

import { useEffect, useState } from "react";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useProjects(status: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        setProjects(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!role.trim()) {
      alert("Please enter a role for the agent.");
      return;
    }

    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          role: role.trim(),
        }),
      });

      if (res.ok) {
        setName("");
        setDescription("");
        setRole("");
        setShowCreateForm(false);
        fetchProjects();
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
  };

  return {
    projects,
    loading,
    creating,
    showCreateForm,
    setShowCreateForm,
    name,
    setName,
    description,
    setDescription,
    role,
    setRole,
    createProject,
    deleteProject,
  };
}
