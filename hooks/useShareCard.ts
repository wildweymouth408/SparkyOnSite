"use client";

import { useRef, useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseShareCardReturn {
  /** Attach this ref to the <ShareCard /> component */
  cardRef: React.RefObject<HTMLDivElement | null>;
  /** Call this to share or download the card */
  shareCard: (filename?: string) => Promise<void>;
  /** True while the image is being generated */
  isGenerating: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useShareCard
 *
 * Captures the <ShareCard /> component as a PNG via html2canvas,
 * then either:
 *   – Web Share API (mobile / Chrome desktop) → shares natively
 *   – Fallback                                → downloads as PNG
 *
 * html2canvas is loaded dynamically so it never bloats the server bundle.
 */
export function useShareCard(): UseShareCardReturn {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const shareCard = useCallback(
    async (filename = "sparky-result") => {
      if (!cardRef.current) return;
      setIsGenerating(true);

      try {
        // Dynamic import — only loaded when user hits Share
        const html2canvas = (await import("html2canvas")).default;

        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#0f172a",
          scale: 2,           // 1080 × 1080 px output
          useCORS: true,
          logging: false,
        });

        const dataUrl = canvas.toDataURL("image/png");
        const slugName = `${filename.replace(/\s+/g, "-").toLowerCase()}.png`;

        // ── Try Web Share API first (works great on iOS/Android + Chrome) ──
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.share === "function" &&
          typeof navigator.canShare === "function"
        ) {
          // Convert dataURL to Blob for the share API
          const blob = await dataUrlToBlob(dataUrl);
          const file = new File([blob], slugName, { type: "image/png" });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Sparky Calculator Result",
              text: "Calculated with Sparky — the electrician's tool ⚡",
            });
            return;
          }
        }

        // ── Fallback: trigger PNG download ──
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = slugName;
        link.click();
      } catch (err) {
        console.error("[useShareCard] Failed to generate share image:", err);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { cardRef, shareCard, isGenerating };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
