import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ThemeContext = createContext({ theme: "dark", toggle: () => {} });
const KEY = "hastivo-theme";

function paint(theme) {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  el.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const current = useRef("dark");

  useEffect(() => {
    let stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch {}
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    current.current = initial;
    paint(initial);
    setTheme(initial);
  }, []);

  const toggle = useCallback((event) => {
    const next = current.current === "dark" ? "light" : "dark";
    current.current = next;
    try { window.localStorage.setItem(KEY, next); } catch {}

    const apply = () => paint(next);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof document.startViewTransition !== "function" || reduced) {
      apply();
      setTheme(next);
      return;
    }
    // Telegram-style: new theme expands as a circle from the toggle
    const x = event?.clientX || window.innerWidth - 40;
    const y = event?.clientY || 40;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    try {
      const vt = document.startViewTransition(apply);
      vt.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
          );
        })
        .catch(() => {});
      vt.finished.finally(() => {
        paint(next);
        setTheme(next);
      });
    } catch {
      apply();
      setTheme(next);
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
