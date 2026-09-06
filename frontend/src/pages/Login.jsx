import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { authAPI } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

        console.log("LOGIN REQUEST:", form);

        const response = await authAPI.login(form);

        console.log("LOGIN RESPONSE:", response);

        if (!response || !response.token) {
            setError("Login failed. Token not received.");
            return;
        }

        // Save token + user
        login(response);

        console.log(
            "TOKEN:",
            localStorage.getItem("token")
        );

        console.log(
            "USER:",
            localStorage.getItem("user")
        );

        // Go to Home
        navigate("/", {
            replace: true
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "DATA:",
            error.response?.data
        );

        setError(
            error.response?.data?.message ||
            "Invalid email or password"
        );

    } finally {

        setLoading(false);

    }
};
    return (

        <div className="auth-page">

            {/* LEFT SIDE */}

            <div className="auth-left">

                <div className="auth-brand">
                    <span className="brand-mark">✦</span>
                    SocialSphere
                </div>

                <div className="auth-left-content">

                    <p className="auth-eyebrow">
                        WELCOME BACK
                    </p>

                    <h1>
                        Your people.
                        <br />
                        Your world.
                    </h1>

                    <p className="auth-description">
                        Connect with friends, share your
                        moments and discover what's happening
                        in your community.
                    </p>

                    <div className="auth-stats">

                        <div>
                            <strong>10K+</strong>
                            <span>Members</span>
                        </div>

                        <div>
                            <strong>25K+</strong>
                            <span>Posts</span>
                        </div>

                        <div>
                            <strong>50K+</strong>
                            <span>Connections</span>
                        </div>

                    </div>

                </div>

                <div className="auth-decoration">

                    <span>✦</span>
                    <span>●</span>
                    <span>✧</span>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="auth-card-wrapper">

                <div className="auth-card">

                    <div className="auth-header">

                        <div className="auth-logo">
                            ✦
                        </div>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to continue to SocialSphere
                        </p>

                    </div>


                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <div className="label-row">

                                <label>
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-link"
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In →"}

                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>or</span>
                    </div>


                    <div className="auth-footer">

                        Don't have an account?

                        <Link to="/register">
                            Create account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;