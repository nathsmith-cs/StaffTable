import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./Welcomepage";
import LoginPage from "./login-page";
import Dashboard from "./dashboard";

function App() {
    // Check if user is logged in
    const isLoggedIn = () => {
        return localStorage.getItem("token") !== null;
    };

    // Check if location is selected
    const hasSelectedLocation = () => {
        return localStorage.getItem("selectedLocation") !== null;
    };

    // Protected Route component - requires login
    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn()) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    // Login Route component - requires location selection first
    const LoginRoute = ({ children }) => {
        if (!hasSelectedLocation()) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Welcome page - first page, location selection */}
                <Route path="/" element={<WelcomePage />} />

                {/* Login page - requires location selection */}
                <Route
                    path="/login"
                    element={
                        <LoginRoute>
                            <LoginPage />
                        </LoginRoute>
                    }
                />

                {/* Dashboard - requires login */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all - redirect to welcome */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
