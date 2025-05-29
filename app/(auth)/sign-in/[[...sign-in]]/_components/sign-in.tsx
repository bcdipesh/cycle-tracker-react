"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function SignInForm() {
  const { resolvedTheme } = useTheme();

  return (
    <SignIn
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: {
          cardBox:
            "dark:bg-gradient-to-br dark:from-rose-950 dark:to-purple-950",
          card: {
            background: "transparent",
            borderRadius: "0",
            boxShadow: "none",
          },
          formFieldInput: {
            backgroundColor:
              "color-mix(in oklab, var(--input) 30%, transparent)",
          },
          formButtonPrimary: {
            backgroundColor: "var(--primary)",
            "&:hover": {
              backgroundColor:
                "color-mix(in oklab, var(--primary) 90%, transparent)",
            },
            boxShadow: "none !important",
            color: "var(--primary-foreground)",
          },
          footer: {
            background: "transparent",
          },
        },
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    />
  );
}
