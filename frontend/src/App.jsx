import React from "react";
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import CreatePost from "./pages/CreatePost";
import Media from "./pages/Media";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================
                PROTECTED ROUTES
            ========================= */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/create-post"
                    element={<CreatePost />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/messages"
                    element={<Messages />}
                />

                <Route
                    path="/chat/:userId"
                    element={<Chat />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

            </Route>


            {/* =========================
                UNKNOWN ROUTE
            ========================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;