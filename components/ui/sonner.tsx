"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
  className="toaster sonner-custom no-bubbles"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--green-500)",
          "--toast-action-bg": "linear-gradient(to right, #3b82f6, #6366f1)",
          "--toast-action-text": "#fff",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
