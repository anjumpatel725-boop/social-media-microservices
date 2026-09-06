import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authAPI } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        console.log("REGISTER REQUEST:", form);

        const response = await authAPI.register(form);

        console.log("REGISTER RESPONSE:", response);
        console.log("REGISTER TOKEN:", response?.token);

        if (!response || !response.token) {
            console.error("Invalid register response:", response);
            setError("Registration failed. Token not received.");
            return;
        }

        // IMPORTANT:
        // Registration ke baad automatically login mat karo.
        // User ko Login page par bhejo.
        navigate("/login", {
            replace: true,
            state: {
                registered: true,
                email: form.email
            }
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "DATA:",
            error.response?.data
        );

        console.log(
            "URL:",
            error.config?.url
        );

        setError(
            error.response?.data?.message ||
            "Unable to create account"
        );

    } finally {
        setLoading(false);
    }
};
    return (

        <div className="auth-page">

            {/* LEFT */}

            <div className="auth-left">

                <div className="auth-brand">
                    <span className="brand-mark">✦</span>
                    SocialSphere
                </div>

                <div className="auth-left-content">

                    <p className="auth-eyebrow">
                        JOIN THE COMMUNITY
                    </p>

                    <h1>
                        Create.
                        <br />
                        Connect.
                        <br />
                        Belong.
                    </h1>

                    <p className="auth-description">
                        Build your profile, follow people you
                        care about and share your journey with
                        the SocialSphere community.
                    </p>

                    <div className="auth-features">

                        <div>
                            <span>✓</span>
                            Share your thoughts
                        </div>

                        <div>
                            <span>✓</span>
                            Connect with people
                        </div>

                        <div>
                            <span>✓</span>
                            Discover new communities
                        </div>

                    </div>

                </div>

                <div className="auth-decoration">

                    <span>✦</span>
                    <span>●</span>
                    <span>✧</span>

                </div>

            </div>


            {/* RIGHT */}

            <div className="auth-card-wrapper">

                <div className="auth-card">

                    <div className="auth-header">

                        <div className="auth-logo">
                            ✦
                        </div>

                        <h2>
                            Create account
                        </h2>

                        <p>
                            Start your SocialSphere journey
                        </p>

                    </div>


                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />

                        </div>


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

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                minLength={6}
                                required
                            />

                            <small className="input-hint">
                                Use at least 6 characters
                            </small>

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating account..."
                                : "Create Account →"}

                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>or</span>
                    </div>


                    <div className="auth-footer">

                        Already have an account?

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;