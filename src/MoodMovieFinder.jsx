import React, { useState } from "react";
import { Search, Film, Sparkles, Heart, Zap, Moon, Smile } from "lucide-react";

const moodMap = {
  Happy: "comedy",
  Sad: "drama",
  Excited: "action",
  Romantic: "romance",
  Chill: "sci-fi",
};

const moodIcons = {
  Happy: <Smile className="w-5 h-5" />,
  Sad: <Moon className="w-5 h-5" />,
  Excited: <Zap className="w-5 h-5" />,
  Romantic: <Heart className="w-5 h-5" />,
  Chill: <Sparkles className="w-5 h-5" />,
};

export default function MoodMovieFinder() {
  const [selectedMood, setSelectedMood] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);

    try {
      // Open Source Dummy API
      const genre = moodMap[mood];

      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${genre}`
      );

      const data = await response.json();

      const formatted = data.slice(0, 12).map((item) => ({
        id: item.show.id,
        title: item.show.name,
        image:
          item.show.image?.medium ||
          "https://via.placeholder.com/300x450?text=No+Image",
        rating: item.show.rating?.average || "N/A",
        summary: item.show.summary?.replace(/<[^>]+>/g, "") || "No summary",
      }));

      setMovies(formatted);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Film className="w-10 h-10 text-pink-400" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            MoodFlix
          </h1>
        </div>

        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
          Discover movies that match your vibe.  
          Whether your soul feels electric, romantic, dreamy, or calm —
          MoodFlix finds something cinematic for your moment.
        </p>

        {/* Mood Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">
          {Object.keys(moodMap).map((mood) => (
            <button
              key={mood}
              onClick={() => fetchMovies(mood)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 border
                ${
                  selectedMood === mood
                    ? "bg-pink-500 border-pink-500 shadow-lg shadow-pink-500/30"
                    : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                }`}
            >
              {moodIcons[mood]}
              {mood}
            </button>
          ))}
        </div>

        {/* Search Info */}
        {selectedMood && (
          <div className="flex items-center gap-2 mt-10 text-pink-300">
            <Search className="w-5 h-5" />
            <p>
              Showing movies for your{" "}
              <span className="font-semibold">{selectedMood}</span> mood
            </p>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="mt-20 text-center text-slate-300 animate-pulse">
            Finding your perfect movie universe...
          </div>
        )}

        {/* Movie Grid */}
        {!loading && movies.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-pink-500 transition-all duration-300 hover:-translate-y-2"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-[400px] object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between items-start gap-3">
                    <h2 className="text-xl font-semibold">
                      {movie.title}
                    </h2>

                    <div className="bg-pink-500 text-sm px-2 py-1 rounded-lg">
                      ⭐ {movie.rating}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mt-4 line-clamp-4">
                    {movie.summary}
                  </p>

                  <button className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 py-3 rounded-xl font-medium hover:opacity-90 transition">
                    Watch Trailer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && selectedMood === "" && (
          <div className="mt-24 text-center">
            <div className="inline-flex p-6 rounded-full bg-slate-800">
              <Film className="w-10 h-10 text-pink-400" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Pick your mood
            </h2>

            <p className="text-slate-400 mt-3">
              Your next favorite movie is waiting in the stars ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}