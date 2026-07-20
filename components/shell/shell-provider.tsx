"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Meal } from "@/lib/meals";

type ShellContextValue = {
  captureOpen: boolean;
  // A meal to preselect when the sheet opens (e.g. from a meal's + add).
  preselectMeal: Meal | null;
  openCapture: (meal?: Meal) => void;
  closeCapture: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [preselectMeal, setPreselectMeal] = useState<Meal | null>(null);

  function openCapture(meal?: Meal) {
    setPreselectMeal(meal ?? null);
    setCaptureOpen(true);
  }
  function closeCapture() {
    setCaptureOpen(false);
  }

  return (
    <ShellContext.Provider
      value={{ captureOpen, preselectMeal, openCapture, closeCapture }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}
