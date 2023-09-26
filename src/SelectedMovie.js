import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./loader";
export default function SelectedMovie({
  selectedId,
  setSelectedID,
  setWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [myRating, SetMyRating] = useState(null);
  const Key = "4f4fb9a7";
  var isMovieWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);
  const userRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  function onAddNewWatchedMovie() {
    const NewMovieObj = {
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: movie.imdbRating,
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating: myRating,
      imdbID: movie.imdbID,
    };
    setWatched((movie) => [...movie, NewMovieObj]);
    setSelectedID(null);
  }

  useEffect(
    function () {
      function Callback(e) {
        if (e.key === "Escape" || e.key === "Backspace") {
          setSelectedID(null);
        }
      }
      document.addEventListener("keydown", Callback);
      return function () {
        document.removeEventListener("keydown", Callback);
      };
    },
    [setSelectedID]
  );
  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;
      return function () {
        document.title = `usePopcorn`;
      };
    },
    [movie.Title]
  );
  useEffect(
    function () {
      async function MovieDetails() {
        setIsloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&i=${selectedId}`
        );
        const resJson = await res.json();
        console.log(resJson);
        setIsloading(false);
        setMovie(resJson);
      }
      MovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => setSelectedID(null)}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`poster of the ${movie.Title}`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>Genre: {movie.Genre}</p>
              <p>Language: {movie.Language}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isMovieWatched ? (
                <>
                  <StarRating SetMyRating={SetMyRating} />
                  <button className="btn-add" onClick={onAddNewWatchedMovie}>
                    Add to the List
                  </button>
                </>
              ) : (
                <p className="MovieRated">
                  you have rated this movie {userRating}
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
