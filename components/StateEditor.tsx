"use client";

import React, { useState } from "react";
import { FileText, Code2, Check, AlignLeft } from "lucide-react";

interface StateEditorProps {
  stateValue: string | Record<string, unknown>;
  onChange: (newState: string | Record<string, unknown>) => void;
}

export const StateEditor: React.FC<StateEditorProps> = ({ stateValue, onChange }) => {
  const isObject = typeof stateValue === "object" && stateValue !== null;
  const initialText = isObject ? JSON.stringify(stateValue, null, 2) : String(stateValue);

  const [rawText, setRawText] = useState(initialText);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [formatSuccess, setFormatSuccess] = useState(false);

  // Sync if outer preset changes
  React.useEffect(() => {
    setRawText(typeof stateValue === "object" ? JSON.stringify(stateValue, null, 2) : String(stateValue));
    setJsonError(null);
  }, [stateValue]);

  const handleTextChange = (val: string) => {
    setRawText(val);
    // Try parsing as JSON
    const trimmed = val.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const parsed = JSON.parse(trimmed);
        setJsonError(null);
        onChange(parsed);
      } catch (err: unknown) {
        setJsonError((err as Error).message);
        onChange(val);
      }
    } else {
      setJsonError(null);
      onChange(val);
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(rawText);
      const formatted = JSON.stringify(parsed, null, 2);
      setRawText(formatted);
      setJsonError(null);
      onChange(parsed);
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 2000);
    } catch {
      // not valid JSON, leave as text
    }
  };

  return (
    <div className="glass-card">
      <div className="card-header" style={{ marginBottom: "0.85rem", paddingBottom: "0.6rem" }}>
        <div className="card-title-group">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h2>情境狀態 (State)</h2>
        </div>

        {isObject && (
          <button
            type="button"
            className="btn-secondary"
            onClick={formatJSON}
            title="美化 JSON 格式"
            style={{ fontSize: "0.8rem", padding: "0.3rem 0.65rem" }}
          >
            {formatSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>已格式化</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>排版 JSON</span>
              </>
            )}
          </button>
        )}
      </div>

      <div>
        <textarea
          className="textarea-input"
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="請輸入欲評估的情境狀態、對話紀錄或 JSON 文本 (State)..."
          rows={6}
          spellCheck={false}
        />

        {jsonError && (
          <div style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#f87171" }}>
            ⚠️ JSON 語法未閉合（目前以純文字傳送）
          </div>
        )}
      </div>
    </div>
  );
};
