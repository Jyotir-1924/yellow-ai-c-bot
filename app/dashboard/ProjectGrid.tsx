"use client";

import Link from "next/link";
import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Project } from "./useProjects";

export default function ProjectGrid({
  projects,
  onDelete,
}: {
  projects: Project[];
  onDelete: (id: string) => void;
}) {
  if (projects.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <Typography>No projects yet. Create one to get started.</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid key={project.id} size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <Box
              component={Link}
              href={`/projects/${project.id}`}
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
              }}
            />
            <Box zIndex={2}>
              <Typography variant="h6" gutterBottom>
                {project.name}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Role: {project.role}
              </Typography>

              <Typography variant="body2" mt={1}>
                {project.description || "No description"}
              </Typography>
            </Box>
            <Box
              zIndex={2}
              mt={3}
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                color="error"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
