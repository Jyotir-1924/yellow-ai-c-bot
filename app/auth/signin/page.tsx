"use client";

import { signIn } from "next-auth/react";
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

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
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
          Sign In
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" mt={2} onSubmit={handleSubmit}>
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        <Typography textAlign="center" mt={3} variant="body2">
          Don't have an account?{" "}
          <Link href="/auth/signup" style={{ color: "#6366f1" }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
