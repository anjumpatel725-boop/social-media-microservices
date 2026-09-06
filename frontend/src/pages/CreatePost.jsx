import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import { postAPI } from "../services/postService";
import { mediaAPI } from "../services/mediaService";
import { useAuth } from "../context/AuthContext";

function CreatePost() {

    const navigate = useNavigate();
    const { user } = useAuth();

    // ==========================================
    // STATE
    // ==========================================

    const [content, setContent] = useState("");
    const [privacy, setPrivacy] = useState("Public");
    const [feeling, setFeeling] = useState("");
    const [location, setLocation] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);

    const maxLength = 500;

    // ==========================================
    // USER
    // ==========================================

    const username = user?.username || "User";

    const avatar =
        username
            .charAt(0)
            .toUpperCase();

    // ==========================================
    // PHOTO SELECT
    // ==========================================

    const handleImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        console.log("==============================");
        console.log("PHOTO SELECTED");
        console.log("FILE NAME:", file.name);
        console.log("FILE TYPE:", file.type);
        console.log("FILE SIZE:", file.size);
        console.log("==============================");

        // Only images
        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image.");

            e.target.value = "";

            return;
        }

        // 20 MB limit
        if (file.size > 20 * 1024 * 1024) {

            alert("Image size must be less than 20 MB.");

            e.target.value = "";

            return;
        }

        setSelectedImage(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // ==========================================
    // REMOVE PHOTO
    // ==========================================

    const removeImage = () => {

        setSelectedImage(null);
        setImagePreview("");

        const input =
            document.getElementById("post-photo");

        if (input) {
            input.value = "";
        }
    };

    // ==========================================
    // PUBLISH POST
    // ==========================================

    const handlePublish = async (e) => {

        e.preventDefault();

        console.log("==============================");
        console.log("PUBLISH BUTTON CLICKED");
        console.log("==============================");

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!content.trim()) {

            alert(
                "Please write something in your post."
            );

            return;
        }

        if (!feeling) {

            alert(
                "Please select how you are feeling."
            );

            return;
        }

        if (!location.trim()) {

            alert(
                "Please add a location."
            );

            return;
        }

        // ==========================================
        // GET LOGGED USER
        // ==========================================

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            alert(
                "Please login again."
            );

            navigate("/login");

            return;
        }

        const currentUser =
            JSON.parse(storedUser);

        if (!currentUser.userId) {

            alert(
                "User ID not found. Please login again."
            );

            navigate("/login");

            return;
        }

        try {

            setLoading(true);

            let mediaId = null;

            // ==========================================
            // STEP 1: UPLOAD PHOTO
            // ==========================================

            if (selectedImage) {

                console.log("==============================");
                console.log("UPLOADING IMAGE...");
                console.log(
                    "FILE:",
                    selectedImage.name
                );
                console.log(
                    "USER ID:",
                    currentUser.userId
                );
                console.log("==============================");

                const media =
                    await mediaAPI.uploadMedia(
                        selectedImage,
                        Number(currentUser.userId)
                    );

                console.log(
                    "MEDIA UPLOAD RESPONSE:",
                    media
                );

                mediaId = media.id;

                console.log(
                    "MEDIA ID:",
                    mediaId
                );
            }

            // ==========================================
            // STEP 2: CREATE POST
            // ==========================================

            const postData = {

                content:
                    content.trim(),

                userId:
                    Number(currentUser.userId),

                mediaId:
                    mediaId,

                privacy:
                    privacy,

                feeling:
                    feeling,

                location:
                    location.trim()
            };

            console.log("==============================");
            console.log("CREATING POST...");
            console.log(
                "POST DATA:",
                postData
            );
            console.log("==============================");

            const response =
                await postAPI.createPost(
                    postData
                );

            console.log(
                "CREATE POST RESPONSE:",
                response
            );

            // ==========================================
            // RESET
            // ==========================================

            setContent("");
            setFeeling("");
            setLocation("");
            setPrivacy("Public");

            removeImage();

            // ==========================================
            // SUCCESS
            // ==========================================

            alert(
                "Post published successfully! 🎉"
            );

            navigate("/");

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

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // PUBLISH BUTTON VALIDATION
    // ==========================================

    const isFormValid =
        content.trim() &&
        feeling &&
        location.trim();

    // ==========================================
    // UI
    // ==========================================

    return (

        <AppLayout>

            <div className="page-container create-post-page">

                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            SHARE YOUR THOUGHTS
                        </p>

                        <h1>
                            Create Post
                        </h1>

                        <p className="page-description">
                            Share something with your SocialSphere community.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← Back to Home
                    </button>

                </div>


                {/* ==========================================
                    CREATE POST LAYOUT
                ========================================== */}

                <div className="create-post-layout">

                    {/* ==========================================
                        MAIN EDITOR
                    ========================================== */}

                    <main className="card create-post-editor">

                        <form
                            onSubmit={handlePublish}
                        >

                            {/* ==========================================
                                AUTHOR
                            ========================================== */}

                            <div className="post-author">

                                <div className="avatar">
                                    {avatar}
                                </div>

                                <div>

                                    <strong>
                                        {username}
                                    </strong>

                                    <span>
                                        @{username} · now
                                    </span>

                                </div>

                            </div>


                            {/* ==========================================
                                TEXT EDITOR
                            ========================================== */}

                            <div className="post-editor">

                                <textarea
                                    value={content}
                                    onChange={(e) => {

                                        if (
                                            e.target.value.length <=
                                            maxLength
                                        ) {

                                            setContent(
                                                e.target.value
                                            );
                                        }

                                    }}
                                    placeholder="What's on your mind?"
                                    autoFocus
                                />

                                <div className="character-count">

                                    {content.length}
                                    /{maxLength}

                                </div>

                            </div>


                            {/* ==========================================
                                PHOTO PREVIEW
                            ========================================== */}

                            {imagePreview && (

                                <div className="create-photo-preview">

                                    <div className="photo-preview-header">

                                        <strong>
                                            Selected photo
                                        </strong>

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="remove-photo-button"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                    <img
                                        src={imagePreview}
                                        alt="Selected"
                                    />

                                </div>

                            )}


                            {/* ==========================================
                                OPTIONS
                            ========================================== */}

                            <div className="post-options">

                                {/* FEELING */}

                                <div className="post-option">

                                    <label>
                                        Feeling
                                        <span>*</span>
                                    </label>

                                    <select
                                        value={feeling}
                                        onChange={(e) =>
                                            setFeeling(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select feeling
                                        </option>

                                        <option value="😊 Happy">
                                            😊 Happy
                                        </option>

                                        <option value="🚀 Excited">
                                            🚀 Excited
                                        </option>

                                        <option value="❤️ Loved">
                                            ❤️ Loved
                                        </option>

                                        <option value="😎 Cool">
                                            😎 Cool
                                        </option>

                                        <option value="💪 Motivated">
                                            💪 Motivated
                                        </option>

                                    </select>

                                </div>


                                {/* LOCATION */}

                                <div className="post-option">

                                    <label>
                                        Location
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Add location"
                                    />

                                </div>


                                {/* PRIVACY */}

                                <div className="post-option">

                                    <label>
                                        Who can see this?
                                    </label>

                                    <select
                                        value={privacy}
                                        onChange={(e) =>
                                            setPrivacy(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Public">
                                            🌎 Public
                                        </option>

                                        <option value="Followers">
                                            👥 Followers
                                        </option>

                                        <option value="Only me">
                                            🔒 Only me
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* ==========================================
                                ACTION BAR
                            ========================================== */}

                            <div className="create-post-actions">

                                <div className="post-tools">

                                    {/* HIDDEN FILE INPUT */}

                                    <input
                                        id="post-photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        style={{
                                            display: "none"
                                        }}
                                    />


                                    {/* PHOTO */}

                                    <button
                                        type="button"
                                        onClick={() => {

                                            document
                                                .getElementById(
                                                    "post-photo"
                                                )
                                                ?.click();

                                        }}
                                    >
                                        ▧ Photo
                                    </button>


                                    {/* FEELING */}

                                    <button
                                        type="button"
                                        onClick={() => {

                                            document
                                                .querySelector(
                                                    ".post-options select"
                                                )
                                                ?.focus();

                                        }}
                                    >
                                        😊 Feeling
                                    </button>


                                    {/* LOCATION */}

                                    <button
                                        type="button"
                                        onClick={() => {

                                            const inputs =
                                                document.querySelectorAll(
                                                    ".post-options input"
                                                );

                                            inputs[0]?.focus();

                                        }}
                                    >
                                        ⌖ Location
                                    </button>

                                </div>


                                {/* PUBLISH */}

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        loading ||
                                        !isFormValid
                                    }
                                >

                                    {loading
                                        ? "Publishing..."
                                        : "Publish Post →"}

                                </button>

                            </div>

                        </form>

                    </main>


                    {/* ==========================================
                        SIDEBAR
                    ========================================== */}

                    <aside className="create-post-sidebar">

                        {/* TIPS */}

                        <div className="card post-tips">

                            <div className="tips-icon">
                                ✦
                            </div>

                            <h3>
                                Make it meaningful
                            </h3>

                            <p>
                                Great posts start conversations.
                                Share something useful, interesting
                                or personal with your community.
                            </p>

                            <div className="tip-list">

                                <div>
                                    <span>✓</span>
                                    Keep it authentic
                                </div>

                                <div>
                                    <span>✓</span>
                                    Start a conversation
                                </div>

                                <div>
                                    <span>✓</span>
                                    Add photos when useful
                                </div>

                                <div>
                                    <span>✓</span>
                                    Respect your community
                                </div>

                            </div>

                        </div>


                        {/* PRIVACY */}

                        <div className="card privacy-card">

                            <div className="privacy-icon">
                                🔒
                            </div>

                            <div>

                                <h4>
                                    Your privacy matters
                                </h4>

                                <p>
                                    Choose who can see your post
                                    before publishing.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </AppLayout>
    );
}

export default CreatePost;
