"use client";

import { Box, Button, Paper, TextField } from "@mui/material";

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        display="flex"
        gap={2}
        maxWidth={800}
        mx="auto"
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />

        <Button
          variant="contained"
          type="submit"
          disabled={disabled || !value.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}
