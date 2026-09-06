import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { postAPI } from "../services/postService";

function Profile() {

    const { user } = useAuth();

    // ==========================================
    // STATES
    // ==========================================

    const [activeTab, setActiveTab] =
        useState("Posts");

    const [posts, setPosts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // CURRENT USER ID
    // ==========================================

    const userId =
        user?.id ||
        user?.userId;


    // ==========================================
    // USER INFORMATION
    // ==========================================

    const username =
        user?.username ||
        user?.name ||
        "user";

    const email =
        user?.email ||
        "user@example.com";

    const avatar =
        username.charAt(0).toUpperCase();


    // ==========================================
    // LOAD POSTS
    // ==========================================

    useEffect(() => {

        if (!userId) {

            setLoading(false);

            return;
        }

        loadPosts();

    }, [userId]);


    // ==========================================
    // GET POSTS FROM DATABASE
    // ==========================================

    const loadPosts = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "PROFILE USER ID:",
                userId
            );


            const postsData =
                await postAPI.getPostsByUser(userId);


            console.log(
                "PROFILE POSTS:",
                postsData
            );


            if (Array.isArray(postsData)) {

                setPosts(postsData);

            } else {

                setPosts([]);

            }


        } catch (err) {

            console.error(
                "PROFILE POSTS ERROR:",
                err
            );

            setError(
                "Unable to load your posts."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <AppLayout>

                <div className="page-container">

                    <div className="card profile-empty">

                        <h3>
                            Loading profile...
                        </h3>

                    </div>

                </div>

            </AppLayout>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <AppLayout>

                <div className="page-container">

                    <div className="card profile-empty">

                        <h3>
                            {error}
                        </h3>

                        <button
                            className="primary-button"
                            onClick={loadPosts}
                        >
                            Retry
                        </button>

                    </div>

                </div>

            </AppLayout>

        );

    }


    // ==========================================
    // PROFILE
    // ==========================================

    return (

        <AppLayout>

            <div className="page-container profile-page">


                {/* =====================================
                    PROFILE COVER
                ===================================== */}

                <section className="profile-cover">

                    <div className="cover-pattern"></div>

                </section>


                {/* =====================================
                    PROFILE HEADER
                ===================================== */}

                <section className="profile-header card">

                    <div className="profile-main">


                        {/* AVATAR */}

                        <div className="profile-avatar">

                            {avatar}

                        </div>


                        {/* USER INFORMATION */}

                        <div className="profile-info">

                            <div className="profile-name-row">

                                <div>

                                    <h1>
                                        {username}
                                    </h1>

                                    <p>
                                        @{username.toLowerCase()}
                                    </p>

                                </div>

                            </div>


                            {/* BIO */}

                            <p className="profile-bio">

                                Software developer •
                                Building ideas into products 🚀

                            </p>


                            {/* DETAILS */}

                            <div className="profile-details">

                                <span>
                                    📍 India
                                </span>

                                <span>
                                    🔗 SocialSphere
                                </span>

                                <span>
                                    ✉ {email}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        PROFILE STATS
                    ================================= */}

                    <div className="profile-stats">

                        <div>

                            <strong>
                                {posts.length}
                            </strong>

                            <span>
                                Posts
                            </span>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    PROFILE CONTENT
                ===================================== */}

                <div className="profile-grid">


                    {/* =================================
                        MAIN
                    ================================= */}

                    <main>


                        {/* =================================
                            TABS
                        ================================= */}

                        <div className="profile-tabs card">

                            {[
                                "Posts",
                                "Replies",
                                "Media",
                                "Likes"
                            ].map((tab) => (

                                <button
                                    key={tab}
                                    className={
                                        activeTab === tab
                                            ? "profile-tab active"
                                            : "profile-tab"
                                    }
                                    onClick={() =>
                                        setActiveTab(tab)
                                    }
                                >

                                    {tab}

                                </button>

                            ))}

                        </div>


                        {/* =================================
                            POSTS
                        ================================= */}

                        {activeTab === "Posts" && (

                            <div className="profile-posts">


                                {/* NO POSTS */}

                                {posts.length === 0 ? (

                                    <div className="profile-empty card">

                                        <div className="profile-empty-icon">
                                            ✦
                                        </div>

                                        <h3>
                                            No posts yet
                                        </h3>

                                        <p>
                                            Your posts will appear
                                            here.
                                        </p>

                                    </div>

                                ) : (

                                    posts.map((post) => (

                                        <article
                                            className="post-card card"
                                            key={post.id}
                                        >


                                            {/* =============================
                                                POST HEADER
                                            ============================= */}

                                            <div className="post-header">

                                                <div className="post-user">

                                                    <div className="avatar">

                                                        {avatar}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {username}
                                                        </strong>

                                                        <span>
                                                            @{username}
                                                        </span>

                                                    </div>

                                                </div>


                                                <button
                                                    className="more-button"
                                                >
                                                    •••
                                                </button>

                                            </div>


                                            {/* =============================
                                                TEXT CONTENT
                                            ============================= */}

                                            {post.content && (

                                                <div className="post-content">

                                                    {post.content}

                                                </div>

                                            )}


                                            {/* =============================
                                                MEDIA / IMAGE
                                            ============================= */}

                                            {post.mediaId && (

                                                <div
                                                    className="post-media"
                                                    style={{
                                                        marginTop: "12px"
                                                    }}
                                                >

                                                    <img
                                                        src={
                                                            ` ${import.meta.env.VITE_API_BASE_URL}/media/file/${post.mediaId}`
                                                        }
                                                        alt="Post"
                                                        style={{
                                                            width: "100%",
                                                            maxHeight: "500px",
                                                            objectFit: "cover",
                                                            borderRadius: "12px",
                                                            display: "block"
                                                        }}
                                                    />

                                                </div>

                                            )}


                                            {/* =============================
                                                POST DATE
                                            ============================= */}

                                            {post.createdAt && (

                                                <div className="post-stats">

                                                    <span>

                                                        {new Date(
                                                            post.createdAt
                                                        ).toLocaleString()}

                                                    </span>

                                                </div>

                                            )}


                                            {/* =============================
                                                POST ACTIONS
                                            ============================= */}

                                            <div className="post-actions">

                                                <button>
                                                    ♡ Like
                                                </button>

                                                <button>
                                                    ◌ Comment
                                                </button>

                                                <button>
                                                    ↗ Share
                                                </button>

                                            </div>


                                        </article>

                                    ))

                                )}

                            </div>

                        )}


                        {/* =================================
                            REPLIES / MEDIA / LIKES
                        ================================= */}

                        {activeTab !== "Posts" && (

                            <div className="profile-empty card">

                                <div className="profile-empty-icon">
                                    ✦
                                </div>

                                <h3>
                                    {activeTab}
                                </h3>

                                <p>

                                    Your{" "}
                                    {activeTab.toLowerCase()}
                                    will appear here.

                                </p>

                            </div>

                        )}

                    </main>


                    {/* =====================================
                        RIGHT SIDEBAR
                    ===================================== */}

                    <aside>


                        {/* =================================
                            ABOUT
                        ================================= */}

                        <div className="card profile-sidebar">

                            <h3>
                                About
                            </h3>

                            <p>

                                Welcome to my SocialSphere
                                profile. Follow me to see
                                my latest posts and updates.

                            </p>


                            <div className="profile-about-item">

                                <span>
                                    🎓
                                </span>

                                <div>

                                    <strong>
                                        Developer
                                    </strong>

                                    <small>
                                        Technology & Software
                                    </small>

                                </div>

                            </div>


                            <div className="profile-about-item">

                                <span>
                                    📅
                                </span>

                                <div>

                                    <strong>
                                        Joined SocialSphere
                                    </strong>

                                    <small>
                                        Recently
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            PROFILE SUMMARY
                        ================================= */}

                        <div className="card profile-sidebar">

                            <h3>
                                Profile Summary
                            </h3>

                            <p>
                                📝 {posts.length} posts
                            </p>

                        </div>


                    </aside>

                </div>

            </div>

        </AppLayout>

    );

}

export default Profile;
