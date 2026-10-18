"use client";

import { useEffect } from "react";

/** Match the existing static pages; this reads only the appearance preference. */
export function usePunstemTheme() {
  useEffect(() => {
    let theme = "light";
    try {
      const saved = localStorage.getItem("punstemTheme");
      if (saved === "light" || saved === "dark") theme = saved;
    } catch { /* Storage is optional, not an authentication requirement. */ }
    document.documentElement.dataset.theme = theme;
  }, []);
}
