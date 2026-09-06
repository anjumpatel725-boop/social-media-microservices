import React, {
    useEffect,
    useState
} from "react";

import AppLayout from "../components/AppLayout";

import {
    mediaAPI
} from "../services/mediaService";

import {
    useAuth
} from "../context/AuthContext";

function Media() {

    const { user } = useAuth();

    const [file, setFile] =
        useState(null);

    const [media, setMedia] =
        useState([]);

    const [uploading, setUploading] =
        useState(false);


    useEffect(() => {

        if (user?.userId) {
            loadMedia();
        }

    }, [user]);


    const loadMedia = async () => {

        try {

            const data =
                await mediaAPI.getUserMedia(
                    user.userId
                );

            console.log(
                "MEDIA FROM API:",
                data
            );

            setMedia(data);

        } catch (error) {

            console.error(
                "MEDIA ERROR:",
                error
            );

        }

    };


    const handleUpload = async () => {

        if (!file) {
            alert("Please select a file");
            return;
        }

        try {

            setUploading(true);

            const response =
                await mediaAPI.upload(
                    file,
                    user.userId
                );

            console.log(
                "UPLOAD RESPONSE:",
                response
            );

            setFile(null);

            await loadMedia();

            alert(
                "Media uploaded successfully!"
            );

        } catch (error) {

            console.error(
                "UPLOAD ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to upload media"
            );

        } finally {

            setUploading(false);

        }

    };


    return (

        <AppLayout>

            <div className="page-container">

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            MEDIA
                        </p>

                        <h1>
                            Your Media
                        </h1>

                        <p className="page-description">
                            Upload and manage your photos
                            and videos.
                        </p>

                    </div>

                </div>


                {/* UPLOAD */}

                <div className="card media-upload-card">

                    <h3>
                        Upload Media
                    </h3>

                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) =>
                            setFile(
                                e.target.files[0]
                            )
                        }
                    />

                    {file && (

                        <p>
                            Selected: {file.name}
                        </p>

                    )}

                    <button
                        className="primary-button"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload Media →"}
                    </button>

                </div>


                {/* MEDIA GRID */}

                <div className="media-grid">

                    {media.map(
                        (item) => (

                            <div
                                className="media-card card"
                                key={item.id}
                            >

                                {item.mediaType ===
                                "VIDEO" ? (

                                    <video
                                        src={item.url}
                                        controls
                                    />

                                ) : (

                                    <img
                                        src={item.url}
                                        alt="Uploaded media"
                                    />

                                )}

                            </div>

                        )
                    )}

                </div>

            </div>

        </AppLayout>
    );
}

export default Media;