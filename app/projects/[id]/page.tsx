"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Box, Button, Paper, Typography } from "@mui/material";

interface FileItem {
  id: string;
  filename: string;
  openaiFileId: string;
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    const res = await fetch(`/api/projects/${id}/files`);
    if (res.ok) setFiles(await res.json());
  };

  useEffect(() => {
    fetchFiles();
  }, [id]);

  const uploadFile = async (file: File) => {
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    await fetch(`/api/projects/${id}/files`, {
      method: "POST",
      body: fd,
    });

    setUploading(false);
    fetchFiles();
  };
  const deleteFile = async (fileId: string) => {
    if (!confirm("Delete this file?")) return;

    await fetch(`/api/projects/${id}/files`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });

    fetchFiles();
  };

  return (
    <Box px={4} py={6}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Project Files</Typography>

        <Button
          component={Link}
          href={`/chat/${id}`}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Open Chat
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" mb={2}>
          Uploaded Files
        </Typography>

        {files.length === 0 ? (
          <Typography color="text.secondary">No files uploaded yet.</Typography>
        ) : (
          files.map((file) => (
            <Box
              key={file.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Button
                variant="text"
                component="a"
                href={`https://api.openai.com/v1/files/${file.openaiFileId}/content`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.filename}
              </Button>

              <Button
                color="error"
                size="small"
                onClick={() => deleteFile(file.id)}
              >
                Delete
              </Button>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
