"use client";

// Registers the shell service worker (offline fallback page + icons).
// Production only — a dev-mode worker just gets in the way of hot reload.

import { useEffect } from "react";

export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
