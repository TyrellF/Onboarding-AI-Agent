"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import EmailIcon from "@mui/icons-material/Email";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    google: false,
    microsoft: false,
    email: false,
  });
  const [email, setEmail] = useState("");

  const { loginWithGoogle, loginWithMicrosoft, login } = useAuth();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, google: true }));
      await loginWithGoogle();
      router.push("/");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, google: false }));
    }
  };

  const handleMicrosoftAuth = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, microsoft: true }));
      await loginWithMicrosoft();
      router.push("/");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Microsoft"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, microsoft: false }));
    }
  };

  const handleEmailAuth = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, email: true }));
      await login(email, "");
      router.push("/");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Email"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, email: false }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Welcome
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Sign in to continue your onboarding journey
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Email Authentication */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={
              loadingStates.email ||
              loadingStates.google ||
              loadingStates.microsoft
            }
          />

          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1.5 }}
            onClick={handleEmailAuth}
            startIcon={!loadingStates.email && <EmailIcon />}
            disabled={
              loadingStates.email ||
              loadingStates.google ||
              loadingStates.microsoft ||
              !email
            }
          >
            {loadingStates.email ? (
              <CircularProgress size={24} />
            ) : (
              "Continue with SSO"
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.primary">
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1.5, mb: 2 }}
            onClick={handleGoogleAuth}
            startIcon={!loadingStates.google && <GoogleIcon />}
            disabled={
              loadingStates.email ||
              loadingStates.google ||
              loadingStates.microsoft
            }
          >
            {loadingStates.google ? (
              <CircularProgress size={24} />
            ) : (
              "Continue with Google"
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1.5, mb: 2 }}
            onClick={handleMicrosoftAuth}
            startIcon={!loadingStates.microsoft && <MicrosoftIcon />}
            disabled={
              loadingStates.email ||
              loadingStates.google ||
              loadingStates.microsoft
            }
          >
            {loadingStates.microsoft ? (
              <CircularProgress size={24} />
            ) : (
              "Continue with Microsoft"
            )}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
