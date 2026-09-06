import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";

function Settings() {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [emailNotifications, setEmailNotifications] = useState(() => {
        const saved = localStorage.getItem("emailNotifications");
        return saved === null ? true : saved === "true";
    });

    const [privateAccount, setPrivateAccount] = useState(() => {
        return localStorage.getItem("privateAccount") === "true";
    });


    // =====================================================
    // APPLY DARK MODE
    // =====================================================

    useEffect(() => {

        document.documentElement.classList.toggle(
            "dark-mode",
            darkMode
        );

        document.body.classList.toggle(
            "dark-mode",
            darkMode
        );

        localStorage.setItem(
            "darkMode",
            darkMode.toString()
        );

    }, [darkMode]);


    // =====================================================
    // EMAIL NOTIFICATIONS
    // =====================================================

    useEffect(() => {

        localStorage.setItem(
            "emailNotifications",
            emailNotifications.toString()
        );

    }, [emailNotifications]);


    // =====================================================
    // PRIVATE ACCOUNT
    // =====================================================

    useEffect(() => {

        localStorage.setItem(
            "privateAccount",
            privateAccount.toString()
        );

    }, [privateAccount]);


    return (
        <AppLayout>

            <div className="page-container settings-page">

                {/* HEADER */}

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            PREFERENCES
                        </p>

                        <h1>
                            Settings
                        </h1>

                        <p className="page-description">
                            Manage your account preferences
                            and application settings.
                        </p>

                    </div>

                </div>


                {/* SETTINGS CARD */}

                <div className="settings-card">


                    {/* =========================================
                        APPEARANCE
                    ========================================= */}

                    <div className="settings-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon">
                                🎨
                            </div>

                            <div>

                                <h2>
                                    Appearance
                                </h2>

                                <p>
                                    Customize how SocialSphere
                                    looks for you.
                                </p>

                            </div>

                        </div>


                        <div className="setting-item">

                            <div className="setting-info">

                                <div className="setting-icon">
                                    {darkMode ? "🌙" : "☀️"}
                                </div>

                                <div>

                                    <h3>
                                        Dark Mode
                                    </h3>

                                    <p>
                                        {darkMode
                                            ? "Dark theme is currently enabled."
                                            : "Use the light theme across SocialSphere."
                                        }
                                    </p>

                                </div>

                            </div>


                            <label className="switch">

                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={(e) =>
                                        setDarkMode(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="slider"></span>

                            </label>

                        </div>

                    </div>


                    {/* =========================================
                        NOTIFICATIONS
                    ========================================= */}

                    <div className="settings-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon">
                                🔔
                            </div>

                            <div>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Control how you receive
                                    notifications.
                                </p>

                            </div>

                        </div>


                        <div className="setting-item">

                            <div className="setting-info">

                                <div className="setting-icon">
                                    ✉️
                                </div>

                                <div>

                                    <h3>
                                        Email Notifications
                                    </h3>

                                    <p>
                                        Receive important updates
                                        and notifications by email.
                                    </p>

                                </div>

                            </div>


                            <label className="switch">

                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) =>
                                        setEmailNotifications(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="slider"></span>

                            </label>

                        </div>

                    </div>


                    {/* =========================================
                        PRIVACY
                    ========================================= */}

                    <div className="settings-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon">
                                🔒
                            </div>

                            <div>

                                <h2>
                                    Privacy
                                </h2>

                                <p>
                                    Manage your account visibility
                                    and privacy.
                                </p>

                            </div>

                        </div>


                        <div className="setting-item">

                            <div className="setting-info">

                                <div className="setting-icon">
                                    🔐
                                </div>

                                <div>

                                    <h3>
                                        Private Account
                                    </h3>

                                    <p>
                                        Only approved followers
                                        can see your posts.
                                    </p>

                                </div>

                            </div>


                            <label className="switch">

                                <input
                                    type="checkbox"
                                    checked={privateAccount}
                                    onChange={(e) =>
                                        setPrivateAccount(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="slider"></span>

                            </label>

                        </div>

                    </div>

                </div>

            </div>

        </AppLayout>
    );
}

export default Settings;