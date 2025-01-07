import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* ✅ Protected Chat Page with Dynamic Chat Routing */}
                    <Route
                        path="/chat/:chatId"
                        element={
                            <PrivateRoute>
                                <ChatPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <ChatPage />
                            </PrivateRoute>
                        }
                    />
                    {/* ✅ Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;