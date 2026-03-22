"use client";

import React, { forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShareCardResult {
  label: string;
  value: string;
  highlight?: boolean; // renders in yellow — use for the primary answer
}

export interface ShareCardInput {
  label: string;
  value: string;
}

export interface ShareCardProps {
  calculatorName: string;         // e.g. "Voltage Drop"
  inputs: ShareCardInput[];       // left column — what the user entered
  results: ShareCardResult[];     // right column — what was calculated
  passFailBadge?: "PASS" | "FAIL" | null; // optional NEC pass/fail
}

// ─── Card ─────────────────────────────────────────────────────────────────────
// Renders at exactly 540 × 540 px (1080 × 1080 @2x on retina devices).
// The parent must wrap it in a div with `overflow: hidden` and a fixed width
// of 540 px so html2canvas captures it at the right dimensions.

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ calculatorName, inputs, results, passFailBadge }, ref) => {
    const primaryResult = results.find((r) => r.highlight) ?? results[0];
    const secondaryResults = results.filter((r) => r !== primaryResult);

    return (
      <div
        ref={ref}
        style={{ width: 540, height: 540, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
        className="relative flex flex-col bg-[#0f172a] overflow-hidden select-none"
      >
        {/* ── Yellow header bar ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FACC15]">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 22 }}>⚡</span>
            <span
              style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}
            >
              Sparky
            </span>
          </div>
          <span
            style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", opacity: 0.7 }}
          >
            @SparkyOnsite
          </span>
        </div>

        {/* ── Calculator title ── */}
        <div className="px-6 pt-5 pb-3">
          <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Calculator
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginTop: 2, lineHeight: 1.1 }}>
            {calculatorName}
          </h1>
          {passFailBadge && (
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "3px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                background: passFailBadge === "PASS" ? "#166534" : "#7f1d1d",
                color: passFailBadge === "PASS" ? "#bbf7d0" : "#fecaca",
                letterSpacing: "0.05em",
              }}
            >
              NEC {passFailBadge}
            </span>
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "#1e293b", marginLeft: 24, marginRight: 24 }} />

        {/* ── Body: inputs left, primary result right ── */}
        <div className="flex flex-1 px-6 pt-5 gap-6 overflow-hidden">
          {/* Left — inputs table */}
          <div className="flex flex-col gap-2" style={{ flex: "0 0 200px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Inputs
            </p>
            {inputs.map((inp, i) => (
              <div key={i} className="flex flex-col">
                <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>
                  {inp.label}
                </span>
                <span style={{ fontSize: 14, color: "#cbd5e1", fontWeight: 600, marginTop: 1 }}>
                  {inp.value}
                </span>
              </div>
            ))}
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, background: "#1e293b", flexShrink: 0 }} />

          {/* Right — primary result hero */}
          <div className="flex flex-col justify-center flex-1">
            <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Result
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 4 }}>
              {primaryResult?.label}
            </p>
            <p
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#FACC15",
                lineHeight: 1,
                letterSpacing: "-1px",
              }}
            >
              {primaryResult?.value}
            </p>

            {/* Secondary results */}
            {secondaryResults.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {secondaryResults.map((r, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span style={{ fontSize: 11, color: "#64748b" }}>{r.label}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: r.highlight ? "#FACC15" : "#94a3b8",
                      }}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderTop: "1px solid #1e293b", marginTop: 8 }}
        >
          <span style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: "0.05em" }}>
            sparkyonsite.com
          </span>
          <span style={{ fontSize: 10, color: "#334155" }}>
            ⚡ Built for electricians
          </span>
        </div>

        {/* ── Subtle corner accent ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: "radial-gradient(circle at 100% 0%, rgba(250,204,21,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
