import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import './index.css';

// Replace with your actual frontend API from Clerk dashboard
const PUBLISHABLE_KEY = "pk_test_ZXF1aXBwZWQtYmFybmFjbGUtMjEuY2xlcmsuYWNjb3VudHMuZGV2JA";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
