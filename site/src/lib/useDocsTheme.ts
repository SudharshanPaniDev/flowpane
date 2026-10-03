import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "fp-docs-theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useDocsTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // storage unavailable
    }
    return systemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-fp-theme", theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // storage unavailable
    }
  };

  return { theme, toggle };
}
