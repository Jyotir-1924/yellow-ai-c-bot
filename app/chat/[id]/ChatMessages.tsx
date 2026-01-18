import { Box, Paper, Typography } from "@mui/material";
import { Message } from "./useChat";

export default function ChatMessages({
  messages,
  endRef,
}: {
  messages: Message[];
  endRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (messages.length === 0) {
    return (
      <Typography textAlign="center" color="text.secondary" mt={6}>
        No messages yet. Start the conversation.
      </Typography>
    );
  }

  return (
    <>
      {messages.map((m) => (
        <Box
          key={m.id}
          display="flex"
          justifyContent={m.role === "user" ? "flex-end" : "flex-start"}
          mb={2}
          sx={{
            width: "100%",
          }}
        >
          <Paper
            sx={{
              p: 2,
              maxWidth: "80%",
              backgroundColor:
                m.role === "user" ? "primary.main" : "background.paper",
              color: m.role === "user" ? "#fff" : "text.primary",
            }}
          >
            <Typography variant="body2" whiteSpace="pre-wrap">
              {m.content}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {new Date(m.createdAt).toLocaleTimeString()}
            </Typography>
          </Paper>
        </Box>
      ))}
      <div ref={endRef} />
    </>
  );
}
