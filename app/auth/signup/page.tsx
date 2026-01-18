"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push("/auth/signin");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper elevation={0} sx={{ p: 4, width: 420 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Sign Up
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" mt={2} onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>

        <Typography textAlign="center" mt={3} variant="body2">
          Already have an account?{" "}
          <Link href="/auth/signin" style={{ color: "#6366f1" }}>
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
