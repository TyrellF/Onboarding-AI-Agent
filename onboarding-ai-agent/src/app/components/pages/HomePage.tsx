"use client";
import React, { useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Stack,
  useTheme,
  Toolbar,
} from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Header from "../Header";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";

const StyledPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const FeatureCard = styled(Card)(() => ({
  height: "100%",
  borderRadius: "12px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: "none",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
  },
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
  borderRadius: "16px",
  padding: theme.spacing(6, 4),
  color: "white",
  textAlign: "center",
  marginBottom: theme.spacing(5),
}));

export default function Home() {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const onboardingExperienceRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const scrollToOnboardingExperience = () => {
    onboardingExperienceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Header />
      <Head>
        <title>Onboarding AI Agent</title>
        <meta name="description" content="A simple AI onboarding assistant" />
      </Head>
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        {currentUser && (
          <Box display="flex" alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {currentUser.email}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
            >
              Sign Out
            </Button>
          </Box>
        )}
      </Toolbar>
      <Container>
        <GradientBox sx={{ my: { xs: 2, sm: 3, md: 0 } }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            }}
          >
            Onboarding AI Agent
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              opacity: 0.9,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Your intelligent companion for a smooth onboarding experience🚀
          </Typography>
          <Stack direction={"row"} spacing={2} justifyContent="center">
            <Link href="/prompts" passHref>
              <Button
                // component="a"
                variant="contained"
                size="large"
                startIcon={<ChatIcon />}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
              >
                Chat with Assistant
              </Button>
            </Link>
            <Button
              variant="outlined"
              size="large"
              startIcon={<RocketLaunchIcon />}
              onClick={scrollToOnboardingExperience}
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: "bold",
                px: 3,
                py: 1.5,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Start Onboarding
            </Button>
          </Stack>
        </GradientBox>

        <StyledPaper elevation={0}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {currentUser && currentUser.email ? (
                <>
                  Welcome{" "}
                  <span style={{ color: "blue" }}>
                    {currentUser.email
                      .split("@")[0]
                      .split(/[._]/)[0]
                      .replace(/^./, (char) => char.toUpperCase())}
                  </span>
                  , to your onboarding portal
                </>
              ) : (
                "Welcome to your onboarding portal"
              )}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 0.5, fontStyle: "italic" }}
            >
              Everything you need for a successful start at our company!
            </Typography>

            <Link href="/prompts" passHref>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SmartToyIcon />}
                sx={{ mt: 2 }}
              >
                {/* Chat with Your Onboarding Assistant */}
                Get Started
              </Button>
            </Link>
          </Box>
        </StyledPaper>

        <Box ref={onboardingExperienceRef} sx={{ my: 6 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
            color="text.primary"
          >
            Personalized Onboarding Experience
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 5, maxWidth: 700, mx: "auto" }}
          >
            Our AI platform makes it easy for you to settle into your new role
            with a personalized experience.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: { xs: 2, sm: 3, md: 3 },
              mb: { xs: 4, sm: 5, md: 6 },
            }}
          >
            <Box
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: "300px",
              }}
            >
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Guidance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get personalized recommendations and guidance tailored to
                    your role and department. Our AI adapts to your specific
                    needs and learning style.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>

            <Box
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: "300px",
              }}
            >
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <BusinessIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Company Culture
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn about our company values, culture, and how you can
                    contribute to our mission through interactive content and
                    personalized stories.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>

            <Box
              sx={{
                flex: "1 1 calc(33.333% - 16px)",
                minWidth: "300px",
              }}
            >
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "success.main",
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <SchoolIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Learning Resources
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access curated training materials, tutorials, and resources
                    to help you in your new role, with progress tracking and
                    smart recommendations.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
          </Box>
        </Box>

        <StyledPaper
          sx={{ bgcolor: theme.palette.primary.light, color: "white" }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Track Your Onboarding Progress
              </Typography>
              <Typography paragraph sx={{ opacity: 0.9 }}>
                Complete onboarding tasks and track your progress through an
                interactive dashboard. Our AI assistant will guide you through
                each step of your journey with personalized insights.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography>Task tracking</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography>Performance insights</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography>Learning progress</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DashboardIcon />}
                sx={{
                  mt: 3,
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
              >
                View Your Dashboard
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
      <Footer />
    </div>
  );
}
