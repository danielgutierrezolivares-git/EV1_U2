import { useEffect, useState } from "react";
import { getPosts, addReaction, getCurrentUserId } from "../services/usuario";

const reactionTypes = [
  { key: "like", icon: "👍" },
  { key: "love", icon: "❤" },
  { key: "haha", icon: "😂" },
  { key: "wow", icon: "😮" },
  { key: "sad", icon: "😢" },
  { key: "angry", icon: "😡" },
];

function Publicaciones() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();

      const list = data.posts || data.data || data.result || data;

      setPosts(Array.isArray(list) ? list : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleReaction = async (postId, type) => {
    try {
      const userId = getCurrentUserId();

      const response = await addReaction(postId, type, userId);

      if (response.status === 409) {
        alert("Ya reaccionaste con ese tipo en esta publicación.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error al reaccionar: ${response.status}`);
      }

      const updated = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if ((post._id || post.id) !== postId) return post;

          return {
            ...post,
            counts: updated.counts || post.counts || {},
          };
        })
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo registrar la reacción.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-slate-600">
        Cargando publicaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Publicaciones
      </h1>

      <div className="space-y-6">
        {posts.map((post) => {
          const postId = post._id || post.id;
          const authorName = post.author?.name || "Autor desconocido";
          const counts = post.counts || post.reactions?.counts || {};

          return (
            <article
              key={postId}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {authorName} • {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-slate-700 whitespace-pre-line">
                {post.content}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {reactionTypes.map(({ key, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleReaction(postId, key)}
                    className="flex items-center gap-2 border border-slate-300 rounded-full px-3 py-2 hover:bg-slate-100 transition"
                  >
                    <span>{icon}</span>
                    <span className="text-sm font-medium capitalize">
                      {key}
                    </span>
                    <span className="bg-slate-200 rounded-full px-2 py-0.5 text-xs">
                      {counts[key] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Publicaciones;