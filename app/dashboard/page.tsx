"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { useProjects } from "./useProjects";
import DashboardHeader from "./DashboardHeader";
import CreateProjectForm from "./CreateProjectForm";
import ProjectGrid from "./ProjectGrid";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const projects = useProjects(status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || projects.loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!session) return null;

  return (
    <Box minHeight="100vh" px={4} py={6}>
      <DashboardHeader
        userLabel={session.user?.name || session.user?.email || ""}
      />

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h6">My Projects</Typography>
        <Button
          variant="contained"
          onClick={() => projects.setShowCreateForm(!projects.showCreateForm)}
        >
          {projects.showCreateForm ? "Cancel" : "Create New Project"}
        </Button>
      </Box>

      {projects.showCreateForm && (
        <CreateProjectForm
          name={projects.name}
          setName={projects.setName}
          role={projects.role}
          setRole={projects.setRole}
          description={projects.description}
          setDescription={projects.setDescription}
          creating={projects.creating}
          onSubmit={projects.createProject}
        />
      )}

      <ProjectGrid
        projects={projects.projects}
        onDelete={projects.deleteProject}
      />
    </Box>
  );
}
