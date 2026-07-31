import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("commissure-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("commissure-theme", next);
  };

  if (!mounted) {
    return (
      <div className="theme-switch" aria-hidden="true">
        <span className="theme-switch__option theme-switch__option--light">Light</span>
        <span className="theme-switch__option theme-switch__option--dark">Dark</span>
      </div>
    );
  }

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggle}
        aria-label="Toggle dark mode"
      />
      <span className="theme-switch__option theme-switch__option--light">Light</span>
      <span className="theme-switch__option theme-switch__option--dark">Dark</span>
    </label>
  );
}
