"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
}

export function useChat(projectId: string, status: string) {
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProject();
      fetchMessages();
    }
  }, [status, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        setProject(await res.json());
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/prompts`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.reverse());
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    const temp: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, temp]);

    try {
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.message,
            createdAt: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
    } finally {
      setSending(false);
    }
  };

  return {
    project,
    messages,
    input,
    setInput,
    loading,
    sending,
    sendMessage,
    messagesEndRef,
  };
}
