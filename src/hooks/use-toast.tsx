"use client";

import { toast as sonner } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import type { ReactElement } from "react";
import React from "react";

// Define toast variants
type ToastVariant = "success" | "error" | "info" | "warning" | "default";

// Props for toast
interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

// Custom toast hook
export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    // Icons for different variants
    const icons: Record<ToastVariant, ReactElement | null> = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      default: null,
    };

    // Base toast styles
    const baseClass =
      "flex items-start gap-3 p-3 rounded-md shadow-md border text-sm";

    // Variant-specific colors
    const variantClasses: Record<ToastVariant, string> = {
      success: "bg-green-50 text-green-800 border-green-200",
      error: "bg-red-50 text-red-800 border-red-200",
      info: "bg-blue-50 text-blue-800 border-blue-200",
      warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
      default: "bg-white text-gray-800 border-gray-200",
    };

    // Show toast using Sonner's `custom` renderer
    sonner.custom(() => (
      <div className={`${baseClass} ${variantClasses[variant]}`}>
        {icons[variant]}
        <div className="flex flex-col">
          <strong className="font-semibold">{title}</strong>
          {description && (
            <p className="text-sm mt-0.5 text-gray-600">{description}</p>
          )}
        </div>
      </div>
    ));
  };

  return { toast };
}
