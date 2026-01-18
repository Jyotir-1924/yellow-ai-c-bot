"use client";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";

export default function CreateProjectForm({
  name,
  setName,
  role,
  setRole,
  description,
  setDescription,
  creating,
  onSubmit,
}: any) {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>
        Create New Project
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <TextField
          label="Project Name"
          fullWidth
          required
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Agent Role"
          fullWidth
          required
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          helperText="The agent will ONLY answer questions related to this role."
        />

        <TextField
          label="Description (Optional)"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Project"}
        </Button>
      </Box>
    </Paper>
  );
}
