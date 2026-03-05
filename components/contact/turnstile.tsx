"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
}

export interface TurnstileRef {
  reset: () => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback": () => void;
  theme?: "light" | "dark" | "auto";
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  ({ onSuccess, onError, theme = "auto" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [widgetId, setWidgetId] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetId && window.turnstile) {
          window.turnstile.reset(widgetId);
        }
      },
    }));

    useEffect(() => {
      // Load Turnstile script
      if (typeof window === "undefined") return;
      
      if (window.turnstile) {
        setIsReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = () => setIsReady(true);
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }, []);

    useEffect(() => {
      if (!isReady || !containerRef.current) return;
      if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return;
      if (containerRef.current.innerHTML) return;

      const id = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: onSuccess,
        "error-callback": () => {
          onError?.();
        },
        theme,
      });

      setWidgetId(id);
    }, [isReady, onSuccess, onError, theme]);

    return (
      <div className="turnstile-container">
        {!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <p className="text-sm text-muted-foreground">
            Verification temporarily unavailable. Please try again later.
          </p>
        ) : (
          <div ref={containerRef} />
        )}
      </div>
    );
  }
);

Turnstile.displayName = "Turnstile";
