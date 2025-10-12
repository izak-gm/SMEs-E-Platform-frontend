"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      expand
      toastOptions={{
        duration: 4000,
        style: { borderRadius: "0.5rem" },
      }}
    />
  );
}
