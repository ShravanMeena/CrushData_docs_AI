import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleSignup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleSignup(email, password);
            navigate("/");
        } catch (error) {
            setError("Signup failed. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-primary text-white">
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-secondary shadow-md rounded-lg space-y-4 max-w-sm w-full"
            >
                <h1 className="text-2xl font-bold">Sign Up</h1>
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
                    Sign Up
                </button>
                <p className="text-sm text-center mt-2">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-700 underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;