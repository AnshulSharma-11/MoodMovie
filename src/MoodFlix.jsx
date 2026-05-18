import "./MoodFlix.css";
import { useEffect, useState } from "react";


export default function MoodFlix() {
  
  let moods = [
    { label: "Happy", icon: "bi-emoji-smile", genre: "comedy" },
    { label: "Sad", icon: "bi-cloud-drizzle", genre: "drama" },
    { label: "Excited", icon: "bi-lightning-charge", genre: "action" },
    { label: "Romantic", icon: "bi-heart", genre: "romance" },
    { label: "Chill", icon: "bi-stars", genre: "sci-fi" },
  ];

  let [selectedMood, setSelectedMood] = useState("");
  let [movies, setMovies] = useState([]);
  let [loading, setLoading] = useState(false);

  let fetchMovies = async (mood) => {
    if (selectedMood === mood.label) return;

    setSelectedMood(mood.label);
    setLoading(true);

    try {
      let res = await fetch(
        `https://api.tvmaze.com/search/shows?q=${mood.genre}`
      );

      let data = await res.json();

      let formattedMovies = data.slice(0, 12).map((item) => ({
        id: item.show.id,
        title: item.show.name,
        image: item.show.image?.medium || "",
        rating: item.show.rating?.average || "N/A",
        summary: (
          item.show.summary || "No description available."
        ).replace(/<[^>]+>/g, ""),
      }));

      setMovies(formattedMovies);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  
  return (
    <div className="app-container">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="hero-chip">
          <i className="bi bi-film"></i> MoodFlix
        </span>
      </div>

      <h1 className="main-heading">Find your perfect film</h1>

      <p className="hero-text">
        Tell us how you're feeling and we'll find shows that match your
        moment — calm, electric, heartfelt, or dreamy.
      </p>

      <div className="section-divider"></div>

      <p className="mood-title">HOW ARE YOU FEELING?</p>

      <div className="d-flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className={`mood-btn ${
              selectedMood === mood.label
                ? `active-${mood.label}`
                : ""
            }`}
            onClick={() => fetchMovies(mood)}
          >
            <i className={`bi ${mood.icon}`}></i>
            {mood.label}
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-label">
          <i className="bi bi-search"></i>
          Showing results for your
          <strong>{selectedMood}</strong> mood
        </div>
      )}

      {loading && (
        <div className="spinner-wrap">
          <div className="spinner-ring"></div>
          <span>Finding your perfect watch...</span>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="row g-4 mt-2">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div className="movie-card h-100 d-flex flex-column">
                {movie.image ? (
                  <img src={movie.image} alt={movie.title} />
                ) : (
                  <div className="image-placeholder">
                    <i className="bi bi-camera-video"></i>
                  </div>
                )}

                <div className="card-body d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <span className="movie-title">
                      {movie.title}
                    </span>

                    <span className="rating-badge">
                      ⭐ {movie.rating}
                    </span>
                  </div>

                  <p className="summary-text flex-grow-1">
                    {movie.summary}
                  </p>

                  <button className="watch-btn mt-3">
                    <i className="bi bi-play-circle me-1"></i>
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-collection-play empty-icon"></i>

          <h5>Pick a mood to begin</h5>

          <p>Your next favorite watch is just a mood away ✨</p>
        </div>
      )}
    </div>
  );
}


