"use client";

import Link from "next/link";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Project } from "./useChat";

export default function ChatHeader({ project }: { project: Project }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" gap={2} alignItems="center">
        <Button component={Link} href="/dashboard">
          ← Dashboard
        </Button>
        <Box>
          <Typography variant="h6">{project.name}</Typography>
          {project.description && (
            <Typography variant="body2" color="text.secondary">
              {project.description}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
