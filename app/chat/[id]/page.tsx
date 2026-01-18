"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

import { useChat } from "./useChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatPage() {
  const { status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const chat = useChat(id, status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || chat.loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!chat.project) return null;

  return (
    <Box height="100vh" display="flex" flexDirection="column" px={3} py={2}>
      <ChatHeader project={chat.project} />

      <Box
        flex={1}
        mb={2}
        display="flex"
        justifyContent="center"
        sx={{
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box width="100%" maxWidth={800}>
          <ChatMessages messages={chat.messages} endRef={chat.messagesEndRef} />
        </Box>
      </Box>

      <ChatInput
        value={chat.input}
        onChange={chat.setInput}
        onSend={chat.sendMessage}
        disabled={chat.sending}
      />
    </Box>
  );
}
