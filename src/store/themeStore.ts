import { create } from "zustand";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  isDarkMode: boolean;
  hydrated: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setHydrated: (value: boolean) => void;
}

const getSystemPreference = (): "dark" | "light" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark =
    theme === "dark" || (theme === "system" && getSystemPreference() === "dark");

  root.classList.remove("light", "dark");
  root.classList.add(isDark ? "dark" : "light");
  root.style.colorScheme = isDark ? "dark" : "light";

  localStorage.setItem("theme", theme);
  localStorage.setItem("darkMode", String(isDark));
};

export const useThemeStore = create<ThemeState>((set) => {
  const storedTheme =
    typeof localStorage !== "undefined"
      ? ((localStorage.getItem("theme") as Theme) || "dark")
      : "dark";

  const systemPreference = getSystemPreference();
  const isDarkMode =
    storedTheme === "dark" || (storedTheme === "system" && systemPreference === "dark");

  if (typeof window !== "undefined") {
    applyTheme(storedTheme);
  }

  return {
    theme: storedTheme,
    isDarkMode,
    hydrated: false, // start as false
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.isDarkMode ? "light" : "dark";
        applyTheme(newTheme);
        return {
          theme: newTheme,
          isDarkMode: !state.isDarkMode,
        };
      });
    },
    setTheme: (theme: Theme) => {
      applyTheme(theme);
      const isDark =
        theme === "dark" || (theme === "system" && getSystemPreference() === "dark");
      set({
        theme,
        isDarkMode: isDark,
      });
    },
    setHydrated: (value: boolean) => set({ hydrated: value }),
  };
});
