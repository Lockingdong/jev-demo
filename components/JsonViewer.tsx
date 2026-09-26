"use client";

import React, { useMemo } from "react";
import { Copy, Check } from "lucide-react";

interface JsonViewerProps {
  json: string;
  onCopy?: () => void;
  copied?: boolean;
  maxHeight?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  json,
  onCopy,
  copied = false,
  maxHeight = "540px",
}) => {
  const highlightedHtml = useMemo(() => {
    if (!json) return "";

    // Escape basic HTML entities
    const escaped = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Syntax highlight tokens
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|\/\/[^\n]*)/g,
      (match) => {
        // Comment
        if (match.startsWith("//")) {
          return `<span style="color: #64748b; font-style: italic;">${match}</span>`;
        }

        // String or Key
        if (/^"/.test(match)) {
          if (/:$/.test(match.trim())) {
            const keyPart = match.slice(0, match.lastIndexOf(":"));
            return `<span style="color: #38bdf8; font-weight: 600;">${keyPart}</span><span style="color: #94a3b8;">:</span>`;
          }
          return `<span style="color: #fde047;">${match}</span>`;
        }

        // Boolean
        if (/true|false/.test(match)) {
          return `<span style="color: #fb7185; font-weight: 700;">${match}</span>`;
        }

        // Null
        if (/null/.test(match)) {
          return `<span style="color: #c084fc; font-weight: 700;">${match}</span>`;
        }

        // Number
        return `<span style="color: #fb923c; font-weight: 600;">${match}</span>`;
      }
    );
  }, [json]);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #1e293b",
        background: "#0b0f19",
        boxShadow: "0 10px 30px -4px rgba(15, 23, 42, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Floating Copy Button */}
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            zIndex: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "rgba(30, 41, 59, 0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            color: "#e2e8f0",
            fontSize: "0.76rem",
            padding: "0.32rem 0.7rem",
            borderRadius: "7px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(51, 65, 85, 0.95)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(30, 41, 59, 0.75)";
            e.currentTarget.style.color = "#e2e8f0";
          }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span style={{ color: "#34d399", fontWeight: 600 }}>已複製</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>複製 JSON</span>
            </>
          )}
        </button>
      )}

      {/* Code Body */}
      <pre
        style={{
          margin: 0,
          padding: "1.25rem 1.4rem",
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize: "0.88rem",
          lineHeight: 1.68,
          color: "#cbd5e1",
          background: "transparent",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight,
          boxSizing: "border-box",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99, 102, 241, 0.5) rgba(15, 23, 42, 0.4)",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
};
