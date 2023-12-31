import { useState } from "react";
import Loader from "./loader";
import Error from "./Error";
import Logo from "./Logo";
import MovieList from "./MovieList";
import SearchMovie from "./SearchMovie";
import SelectedMovie from "./SelectedMovie";
import { useMovies } from "./useMovies";
import { useLocallStorage } from "./useLocallStorage";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedID] = useState(null);
  const { isLoading, movies, error } = useMovies(query);
  const [watched, setWatched] = useLocallStorage();

  function onDeleteMovie(MovieId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== MovieId)
    );
  }

  // component composition - breaks the prop drilling.
  return (
    <>
      <MovieNavBar query={query} setQuery={setQuery}>
        <MovieList movies={movies} />
      </MovieNavBar>
      {/* explicit way of component composition  
       <MovieBox>
        <MoviesList elements={<Movies movies={movies} />} />
        <MoviesList
          elements={
            <>
              <MoviesDescription watched={watched} />
              <MovieWatchedList watched={watched} />
            </>
          }
        />
      </MovieBox> 
      */}

      {/* implcit way of component composition */}
      <MovieBox>
        <MoviesList>
          {isLoading ? <Loader /> : query.length <= 0 && <SearchMovies />}
          {!isLoading && !error && (
            <Movies
              movies={movies}
              selectedId={selectedId}
              setSelectedID={setSelectedID}
            />
          )}
          {error && <Error error={error} />}
        </MoviesList>

        <MoviesList>
          {selectedId === null || selectedId.length <= 0 ? (
            <>
              <MoviesDescription watched={watched} />
              <MovieWatchedList
                watched={watched}
                onDeleteMovie={onDeleteMovie}
              />
            </>
          ) : (
            <SelectedMovie
              selectedId={selectedId}
              setSelectedID={setSelectedID}
              setWatched={setWatched}
              watched={watched}
            />
          )}
        </MoviesList>
      </MovieBox>
    </>
  );
}
function MovieNavBar({ query, setQuery, children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <SearchMovie query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
}

function MovieBox({ children }) {
  return <main className="main">{children}</main>;
}
function SearchMovies() {
  return <p className="loader">Search the movie</p>;
}
function MoviesList({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
      {/* <img
        width="104"
        height="104"
        src="https://img.icons8.com/metro/208/000000/search.png"
        alt="search"
      /> */}
    </div>
  );
}
function Movies({ movies, selectedId, setSelectedID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() =>
            setSelectedID(selectedId === movie.imdbID ? null : movie.imdbID)
          }
        >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
function MoviesDescription({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function MovieWatchedList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie, num) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => onDeleteMovie(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
