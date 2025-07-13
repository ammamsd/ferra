import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultMovies = [
  {
    title: "Inception",
    description: "Um ladrão que rouba segredos corporativos através do uso de tecnologia de compartilhamento de sonhos...",
    embedUrl: "https://mixdrop.co/e/abcdefg12345",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    year: "2010",
    category: "Ação",
    featured: true
  },
  {
    title: "Interstellar",
    description: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço...",
    embedUrl: "https://mixdrop.co/e/hijklmn67890",
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    year: "2014",
    category: "Ficção Científica",
    featured: false
  }
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: "", description: "", embedUrl: "", poster: "", year: "", category: "", featured: false });
  const [admin, setAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("movies");
    if (saved) {
      setMovies(JSON.parse(saved));
    } else {
      setMovies(defaultMovies);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMovie({ ...newMovie, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddMovie = () => {
    const updated = [...movies, newMovie];
    setMovies(updated);
    localStorage.setItem("movies", JSON.stringify(updated));
    setNewMovie({ title: "", description: "", embedUrl: "", poster: "", year: "", category: "", featured: false });
  };

  const handleLogin = () => {
    if (password === "admin123") {
      setAdmin(true);
    } else {
      alert("Senha incorreta");
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? movie.category === filterCategory : true;
    const matchesYear = filterYear ? movie.year === filterYear : true;
    return matchesSearch && matchesCategory && matchesYear;
  });

  const featuredMovies = filteredMovies.filter((movie) => movie.featured);

  return (
    <main className="p-4 grid gap-6">
      {!admin ? (
        <section className="bg-gray-100 p-4 rounded-xl max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2 text-center">Área de Administração</h2>
          <Input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="mt-4 w-full" onClick={handleLogin}>Entrar</Button>
        </section>
      ) : (
        <section className="bg-gray-100 p-4 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Adicionar Novo Filme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="title" placeholder="Título" value={newMovie.title} onChange={handleChange} />
            <Input name="poster" placeholder="URL da capa" value={newMovie.poster} onChange={handleChange} />
            <Input name="embedUrl" placeholder="Link MixDrop (ex: https://mixdrop.co/e/xxx)" value={newMovie.embedUrl} onChange={handleChange} />
            <Textarea name="description" placeholder="Descrição" value={newMovie.description} onChange={handleChange} />
            <Input name="year" placeholder="Ano" value={newMovie.year} onChange={handleChange} />
            <Input name="category" placeholder="Categoria" value={newMovie.category} onChange={handleChange} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={newMovie.featured} onChange={handleChange} /> Destaque
            </label>
          </div>
          <Button className="mt-4" onClick={handleAddMovie}>Salvar Filme</Button>
        </section>
      )}

      <section className="max-w-2xl mx-auto grid gap-4">
        <Input
          type="text"
          placeholder="Buscar filme por título ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Filtrar por categoria"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filtrar por ano"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />
        </div>
      </section>

      {featuredMovies.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 Filmes em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredMovies.map((movie, index) => (
              <Card key={index} className="rounded-2xl shadow-md overflow-hidden border-2 border-yellow-400">
                <img src={movie.poster} alt={movie.title} className="w-full h-72 object-cover" />
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                  <p className="text-sm text-gray-700 mb-4">{movie.description}</p>
                  <div className="aspect-video">
                    <iframe
                      src={movie.embedUrl}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      className="rounded-xl border"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-4">📺 Todos os Filmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMovies.map((movie, index) => (
            <Card key={index} className="rounded-2xl shadow-md overflow-hidden">
              <img src={movie.poster} alt={movie.title} className="w-full h-72 object-cover" />
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                <p className="text-sm text-gray-700 mb-1">{movie.description}</p>
                <p className="text-xs text-gray-500">{movie.category} • {movie.year}</p>
                <div className="aspect-video mt-2">
                  <iframe
                    src={movie.embedUrl}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    className="rounded-xl border"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
