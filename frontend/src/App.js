import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./login-page";
import Dashboard from "./dashboard";

function App() {
    // Check if user is logged in
    const isLoggedIn = () => {
        return localStorage.getItem("token") !== null;
    };

    // Protected Route component
    const ProtectedRoute = ({ children }) => {
        return isLoggedIn() ? children : <Navigate to="/login" />;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
