"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Chip,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../Header";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define an interface for user data
interface UserData {
  [key: string]: string | number | boolean | null | undefined;
  error?: string;
}

// Helper function to format user data
const formatUserData = (userData: UserData) => {
  if (!userData || userData.error)
    return "No data found or error retrieving your profile.";

  let formattedData = "Here's your profile information:\n\n";

  for (const [key, value] of Object.entries(userData)) {
    if (key !== "password" && key !== "id") {
      // Skip sensitive fields
      formattedData += `${
        key.charAt(0).toUpperCase() + key.slice(1)
      }: ${value}\n`;
    }
  }

  return formattedData;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

export default function PromptsPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();

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

  // Function to fetch user data
  const fetchUserData = async () => {
    if (currentUser && currentUser.email) {
      try {
        setIsLoading(true);

        // Add user message to chat history
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: "user", content: "Show my profile data" },
        ]);

        // Call the API endpoint to fetch user data
        const response = await axios.get(
          `/api/user-data?email=${currentUser.email}`
        );

        // Add the response to the chat history
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "assistant",
            content: formatUserData(response.data),
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "assistant",
            content:
              "Sorry, I encountered an error fetching your profile data from the database.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: "Show my profile data" },
        {
          role: "assistant",
          content: "You need to be logged in to view your profile data.",
        },
      ]);
    }
  };

  // Function to navigate back to homepage
  const handleGoBack = () => {
    router.push("/");
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = message.trim();

      // Add user message to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userMessage },
      ]);

      // Clear input field
      setMessage("");

      try {
        setIsLoading(true);

        // Check if the message is about fetching user data
        const lowerCaseMessage = userMessage.toLowerCase();
        if (
          lowerCaseMessage.includes("profile data") ||
          lowerCaseMessage.includes("my information") ||
          lowerCaseMessage.includes("my data") ||
          lowerCaseMessage.includes("about me")
        ) {
          // Handle as a data fetch request
          if (currentUser && currentUser.email) {
            const response = await axios.get(
              `/api/user-data?email=${currentUser.email}`
            );
            setChatHistory((prevHistory) => [
              ...prevHistory,
              {
                role: "assistant",
                content: formatUserData(response.data),
              },
            ]);
          } else {
            setChatHistory((prevHistory) => [
              ...prevHistory,
              {
                role: "assistant",
                content: "You need to be logged in to view your profile data.",
              },
            ]);
          }
        } else {
          // Original chat logic
          const response = await axios.post("/api/chat", {
            message: userMessage,
            history: chatHistory,
          });

          setChatHistory((prevHistory) => [
            ...prevHistory,
            { role: "assistant", content: response.data.response },
          ]);
        }
      } catch (error) {
        console.error("Failed to get response", error);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "assistant",
            content: "Sorry, I encountered an error processing your request.",
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
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              borderRadius: "20px",
              border: "1px solid", 
              borderColor: theme.palette.primary.main,
              backgroundColor: "white", 
              mr: 2,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>

        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Chat with Your Onboarding Assistant
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Ask me anything about the onboarding process, company policies, or
            resources you need.
          </Typography>
        </Box>

        <StyledPaper elevation={0}>
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
              sx={{ borderRadius: "20px" }}
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
                <Typography>Start a conversation with the assistant</Typography>
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
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      maxWidth: "80%",
                      borderRadius: "12px",
                      backgroundColor:
                        chat.role === "user"
                          ? theme.palette.primary.light
                          : theme.palette.grey[100],
                      color: chat.role === "user" ? "white" : "inherit",
                    }}
                  >
                    <Typography variant="body1">{chat.content}</Typography>
                  </Paper>
                </Box>
              ))
            )}
            {isLoading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
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
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Suggested questions:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="What should I do on my first day?"
                onClick={() => setMessage("What should I do on my first day?")}
                sx={{ borderRadius: "16px", py: 0.5 }}
              />
              <Chip
                label="How do I set up my workstation?"
                onClick={() => setMessage("How do I set up my workstation?")}
                sx={{ borderRadius: "16px", py: 0.5 }}
              />
              <Chip
                label="Where can I find HR policies?"
                onClick={() => setMessage("Where can I find HR policies?")}
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
                label="Show my profile info!"
                onClick={fetchUserData}
                sx={{ borderRadius: "16px", py: 0.5 }}
              />
            </Box>
          </Box>
        </StyledPaper>
      </Container>
      <Footer />
    </div>
  );
}
