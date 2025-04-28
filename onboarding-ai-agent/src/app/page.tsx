"use client";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/pages/HomePage";
import { useAuth } from "./context/AuthContext";

export default function Page() {
  //   const { currentUser, logout } = useAuth();
  const {} = useAuth();

  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
