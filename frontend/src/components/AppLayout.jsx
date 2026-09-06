import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { notificationAPI } from "../services/notificationService";
import { chatAPI } from "../services/chatService";

function AppLayout({ children }) {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };


    // =====================================================
    // NAVIGATION CLASS
    // =====================================================

    const navClass = ({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`;


    // =====================================================
    // USER
    // =====================================================

    const username =
        user?.username ||
        user?.name ||
        "User";

    const avatarLetter =
        username.charAt(0).toUpperCase();


    // =====================================================
    // GET UNREAD COUNTS
    // =====================================================

    const loadUnreadCounts = async () => {

        if (!user?.userId) {
            return;
        }

        try {

            // -------------------------------
            // UNREAD NOTIFICATIONS
            // -------------------------------

            const unreadNotifications =
                await notificationAPI.getUnreadNotifications(
                    user.userId
                );

            let notificationTotal = 0;

            if (Array.isArray(unreadNotifications)) {

                notificationTotal =
                    unreadNotifications.length;

            } else if (
                typeof unreadNotifications === "number"
            ) {

                notificationTotal =
                    unreadNotifications;

            } else if (
                unreadNotifications?.count !== undefined
            ) {

                notificationTotal =
                    Number(unreadNotifications.count);

            }

            setNotificationCount(
                notificationTotal
            );


            // -------------------------------
            // UNREAD MESSAGES
            // -------------------------------

            const unreadMessages =
                await chatAPI.getUnreadMessages(
                    user.userId
                );

            let messageTotal = 0;

            if (Array.isArray(unreadMessages)) {

                messageTotal =
                    unreadMessages.length;

            } else if (
                typeof unreadMessages === "number"
            ) {

                messageTotal =
                    unreadMessages;

            } else if (
                unreadMessages?.count !== undefined
            ) {

                messageTotal =
                    Number(unreadMessages.count);

            }

            setMessageCount(
                messageTotal
            );


        } catch (error) {

            console.error(
                "UNREAD COUNT ERROR:",
                error
            );

        }
    };


    // =====================================================
    // LOAD COUNTS
    // =====================================================

    useEffect(() => {

        if (!user?.userId) {
            return;
        }

        loadUnreadCounts();

        // Refresh unread counts every 5 seconds
        const interval =
            setInterval(
                loadUnreadCounts,
                5000
            );

        return () => {
            clearInterval(interval);
        };

    }, [user?.userId]);


    // =====================================================
    // REFRESH COUNTS WHEN PAGE MARKS SOMETHING AS READ
    // =====================================================

    useEffect(() => {

        const handleUnreadUpdate = () => {
            loadUnreadCounts();
        };

        window.addEventListener(
            "unreadCountUpdated",
            handleUnreadUpdate
        );

        return () => {

            window.removeEventListener(
                "unreadCountUpdated",
                handleUnreadUpdate
            );

        };

    }, [user?.userId]);


    return (

        <div className="social-app">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="sidebar">

                {/* BRAND */}

                <div className="brand">

                    <div className="brand-icon">
                        ✦
                    </div>

                    <span>
                        SocialSphere
                    </span>

                </div>


                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    {/* HOME */}

                    <NavLink
                        to="/"
                        end
                        className={navClass}
                    >
                        <span>⌂</span>
                        <span>Home</span>
                    </NavLink>


                    {/* NOTIFICATIONS */}

                    <NavLink
                        to="/notifications"
                        className={navClass}
                    >

                        <span>♧</span>

                        <span>
                            Notifications
                        </span>

                        {notificationCount > 0 && (

                            <span className="nav-badge">
                                {notificationCount}
                            </span>

                        )}

                    </NavLink>


                    {/* MESSAGES */}

                    <NavLink
                        to="/messages"
                        className={navClass}
                    >

                        <span>◌</span>

                        <span>
                            Messages
                        </span>

                        {messageCount > 0 && (

                            <span className="nav-badge">
                                {messageCount}
                            </span>

                        )}

                    </NavLink>


                    {/* PROFILE */}

                    <NavLink
                        to="/profile"
                        className={navClass}
                    >
                        <span>◯</span>
                        <span>Profile</span>
                    </NavLink>

                </nav>


                {/* =================================================
                    SIDEBAR BOTTOM
                ================================================= */}

                <div className="sidebar-bottom">

                    {/* SETTINGS */}

                    <button
                        type="button"
                        className="nav-item settings-button"
                        onClick={() =>
                            navigate("/settings")
                        }
                    >

                        <span>
                            ⚙
                        </span>

                        <span>
                            Settings
                        </span>

                    </button>


                    {/* USER */}

                    <div className="sidebar-user">

                        <div className="avatar avatar-small">
                            {avatarLetter}
                        </div>


                        <div className="sidebar-user-info">

                            <strong>
                                {username}
                            </strong>

                            <span>
                                @{username}
                            </span>

                        </div>


                        {/* LOGOUT */}

                        <button
                            type="button"
                            className="logout-icon"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            ↪
                        </button>

                    </div>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">

                {/* TOPBAR */}

                <header className="topbar">

                    <div className="mobile-brand">
                        ✦ SocialSphere
                    </div>


                    <div className="search-box">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search SocialSphere..."
                        />

                        <kbd>
                            ⌘ K
                        </kbd>

                    </div>


                    <div className="topbar-actions">

                        {/* NOTIFICATIONS */}

                        <button
                            type="button"
                            className="icon-button"
                            onClick={() =>
                                navigate("/notifications")
                            }
                            title="Notifications"
                        >

                            ♧

                            {notificationCount > 0 && (
                                <span className="notification-dot"></span>
                            )}

                        </button>


                        {/* MESSAGES */}

                        <button
                            type="button"
                            className="icon-button"
                            onClick={() =>
                                navigate("/messages")
                            }
                            title="Messages"
                        >

                            ◌

                            {messageCount > 0 && (
                                <span className="notification-dot"></span>
                            )}

                        </button>


                        {/* PROFILE */}

                        <button
                            type="button"
                            className="top-avatar"
                            onClick={() =>
                                navigate("/profile")
                            }
                            title="Profile"
                        >

                            {avatarLetter}

                        </button>

                    </div>

                </header>


                {/* PAGE */}

                {children}

            </main>

        </div>
    );
}

export default AppLayout;