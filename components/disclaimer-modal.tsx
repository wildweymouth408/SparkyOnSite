// components/disclaimer-modal.tsx
"use client";

import { useState, useEffect } from "react";

export function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem("sparky_disclaimer_v1");
    if (!acknowledged) setShow(true);
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem("sparky_disclaimer_v1", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl">

        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-xl">
            ⚡
          </div>
          <h2 className="text-base font-semibold">Before you start</h2>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Sparky is a <strong>reference tool</strong> — not a replacement for your license,
          your NEC book, or your judgment on the job.
        </p>
        <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5 mb-4 list-none">
          <li className="flex gap-2">
            <span className="text-yellow-500 mt-0.5">→</span>
            Always verify calculations against current NEC and local AHJ requirements.
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-500 mt-0.5">→</span>
            Ask Sparky AI provides general guidance only — it is not an engineer.
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-500 mt-0.5">→</span>
            You are responsible for the work you put your name on.
          </li>
        </ul>
        <p className="text-xs text-muted-foreground mb-5">
          By continuing, you agree to Sparky&apos;s{" "}
          <a href="/terms" className="underline">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>

        {/* CTA */}
        <button
          onClick={handleAcknowledge}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl py-3 text-sm transition-colors"
        >
          Got it — let&apos;s work
        </button>
      </div>
    </div>
  );
}
