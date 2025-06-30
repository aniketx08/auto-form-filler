// src/App.tsx
import { useUser } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";

function AppRoutes() {
  const { isSignedIn } = useUser();

  return (
    <Routes>
      <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/profile" element={isSignedIn ? <Profile /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}