"use client";

import { signOut } from "next-auth/react";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function DashboardHeader({
  userLabel,
}: {
  userLabel: string;
}) {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Chatbot Platform
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Typography variant="body2">{userLabel}</Typography>
          <Button
            color="error"
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
