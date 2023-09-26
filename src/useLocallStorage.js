import { useState, useEffect } from "react";
export function useLocallStorage(initialState) {
  const [value, setValue] = useState(function () {
    const getItem = localStorage.getItem("watched");
    console.log(getItem, "getItem");
    return getItem ? JSON.parse(getItem) : initialState;
  });
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value]
  );
  return [value, setValue];
}
