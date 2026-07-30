import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, DEFAULT_THEME, type Theme } from "./themeContext";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
}

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Aplica data-theme="light" | "dark" en <html>, que es lo único que necesita
 * index.css para pisar todas las variables de color. Se guarda en
 * localStorage para que sobreviva a un refresh de página.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}