import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(email, password);
            navigate("/");
        } catch (error) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-primary text-white">
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-secondary shadow-md rounded-lg space-y-4 max-w-sm w-full"
            >
                <h1 className="text-2xl font-bold">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 bg-primary rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 bg-primary rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-accent font-bold rounded-lg"
                >
                    Login
                </button>
                <p className="text-sm text-center mt-2">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-600 underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;