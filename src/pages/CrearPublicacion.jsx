import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/usuario";

function CrearPublicacion() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setError("Título y contenido son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createPost({
        title: form.title.trim(),
        content: form.content.trim(),
      });

      if (response.status === 400) {
        setError("Datos inválidos. Revisa el formulario.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error al crear publicación: ${response.status}`);
      }

      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la publicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Crear nueva publicación
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Mi nueva clase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contenido
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="6"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe aquí el contenido de la publicación..."
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}

export default CrearPublicacion;