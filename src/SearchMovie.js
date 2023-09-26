import { useEffect, useRef } from "react";

export default function SearchMovie({ query, setQuery }) {
  const searchBox = useRef();
  useEffect(function () {
    function callback(e) {
      if (e.key === "Enter") searchBox.current.focus();
    }
    document.addEventListener("keydown", callback);
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={searchBox}
    />
  );
}
