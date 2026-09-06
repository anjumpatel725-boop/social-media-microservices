import { useState } from "react";

function PostCard({ post }) {

  const [liked, setLiked] = useState(false);

  const [likes, setLikes] = useState(
    post.likes || 0
  );

  const toggleLike = () => {

    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  return (
    <article className="post-card">

      <div className="post-header">

        <div className="post-avatar">
          {post.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>

          <h3>{post.username || "User"}</h3>

          <span className="post-time">
            {post.time || "Just now"}
          </span>

        </div>

      </div>

      <div className="post-content">

        <p>{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="post-image"
          />
        )}

      </div>

      <div className="post-stats">

        <span>
          ❤️ {likes} likes
        </span>

        <span>
          💬 {post.comments || 0} comments
        </span>

      </div>

      <div className="post-actions">

        <button
          className={liked ? "liked" : ""}
          onClick={toggleLike}
        >
          ❤️ Like
        </button>

        <button>
          💬 Comment
        </button>

        <button>
          ↗️ Share
        </button>

      </div>

    </article>
  );
}

export default PostCard;