import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import { postAPI } from "../services/postService";
import { mediaAPI } from "../services/mediaService";
import { userAPI } from "../services/userService";

function Home() {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [postText, setPostText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);


    // ==========================================
    // CURRENT USER
    // ==========================================

    const getCurrentUserId = () => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            return Number(user?.userId);

        } catch {

            return null;

        }
    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (createdAt) => {

        if (!createdAt) {
            return "now";
        }

        const created = new Date(createdAt);
        const now = new Date();

        const difference =
            Math.floor(
                (now - created) / 1000
            );

        if (difference < 60) {
            return "now";
        }

        if (difference < 3600) {

            return `${Math.floor(
                difference / 60
            )}m`;

        }

        if (difference < 86400) {

            return `${Math.floor(
                difference / 3600
            )}h`;

        }

        return `${Math.floor(
            difference / 86400
        )}d`;
    };


    // ==========================================
    // LOAD POSTS + USERS
    // ==========================================

    const loadPosts = async () => {

        try {

            setLoading(true);
            setError("");

            // ------------------------------------------
            // GET ALL USERS
            // ------------------------------------------

            const users =
                await userAPI.getAllUsers();

            console.log(
                "========== ALL USERS =========="
            );

            console.log(users);


            users.forEach((user) => {

                console.log(
                    "USER ID:",
                    user.id,
                    "USERNAME:",
                    user.username,
                    "EMAIL:",
                    user.email
                );

            });


            // ------------------------------------------
            // GET ALL POSTS
            // ------------------------------------------

            const data =
                await postAPI.getAllPosts();

            console.log(
                "========== POSTS FROM API =========="
            );

            console.log(data);


            const currentUserId =
                Number(getCurrentUserId());


            const loggedInUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            // ------------------------------------------
            // FORMAT POSTS
            // ------------------------------------------

            const formattedPosts =
                data.map((post) => {

                    console.log(
                        "--------------------------------"
                    );

                    console.log(
                        "POST ID:",
                        post.id
                    );

                    console.log(
                        "POST USER ID:",
                        post.userId
                    );


                    // Find post creator
                    const postUser =
                        users.find(
                            (user) =>
                                Number(user.id) ===
                                Number(post.userId)
                        );


                    console.log(
                        "MATCHED POST USER:",
                        postUser
                    );


                    const isCurrentUser =
                        Number(post.userId) ===
                        currentUserId;


                    // ------------------------------------------
                    // IMPORTANT:
                    // Current user -> logged in username
                    // Other user -> backend user username
                    // ------------------------------------------

                    let username;


                    if (isCurrentUser) {

                        username =
                            loggedInUser?.username ||
                            postUser?.username ||
                            `User ${post.userId}`;

                    } else {

                        username =
                            postUser?.username ||
                            postUser?.name ||
                            `User ${post.userId}`;

                    }


                    console.log(
                        "FINAL USERNAME:",
                        username
                    );


                    return {

                        id: post.id,

                        userId: post.userId,

                        mediaId: post.mediaId,

                        privacy: post.privacy,

                        feeling: post.feeling,

                        location: post.location,

                        createdAt: post.createdAt,


                        // Name shown above post
                        name:
                            isCurrentUser
                                ? "You"
                                : username,


                        // @username
                        username:
                            username,


                        // First letter avatar
                        avatar:
                            username
                                ?.charAt(0)
                                ?.toUpperCase() ||
                            "U",


                        time:
                            formatTime(
                                post.createdAt
                            ),


                        content:
                            post.content,


                        likes: 0,

                        comments: 0,

                        liked: false,

                    };

                });


            console.log(
                "========== FINAL FORMATTED POSTS =========="
            );

            console.log(formattedPosts);


            setPosts(
                formattedPosts
            );


        } catch (error) {

            console.error(
                "LOAD POSTS ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );


            setError(
                error.response?.data?.message ||
                "Unable to load posts"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD HOME
    // ==========================================

    useEffect(() => {

        loadPosts();

    }, []);


    // ==========================================
    // SORT POSTS
    // ==========================================

    useEffect(() => {

        setPosts((currentPosts) => {

            const sorted =
                [...currentPosts].sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.createdAt
                            ).getTime();

                        const dateB =
                            new Date(
                                b.createdAt
                            ).getTime();


                        if (
                            sortOrder ===
                            "newest"
                        ) {

                            return dateB - dateA;

                        }


                        if (
                            sortOrder ===
                            "oldest"
                        ) {

                            return dateA - dateB;

                        }


                        return 0;

                    }
                );


            return sorted;

        });

    }, [sortOrder]);


    // ==========================================
    // LIKE
    // ==========================================

    const toggleLike = (id) => {

        setPosts((currentPosts) =>
            currentPosts.map((post) => {

                if (post.id !== id) {
                    return post;
                }

                return {

                    ...post,

                    liked:
                        !post.liked,

                    likes:
                        post.liked
                            ? post.likes - 1
                            : post.likes + 1,

                };

            })
        );

    };


    // ==========================================
    // CREATE POST
    // ==========================================

    const createPost = async () => {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            navigate("/login");

            return;

        }


        const user =
            JSON.parse(storedUser);


        if (!user.userId) {

            alert(
                "User ID not found. Please login again."
            );

            navigate("/login");

            return;

        }


        const hasText =
            postText.trim().length > 0;


        const hasImage =
            selectedImage !== null;


        if (!hasText && !hasImage) {

            alert(
                "Please write something or select a photo."
            );

            return;

        }


        try {

            console.log(
                "================================"
            );

            console.log(
                "CREATING POST"
            );

            console.log(
                "USER ID:",
                user.userId
            );

            console.log(
                "TEXT:",
                postText
            );

            console.log(
                "IMAGE:",
                selectedImage
            );


            // ======================================
            // UPLOAD IMAGE
            // ======================================

            let mediaId = null;


            if (selectedImage) {

                console.log(
                    "UPLOADING IMAGE..."
                );


                const media =
                    await mediaAPI.uploadMedia(
                        selectedImage,
                        Number(user.userId)
                    );


                console.log(
                    "UPLOADED MEDIA:",
                    media
                );


                mediaId =
                    media.id;

            }


            // ======================================
            // CREATE POST
            // ======================================

            const postData = {

                content:
                    postText.trim(),

                userId:
                    Number(user.userId),

                mediaId:
                    mediaId,

                privacy:
                    "Public",

                feeling:
                    null,

                location:
                    null,

            };


            console.log(
                "CREATING POST WITH DATA:",
                postData
            );


            await postAPI.createPost(
                postData
            );


            console.log(
                "POST CREATED SUCCESSFULLY"
            );


            // ======================================
            // RESET
            // ======================================

            setPostText("");

            setSelectedImage(null);


            // ======================================
            // RELOAD POSTS
            // ======================================

            await loadPosts();


            alert(
                "Post created successfully!"
            );


        } catch (error) {

            console.error(
                "CREATE POST ERROR:",
                error
            );


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "DATA:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Unable to create post"
            );

        }

    };


    return (

        <AppLayout>

            <div className="page-container home-page">


                {/* ==================================
                    PAGE HEADER
                ================================== */}

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            YOUR FEED
                        </p>

                        <h1>
                            Good evening 👋
                        </h1>

                        <p className="page-description">
                            See what your community is sharing today.
                        </p>

                    </div>


                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/create-post")
                        }
                    >
                        + Create Post
                    </button>

                </div>


                {/* ==================================
                    STORIES
                ================================== */}

                <section className="stories-section">

                    <div className="section-header">

                        <h2>
                            Stories
                        </h2>

                        <button>
                            View all
                        </button>

                    </div>


                    <div className="stories">

                        {/* CURRENT USER */}

                        <div
                            className="story"
                            onClick={() =>
                                navigate("/my-story")
                            }
                        >

                            <div className="story-avatar story-own">

                                {JSON.parse(
                                    localStorage.getItem("user")
                                )
                                    ?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "Y"}

                                <span className="story-plus">
                                    +
                                </span>

                            </div>


                            <span>
                                Your Story
                            </span>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    MAIN GRID
                ================================== */}

                <div className="home-grid">


                    {/* ==================================
                        FEED
                    ================================== */}

                    <div className="feed-column">


                        {/* ==================================
                            FEED HEADER
                        ================================== */}

                        <div className="feed-header">

                            <h2>
                                Latest posts
                            </h2>


                            <select
                                className="sort-button"
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="newest">
                                    Newest
                                </option>

                                <option value="oldest">
                                    Oldest
                                </option>

                            </select>

                        </div>


                        {/* ==================================
                            LOADING
                        ================================== */}

                        {loading && (

                            <div className="card">

                                <p>
                                    Loading posts...
                                </p>

                            </div>

                        )}


                        {/* ==================================
                            ERROR
                        ================================== */}

                        {!loading &&
                            error && (

                                <div className="card">

                                    <p>
                                        {error}
                                    </p>


                                    <button
                                        className="primary-button"
                                        onClick={
                                            loadPosts
                                        }
                                    >
                                        Try Again
                                    </button>

                                </div>

                            )}


                        {/* ==================================
                            NO POSTS
                        ================================== */}

                        {!loading &&
                            !error &&
                            posts.length === 0 && (

                                <div className="card">

                                    <h3>
                                        No posts yet
                                    </h3>

                                    <p>
                                        Be the first person to
                                        share something!
                                    </p>


                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            navigate(
                                                "/create-post"
                                            )
                                        }
                                    >
                                        Create your first post
                                    </button>

                                </div>

                            )}


                        {/* ==================================
                            POSTS
                        ================================== */}

                        {!loading &&
                            posts.map((post) => (

                                <article
                                    className="post-card card"
                                    key={post.id}
                                >


                                    {/* POST HEADER */}

                                    <div className="post-header">

                                        <div className="post-user">

                                            <div className="avatar">

                                                {post.avatar}

                                            </div>


                                            <div>

                                                <strong>
                                                    {post.name}
                                                </strong>


                                                <span>

                                                    @{post.username}

                                                    {" · "}

                                                    {post.time}

                                                </span>

                                            </div>

                                        </div>


                                        <button
                                            className="more-button"
                                        >
                                            •••
                                        </button>

                                    </div>


                                    {/* POST CONTENT */}

                                    <div className="post-content">

                                        {post.content && (

                                            <p>
                                                {post.content}
                                            </p>

                                        )}


                                        {post.mediaId && (

                                            <img
                                                src={` ${import.meta.env.VITE_API_BASE_URL}/media/file/${post.mediaId}`}
                                                alt="Post"
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "500px",
                                                    objectFit: "cover",
                                                    borderRadius: "14px",
                                                    marginTop: "12px",
                                                    display: "block",
                                                }}
                                            />

                                        )}

                                    </div>


                                    {/* POST STATS */}

                                    <div className="post-stats">

                                        <span>
                                            {post.likes} likes
                                        </span>


                                        <span>
                                            {post.comments} comments
                                        </span>

                                    </div>


                                    {/* POST ACTIONS */}

                                    <div className="post-actions">


                                        <button
                                            className={
                                                post.liked
                                                    ? "liked"
                                                    : ""
                                            }
                                            onClick={() =>
                                                toggleLike(
                                                    post.id
                                                )
                                            }
                                        >
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

                            ))}

                    </div>


                    {/* ==================================
                        RIGHT SIDEBAR
                    ================================== */}

                    <aside className="home-sidebar">


                        {/* ==================================
                            TRENDING
                        ================================== */}

                        <div className="card trending-card">

                            <div className="section-header">

                                <h3>
                                    Trending today
                                </h3>

                            </div>


                            <div className="trend">

                                <span>
                                    #
                                </span>

                                <div>

                                    <strong>
                                        #TechLife
                                    </strong>

                                    <small>
                                        12.8K posts
                                    </small>

                                </div>

                            </div>


                            <div className="trend">

                                <span>
                                    #
                                </span>

                                <div>

                                    <strong>
                                        #BuildInPublic
                                    </strong>

                                    <small>
                                        8.4K posts
                                    </small>

                                </div>

                            </div>


                            <div className="trend">

                                <span>
                                    #
                                </span>

                                <div>

                                    <strong>
                                        #MondayMotivation
                                    </strong>

                                    <small>
                                        6.2K posts
                                    </small>

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </AppLayout>

    );

}

export default Home;