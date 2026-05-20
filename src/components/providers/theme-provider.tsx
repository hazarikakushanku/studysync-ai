"use client";

import React, { createContext, useContext } from "react";

// simplified theme context - no dark mode for a beginner project
const ThemeContext = createContext({
  theme: "light" as string,
  setTheme: (theme: string) => {},
  resolvedTheme: "light" as string,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "light", setTheme: () => {}, resolvedTheme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
