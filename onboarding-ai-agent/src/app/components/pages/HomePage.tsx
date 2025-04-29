"use client";
import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Avatar,
  Card,
  LinearProgress,
  Tabs,
  Tab,
  CardContent,
  TextField,
  Chip,
  useTheme,
  Toolbar,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArticleIcon from "@mui/icons-material/Article";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupIcon from "@mui/icons-material/Group";
import Header from "../Header";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import axios from "axios";
import Image from "next/image";

// Function to get the user's initials from email
const getInitial = (email: string) => {
  const emailPrefix = email.split("@")[0];

  // Check if email contains separators like dots or underscores
  if (emailPrefix.includes(".") || emailPrefix.includes("_")) {
    // Split by common separators
    const parts = emailPrefix.split(/[._-]/);
    // Get first letter of first part and first letter of last part
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  // If no separator exists, just return the first letter
  return emailPrefix.charAt(0).toUpperCase();
};

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
  borderRadius: "16px",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  border: "none",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  overflow: "hidden",
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    "&:after": {
      opacity: 1,
    },
  },
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "currentColor",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
}));

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "60%" },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
  p: { xs: 3, md: 4 },
  overflow: "auto",
  border: "none",
};

const StyledCard = styled(Card)(() => ({
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

// Define custom props interface for StatusChip
interface StatusChipProps {
  status?: "completed" | "in-progress" | "overdue" | string;
}

const StatusChip = styled(Chip)<StatusChipProps>(({ theme, status }) => {
  let color;
  switch (status) {
    case "completed":
      color = theme.palette.success.main;
      break;
    case "in-progress":
      color = theme.palette.warning.main;
      break;
    case "overdue":
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.grey[500];
  }

  return {
    backgroundColor: `${color}20`,
    color: color,
    fontWeight: 500,
    "& .MuiChip-icon": {
      color: "inherit",
    },
  };
});

const mockLearningMaterials = [
  {
    id: 1,
    title: "Introduction to Company Culture",
    description: "Learn about our values and working style",
    url: "#",
  },
  {
    id: 2,
    title: "Technical Stack Overview",
    description: "Get familiar with our technology ecosystem",
    url: "#",
  },
  {
    id: 3,
    title: "Product Training",
    description: "Core functionality and use cases",
    url: "#",
  },
];

const mockTeamMembers = [
  {
    id: 1,
    name: "Prabhu",
    role: "Associate Director",
    imageUrl:
      "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
  },
  {
    id: 2,
    name: "Vaishnavi",
    role: "Associate Director",
    imageUrl:
      "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
  },
  {
    id: 3,
    name: "Bajrang bhushan",
    role: "Senior Software Engineer",
    imageUrl:
      "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
  },
  {
    id: 4,
    name: "Varman",
    role: "Senior software Engineer",
    imageUrl:
      "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
  },
];

export default function Home() {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const onboardingExperienceRef = useRef<HTMLDivElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [personalGuidanceOpen, setPersonalGuidanceOpen] = useState(false);
  const [companyCultureOpen, setCompanyCultureOpen] = useState(false);
  const [learningResourcesOpen, setLearningResourcesOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete IT Security Training",
      status: "pending",
      lastUpdate: "2025-04-20",
    },
    {
      id: 2,
      title: "Set up development environment",
      status: "pending",
      lastUpdate: "2025-04-25",
    },
    {
      id: 3,
      title: "Meet with team lead",
      status: "pending",
      lastUpdate: "2025-04-22",
    },
    {
      id: 4,
      title: "Review company policies",
      status: "pending",
      lastUpdate: "2025-04-19",
    },
    {
      id: 5,
      title: "Submit benefits enrollment form",
      status: "pending",
      lastUpdate: "2025-04-15",
    },
  ]);

  const userFirstName = currentUser?.email
    ? currentUser.email
        .split("@")[0]
        .split(/[._]/)[0]
        .replace(/^./, (char) => char.toUpperCase())
    : "New Employee";

  const personalGuidanceData = {
    title: `${userFirstName}'s Guidance Plan`,
    description: `Here are some personalized resources to help you get started in your role.`,
    resources: [
      {
        title: "Your Onboarding Checklist",
        description: "Tasks to complete in your first 30 days",
        link: "/onboarding-checklist",
        icon: <CheckCircleIcon color="primary" />,
      },
      {
        title: "Meet Your Team",
        description: "Schedule introductions with key team members",
        link: "/team-calendar",
        icon: <PeopleIcon color="primary" />,
      },
      {
        title: "Role-specific Training",
        description: "Required courses for your position",
        link: "/training",
        icon: <SchoolIcon color="primary" />,
      },
      {
        title: "First Month Goals",
        description: "Objectives to achieve in your first month",
        link: "/goals",
        icon: <RocketLaunchIcon color="primary" />,
      },
    ],
  };

  const companyCultureData = {
    title: "Our Company Culture",
    description:
      "Discover what makes our company unique and how you can contribute to our culture.",
    resources: [
      {
        title: "Company Values Video",
        description: "A message from our CEO about our core values",
        link: "/videos/company-values",
        icon: <VideoLibraryIcon color="secondary" />,
      },
      {
        title: "Employee Handbook",
        description: "Guidelines, policies, and important information",
        link: "/handbook",
        icon: <ArticleIcon color="secondary" />,
      },
      {
        title: "Upcoming Company Events",
        description: "Social and team building opportunities",
        link: "/events",
        icon: <EventIcon color="secondary" />,
      },
      {
        title: "Culture Blog",
        description: "Stories and articles about our company culture",
        link: "/culture-blog",
        icon: <ArticleIcon color="secondary" />,
      },
    ],
  };

  const learningResourcesData = {
    title: `Learning Resources for ${userFirstName}`,
    description: `Enhance your skills with these customized learning resources selected for your role.`,
    resources: [
      {
        title: "Role-specific Course Bundle",
        description: "Key training modules for your position",
        link: "/courses/role-specific",
        icon: <SchoolIcon color="success" />,
      },
      {
        title: "Technical Documentation",
        description: "Essential documentation for tools and systems you'll use",
        link: "/documentation",
        icon: <ArticleIcon color="success" />,
      },
      {
        title: "Recommended Tutorials",
        description: "Step-by-step guides for common tasks",
        link: "/tutorials",
        icon: <VideoLibraryIcon color="success" />,
      },
      {
        title: "Mentorship Program",
        description: "Connect with experienced team members for guidance",
        link: "/mentorship",
        icon: <PeopleIcon color="success" />,
      },
    ],
  };

  // Add this function after the tasks state
  const toggleTaskStatus = (id: number) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          // Define status cycle: pending -> in-progress -> completed -> pending
          let newStatus;
          switch (task.status) {
            case "completed":
              newStatus = "pending"; // Reset to not started
              break;
            case "in-progress":
              newStatus = "completed";
              break;
            case "pending":
              newStatus = "in-progress";
              break;
            case "overdue":
              newStatus = "in-progress";
              break;
            default:
              newStatus = "in-progress";
          }

          return {
            ...task,
            status: newStatus,
            lastUpdate: today,
          };
        }
        return task;
      })
    );
  };
  // Add this function next to the toggleTaskStatus function
  const resetTasks = () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        status: "pending", // Reset to "pending" status (not started)
        lastUpdate: today,
      }))
    );
  };
  // Modify the existing useEffect for progress calculation
  useEffect(() => {
    // Calculate progress based on completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const progressPercentage = Math.round(
      (completedTasks / tasks.length) * 100
    );
    setProgress(progressPercentage);
  }, [tasks]); // Add tasks as a dependency

  // Get status icon based on task status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon fontSize="small" color="success" />;
      case "in-progress":
        return <AccessTimeIcon fontSize="small" color="warning" />;
      case "overdue":
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return <AccessTimeIcon fontSize="small" color="disabled" />;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add a ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom whenever chat history changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = message.trim();

      // Add user message to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userMessage },
      ]);

      // Check if we have a selected task and update its status to "in-progress"
      if (selectedTaskId) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === selectedTaskId && task.status !== "completed") {
              return {
                ...task,
                status: "in-progress",
                lastUpdate: new Date().toISOString().split("T")[0],
              };
            }
            return task;
          })
        );
        // Reset the selected task ID
        setSelectedTaskId(null);
      }

      // Clear input field
      setMessage("");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/query",
          {
            message: userMessage,
            chat_type: "Q&A with stored SQL-DB",
            app_functionality: "Chat",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.data); // Log the response
        // If response contains a 'response' field, update chat history
        if (response.data.response) {
          setChatHistory((prevHistory) => [
            ...prevHistory,
            { role: "assistant", content: response.data.response },
          ]);
        } else {
          // If no 'response' field, log the error or display a message
          console.error("No response field found:", response.data);
          setChatHistory((prevHistory) => [
            ...prevHistory,
            {
              role: "assistant",
              content: "Error: No response received from server.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error sending message to Flask API:", error);
        setIsLoading(false); // Stop the loading indicator

        // Optionally, you can show an error message in the chat UI
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "assistant",
            content: "Error: Failed to communicate with server.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };
  return (
    <div style={{ backgroundColor: "#f6f6f6" }}>
      <Header />
      <Head>
        <title>Onboarding AI Agent</title>
        <meta name="description" content="An onboarding AI assistant" />
      </Head>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left-hand side */}
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start" // Align content to the left
            sx={{ mr: 2, color: "text.primary" }}
          >
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
                  !
                </>
              ) : (
                "Welcome to your onboarding portal"
              )}
            </Typography>
          </Box>
        </Box>

        {/* Right-hand side */}
        {currentUser && (
          <Box display="flex" alignItems="center">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              sx={{ mr: 2 }}
            >
              {/* Display name and surname */}
              <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                {currentUser?.email
                  ? currentUser.email
                      .split("@")[0]
                      .split(/[._]/)
                      .map(
                        (part) =>
                          part.charAt(0).toUpperCase() +
                          part.slice(1).toLowerCase()
                      )
                      .join(" ")
                  : "User"}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {currentUser.email}
              </Typography>
            </Box>

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

      <Container maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 1,
            width: "100%",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "30%" } }}>
            <StyledPaper
              sx={{
                height: "600px",
                bgcolor: theme.palette.primary.light,
                color: "white",
                padding: 1,
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box sx={{ width: { xs: "100%", md: "100%" } }}>
                  <StyledPaper
                    sx={{
                      padding: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      sx={{ mt: 0, mb: 1, borderColor: "divider" }} // Set top margin to 0
                      textColor="primary"
                      indicatorColor="primary"
                    >
                      <Tab
                        label="Tasks"
                        icon={<CheckCircleIcon />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Learning"
                        icon={<MenuBookIcon />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Team"
                        icon={<GroupIcon />}
                        iconPosition="start"
                      />
                    </Tabs>

                    {/* Tasks Tab */}
                    {tabValue === 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "flex-start", md: "center" },
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ width: "100%" }}>
                            <Typography
                              fontWeight="medium"
                              sx={{ fontSize: "18px" }}
                            >
                              Onboarding Progress
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {progress}% Complete
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "rgba(0,0,0,0.1)",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 5,
                                },
                              }}
                            />
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: "success.main",
                                    borderRadius: "50%",
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">
                                  Completed
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: "warning.main",
                                    borderRadius: "50%",
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">
                                  In Progress
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: "grey.500",
                                    borderRadius: "50%",
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">Pending</Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2,
                                mb: 0,
                              }}
                            >
                              <Typography variant="subtitle1" gutterBottom>
                                Your Tasks
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                startIcon={<RestartAltIcon />}
                                onClick={resetTasks}
                              >
                                Reset All Tasks
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            maxHeight: "306px",
                            overflowY: "auto",
                          }}
                        >
                          {tasks.map((task) => (
                            <StyledCard
                              key={task.id}
                              onClick={() => {
                                setMessage(task.title);
                                setSelectedTaskId(task.id);
                              }}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { transform: "translateY(-4px)" },
                              }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    fontWeight="medium"
                                    sx={{ fontSize: "18px" }}
                                  >
                                    {task.title}
                                  </Typography>
                                  <StatusChip
                                    label={
                                      task.status.charAt(0).toUpperCase() +
                                      task.status.slice(1)
                                    }
                                    status={task.status}
                                    size="small"
                                    icon={getStatusIcon(task.status)}
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 2 }}
                                ></Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color={
                                      task.status === "completed"
                                        ? "error"
                                        : "primary"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTaskStatus(task.id);
                                    }}
                                  >
                                    {task.status === "completed"
                                      ? "Mark Incomplete"
                                      : "Mark Complete"}
                                  </Button>
                                </Box>
                              </CardContent>
                            </StyledCard>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Learning Tab */}
                    {tabValue === 1 && (
                      <Box
                        sx={{
                          maxHeight: "472px",
                          overflowY: "auto",
                        }}
                      >
                        {mockLearningMaterials.map((material) => (
                          <StyledCard key={material.id} sx={{ mb: 2 }}>
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  fontWeight="medium"
                                  sx={{ fontSize: "18px" }}
                                >
                                  {material.title}
                                </Typography>
                                <MenuBookIcon color="primary" />
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                {material.description}
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                href={material.url}
                                target="_blank"
                              >
                                Access Resource
                              </Button>
                            </CardContent>
                          </StyledCard>
                        ))}
                      </Box>
                    )}

                    {/* Team Tab */}
                    {tabValue === 2 && (
                      <Box
                        sx={{
                          maxHeight: "472px",
                          overflowY: "auto",
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          Your Team Members
                        </Typography>
                        <Box>
                          {mockTeamMembers.map((member) => (
                            <StyledCard key={member.id} sx={{ mb: 2 }}>
                              <CardContent
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  src={member.imageUrl}
                                  alt={member.name}
                                  sx={{ width: 56, height: 56, mr: 2 }}
                                />
                                <Box>
                                  <Typography variant="subtitle1">
                                    {member.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {member.role}
                                  </Typography>
                                  <Button
                                    size="small"
                                    startIcon={<CalendarTodayIcon />}
                                    sx={{ mt: 1 }}
                                    href="https://teams.microsoft.com/l/meeting/new"
                                    target="_blank"
                                  >
                                    Schedule Meeting
                                  </Button>
                                </Box>
                              </CardContent>
                            </StyledCard>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </StyledPaper>
                </Box>
              </Box>
            </StyledPaper>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "70%" } }}>
            <StyledPaper
              elevation={0}
              sx={{
                height: "600px",
                border: "2px solid",
                borderColor: "#0070CC",
              }}
            >
              <Box sx={{ mb: 0 }}>
                <Container sx={{ py: 0 }}>
                  <Box
                    sx={{
                      mt: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      Chat History
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RestartAltIcon />}
                      onClick={handleClearChat}
                      sx={{ borderRadius: "20px", mb: 1.5 }}
                      disabled={chatHistory.length === 0}
                    >
                      Clear Chat
                    </Button>
                  </Box>

                  <Box
                    ref={chatContainerRef}
                    sx={{ height: "340px", overflowY: "auto", mb: 1 }}
                  >
                    {chatHistory.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          color: "text.secondary",
                        }}
                      >
                        <Typography>
                          Start a conversation with the assistant
                        </Typography>
                      </Box>
                    ) : (
                      chatHistory.map((chat, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent:
                              chat.role === "user" ? "flex-end" : "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: chat.role === "user" ? 2 : 0,
                              marginRight: chat.role === "user" ? 0 : 2,
                              flexDirection:
                                chat.role === "user" ? "row-reverse" : "row",
                            }}
                          >
                            {chat.role === "assistant" && (
                              <div
                                style={{
                                  position: "relative",
                                  marginRight: "8px",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  backgroundColor: "#f0f0f0",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  src="/bot-image.png"
                                  alt="Bot"
                                  width={30}
                                  height={30}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            )}
                            {chat.role === "user" && currentUser && (
                              <Box
                                sx={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.primary.main,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  marginLeft:
                                    chat.role === "user" ? "8px" : "0px",
                                  marginRight:
                                    chat.role === "user" ? "0px" : "8px",
                                  fontSize: "14px",
                                }}
                              >
                                {getInitial(currentUser?.email || "")}
                              </Box>
                            )}

                            <Paper
                              elevation={0}
                              sx={{
                                py: 1.2,
                                px: 2.5,
                                maxWidth: "90%",
                                borderRadius: "12px",
                                backgroundColor:
                                  chat.role === "user"
                                    ? theme.palette.primary.light
                                    : theme.palette.grey[100],
                                color:
                                  chat.role === "user" ? "white" : "inherit",
                              }}
                            >
                              <Typography variant="body1">
                                {chat.content}
                              </Typography>
                            </Paper>
                          </Box>
                        </Box>
                      ))
                    )}
                    {isLoading && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            backgroundColor: theme.palette.grey[100],
                          }}
                        >
                          <Typography>Thinking...</Typography>
                        </Paper>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type your question here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "28px",
                          pl: 2,
                          pr: 0,
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon />}
                      sx={{
                        ml: 2,
                        mt: 0,
                        height: 56,
                        borderRadius: "28px",
                        px: 3,
                      }}
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      Suggested questions:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label="What should I do on my first day?"
                        onClick={() =>
                          setMessage("What should I do on my first day?")
                        }
                        sx={{ borderRadius: "16px", py: 0.5 }}
                      />
                      <Chip
                        label="How do I set up my workstation?"
                        onClick={() =>
                          setMessage("How do I set up my workstation?")
                        }
                        sx={{ borderRadius: "16px", py: 0.5 }}
                      />
                      <Chip
                        label="Who should I contact for IT support?"
                        onClick={() =>
                          setMessage("Who should I contact for IT support?")
                        }
                        sx={{ borderRadius: "16px", py: 0.5 }}
                      />
                      <Chip
                        label="Show my profile information"
                        onClick={() =>
                          setMessage("Show my profile information")
                        }
                        sx={{ borderRadius: "16px", py: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Container>
              </Box>
            </StyledPaper>
          </Box>
        </Box>
        <Box ref={onboardingExperienceRef} sx={{ my: 2 }}>
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
              <FeatureCard
                onClick={() => setPersonalGuidanceOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      mb: 2,
                      width: 64,
                      height: 64,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Guidance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personalized resources for your role
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
              <FeatureCard
                onClick={() => setCompanyCultureOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      mb: 2,
                      width: 64,
                      height: 64,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <BusinessIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Company Culture
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn what makes our company unique
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
              <FeatureCard
                onClick={() => setLearningResourcesOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "success.main",
                      mb: 2,
                      width: 64,
                      height: 64,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <SchoolIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Learning Resources
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Educational materials to help you grow
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
          </Box>
        </Box>

        <Modal
          open={personalGuidanceOpen}
          onClose={() => setPersonalGuidanceOpen(false)}
          aria-labelledby="personal-guidance-modal"
        >
          <Box sx={ModalStyle}>
            <Typography
              id="personal-guidance-modal"
              variant="h5"
              component="h2"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              {personalGuidanceData.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "text.primary" }}>
              {personalGuidanceData.description}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {personalGuidanceData.resources.map((resource, index) => (
                <ListItem
                  key={index}
                  component="a"
                  href={resource.link}
                  sx={{
                    mb: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    padding: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 46,
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.8rem",
                      },
                    }}
                  >
                    {resource.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight="medium"
                        sx={{ mb: 0.5, color: "text.primary" }}
                      >
                        {resource.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, color: "text.secondary" }}
                      >
                        {resource.description}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button
                variant="outlined"
                onClick={() => setPersonalGuidanceOpen(false)}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={companyCultureOpen}
          onClose={() => setCompanyCultureOpen(false)}
          aria-labelledby="company-culture-modal"
        >
          <Box sx={ModalStyle}>
            <Typography
              id="company-culture-modal"
              variant="h5"
              component="h2"
              fontWeight="bold"
              color="secondary.main"
              gutterBottom
            >
              {companyCultureData.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "text.primary" }}>
              {companyCultureData.description}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {companyCultureData.resources.map((resource, index) => (
                <ListItem
                  key={index}
                  component="a"
                  href={resource.link}
                  sx={{
                    mb: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    padding: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 46,
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.8rem",
                      },
                    }}
                  >
                    {resource.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight="medium"
                        sx={{ mb: 0.5, color: "text.primary" }}
                      >
                        {resource.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, color: "text.secondary" }}
                      >
                        {resource.description}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button
                variant="outlined"
                onClick={() => setCompanyCultureOpen(false)}
                color="secondary"
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={learningResourcesOpen}
          onClose={() => setLearningResourcesOpen(false)}
          aria-labelledby="learning-resources-modal"
        >
          <Box sx={ModalStyle}>
            <Typography
              id="learning-resources-modal"
              variant="h5"
              component="h2"
              fontWeight="bold"
              color="success.main"
              gutterBottom
            >
              {learningResourcesData.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "text.primary" }}>
              {learningResourcesData.description}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {learningResourcesData.resources.map((resource, index) => (
                <ListItem
                  key={index}
                  component="a"
                  href={resource.link}
                  sx={{
                    mb: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    padding: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 46,
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.8rem",
                      },
                    }}
                  >
                    {resource.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight="medium"
                        sx={{ mb: 0.5, color: "text.primary" }}
                      >
                        {resource.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, color: "text.secondary" }}
                      >
                        {resource.description}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button
                variant="outlined"
                onClick={() => setLearningResourcesOpen(false)}
                color="success"
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
      <Footer />
    </div>
  );
}
