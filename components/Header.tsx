"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Key, ExternalLink, Zap, RefreshCw } from "lucide-react";

interface HeaderProps {
  model: string;
  setModel: (m: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ model, setModel }) => {
  const [keyStatus, setKeyStatus] = useState<{ hasKey: boolean; keyPrefix: string | null } | null>(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/systemone");
      const data = await res.json();
      setKeyStatus(data);
    } catch {
      setKeyStatus({ hasKey: false, keyPrefix: null });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <header className="navbar-top">
      <div className="nav-brand">
        <div className="nav-logo-icon">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="nav-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1>Jev System One Playground</h1>
            <span
              style={{
                fontSize: "0.78rem",
                padding: "0.15rem 0.5rem",
                background: "rgba(79, 70, 229, 0.08)",
                color: "#4f46e5",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              OpenRouter
            </span>
          </div>
          <p>即時結構化決策評估互動展示</p>
        </div>
      </div>

      <div className="nav-controls">
        {/* Model Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <select
            className="select-input"
            style={{ width: "auto", minWidth: "180px", fontSize: "0.88rem", padding: "0.4rem 0.75rem" }}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="typesafe/jev-1.13">typesafe/jev-1.13</option>
            <option value="jev-1.13">jev-1.13</option>
            <option value="typesafe/jev-latest">typesafe/jev-latest</option>
          </select>
        </div>

        {/* API Key Status Pill */}
        <div
          className={`status-pill ${keyStatus?.hasKey ? "ready" : "warning"}`}
          title={
            keyStatus?.hasKey
              ? `API Key 已由 .env.local 載入 (${keyStatus.keyPrefix})`
              : "請在專案根目錄 .env.local 設定 OPENROUTER_API_KEY"
          }
          style={{ fontSize: "0.82rem", padding: "0.35rem 0.75rem", cursor: "default" }}
        >
          <span className="status-dot" />
          <span>
            {checking
              ? "連線中..."
              : keyStatus?.hasKey
              ? "API 已就緒"
              : "未設定 Key"}
          </span>
        </div>

        {/* TypeSafe Official Doc Link */}
        <a
          href="https://typesafe.ai"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: "none", fontSize: "0.82rem", padding: "0.38rem 0.7rem" }}
          title="TypeSafe 官方網站與文件"
        >
          <span>TypeSafe 官網</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        {/* OpenRouter Doc Link */}
        <a
          href="https://openrouter.ai/docs/api/api-reference/systemone/submit-a-system-one-request"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: "none", fontSize: "0.82rem", padding: "0.38rem 0.7rem" }}
          title="OpenRouter System One API 文件"
        >
          <span>OpenRouter 文件</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>
    </header>
  );
};
