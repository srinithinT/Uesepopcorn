import { useEffect, useState } from "react";

export function useMovies(query) {
  const Key = "4f4fb9a7";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(
    function () {
      const Abort = new AbortController();
      async function fetchMovie() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            { signal: Abort.signal }
          );

          if (!res.ok) return setError("error fetching movie");
          const resJson = await res.json();
          if (resJson.Response === "False") return setError(resJson.Error);
          setMovies(resJson.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            err && setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 4) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovie();
      return function () {
        Abort.abort();
      };
    },
    [query]
  );
  return { isLoading, movies, error };
}
