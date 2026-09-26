"use client";

import React, { useState } from "react";
import {
  DecisionsResponse,
  AnyAnswer,
  NoulAnswer,
  ChoiceAnswer,
  ScoreAnswer,
  AnyQuestion,
  NoulQuestion,
  ChoiceQuestion,
  ScoreQuestion,
} from "@/lib/types";
import {
  Sparkles,
  Clock,
  Coins,
  Cpu,
  Copy,
  Check,
  BarChart3,
  Code,
  Gauge,
  AlertTriangle,
} from "lucide-react";
import { JsonViewer } from "./JsonViewer";

interface ResultsViewerProps {
  response: DecisionsResponse | null;
  error: { code?: number; message: string } | null;
  isLoading: boolean;
  latencyMs?: number;
  questions: Record<string, AnyQuestion>;
  payloadJson: string;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({
  response,
  error,
  isLoading,
  latencyMs,
  questions,
  payloadJson,
}) => {
  const [activeTab, setActiveTab] = useState<"visual" | "responseJson" | "requestJson">("visual");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const costFormatted =
    response?.usage?.cost !== undefined
      ? `$${response.usage.cost.toFixed(6)}`
      : "$0.000020";

  return (
    <div className="results-container">
      {/* Error alert banner if any */}
      {error && (
        <div className="alert-banner error">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.2rem" }}>
              請求發生錯誤 ({error.code || 500})
            </div>
            <div style={{ fontSize: "0.82rem", lineHeight: 1.45 }}>{error.message}</div>
          </div>
        </div>
      )}

      {/* Lightweight Toolbar & Status Badges */}
      {response && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.6rem",
            padding: "0.6rem 0.95rem",
            background: "#ffffff",
            border: "1px solid rgba(226, 232, 240, 0.95)",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.85rem",
                color: "#0284c7",
                background: "rgba(2, 132, 199, 0.1)",
                border: "1px solid rgba(2, 132, 199, 0.25)",
                padding: "0.3rem 0.65rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              {latencyMs ? `${latencyMs} ms` : "即時"}
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.85rem",
                color: "#b45309",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.28)",
                padding: "0.3rem 0.65rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              {costFormatted}
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.84rem",
                color: "#334155",
                background: "rgba(241, 245, 249, 0.9)",
                border: "1px solid rgba(203, 213, 225, 0.8)",
                padding: "0.3rem 0.65rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              {response.usage?.input_tokens ?? 0} in / {response.usage?.output_tokens ?? 0} out tokens
            </span>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${activeTab === "visual" ? "active" : ""}`}
          onClick={() => setActiveTab("visual")}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>視覺化報告</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "requestJson" ? "active" : ""}`}
          onClick={() => setActiveTab("requestJson")}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Raw Request</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "responseJson" ? "active" : ""}`}
          onClick={() => setActiveTab("responseJson")}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Raw Response</span>
        </button>
      </div>

      {/* Tab 1: Visual Decision Report */}
      {activeTab === "visual" && (
        <div>
          {isLoading ? (
            <div
              className="glass-card"
              style={{
                textAlign: "center",
                padding: "2.8rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.85rem",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "3px solid rgba(99, 102, 241, 0.2)",
                  borderTopColor: "#6366f1",
                }}
                className="animate-spin"
              />
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                Jev 決策推論評估中...
              </div>
            </div>
          ) : !response ? (
            <div
              className="glass-card"
              style={{
                textAlign: "center",
                padding: "3rem 1.5rem",
                color: "var(--text-dim)",
              }}
            >
              <Gauge className="w-10 h-10 mx-auto mb-2.5 opacity-25 text-indigo-400" />
              <div style={{ fontSize: "1.02rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                尚未執行評估
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
                點擊上方「執行評估」檢視分析報告
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {Object.entries(response.answers || {}).map(([key, answer]) => {
                const questionDef = questions[key];
                return (
                  <AnswerVisualCard
                    key={key}
                    answerKey={key}
                    answer={answer}
                    questionDef={questionDef}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Raw Request JSON */}
      {activeTab === "requestJson" && (
        <JsonViewer
          json={payloadJson}
          onCopy={() => handleCopy(payloadJson, "req")}
          copied={copiedKey === "req"}
        />
      )}

      {/* Tab 3: Raw Response JSON */}
      {activeTab === "responseJson" && (
        <JsonViewer
          json={
            response
              ? JSON.stringify(response, null, 2)
              : "// 尚未執行評估，請點擊上方「執行評估」送出請求以取得 Response JSON"
          }
          onCopy={
            response
              ? () => handleCopy(JSON.stringify(response, null, 2), "res")
              : undefined
          }
          copied={copiedKey === "res"}
        />
      )}
    </div>
  );
};

// Answer Card Switcher
const AnswerVisualCard: React.FC<{
  answerKey: string;
  answer: AnyAnswer;
  questionDef?: AnyQuestion;
}> = ({ answerKey, answer, questionDef }) => {
  return (
    <div className={`answer-card ${answer.type}`}>
      <div className="answer-header">
        <span className="answer-key">{answerKey}</span>
        <span className={`type-pill ${answer.type}`}>{answer.type}</span>
      </div>

      {questionDef?.instructions && (
        <div className="answer-instruction">{String(questionDef.instructions)}</div>
      )}

      {answer.type === "noul" && (
        <NoulVisual answer={answer as NoulAnswer} questionDef={questionDef as NoulQuestion | undefined} />
      )}

      {answer.type === "choice" && (
        <ChoiceVisual answer={answer as ChoiceAnswer} questionDef={questionDef as ChoiceQuestion | undefined} />
      )}

      {answer.type === "score" && (
        <ScoreVisual answer={answer as ScoreAnswer} questionDef={questionDef as ScoreQuestion | undefined} />
      )}
    </div>
  );
};

// 1. Noul Visualizer (Streamlined)
const NoulVisual: React.FC<{
  answer: NoulAnswer;
  questionDef?: NoulQuestion;
}> = ({ answer }) => {
  const prob = typeof answer.noul === "number" ? answer.noul : 0;
  const percentage = Math.round(prob * 100);
  const isHighMatch = prob >= 0.5;

  return (
    <div className="noul-visual-box">
      {/* Decision Summary */}
      <div className="noul-header-row">
        <div className="noul-prob-display">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.28rem 0.75rem",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "0.03em",
              background: isHighMatch ? "rgba(16, 185, 129, 0.12)" : "rgba(100, 116, 139, 0.12)",
              color: isHighMatch ? "#059669" : "#64748b",
              border: isHighMatch ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(100, 116, 139, 0.25)",
            }}
          >
            {isHighMatch ? "TRUE" : "FALSE"}
          </span>
          <div className={`noul-prob-number ${isHighMatch ? "high" : "low"}`}>
            {percentage}%
          </div>
        </div>
      </div>

      {/* Streamlined False <---> True Progress Bar */}
      <div className="noul-gauge-container">
        <div className="noul-gauge-track">
          <div className="noul-gauge-fill" style={{ width: `${percentage}%` }} />
        </div>
        <div className="noul-gauge-ticks">
          <span style={{ color: !isHighMatch ? "#64748b" : "var(--text-dim)", fontWeight: !isHighMatch ? 700 : 500 }}>
            False
          </span>
          <span style={{ color: isHighMatch ? "#059669" : "var(--text-dim)", fontWeight: isHighMatch ? 700 : 500 }}>
            True
          </span>
        </div>
      </div>
    </div>
  );
};

// 2. Choice Visualizer (Streamlined)
const ChoiceVisual: React.FC<{
  answer: ChoiceAnswer;
  questionDef?: ChoiceQuestion;
}> = ({ answer }) => {
  const winner = answer.choice;
  const probabilities = answer.probabilities || {};
  const probEntries = Object.entries(probabilities);

  return (
    <div>
      {probEntries.length > 0 && (
        <div className="choice-bars-group">
          {probEntries.map(([choiceKey, p]) => {
            const isWinner = choiceKey === winner;
            const pPercent = Math.round(p * 100);

            return (
              <div key={choiceKey} className="choice-bar-item">
                <div className="choice-bar-meta">
                  <span
                    style={{
                      fontWeight: isWinner ? 700 : 500,
                      color: isWinner ? "#2563eb" : "var(--text-muted)",
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                    }}
                  >
                    {choiceKey}
                  </span>
                  <span style={{ fontWeight: 700, color: isWinner ? "#1d4ed8" : "var(--text-dim)", fontSize: "0.92rem" }}>
                    {pPercent}%
                  </span>
                </div>

                <div className="choice-bar-fill">
                  <div
                    className="choice-bar-inner"
                    style={{
                      width: `${pPercent}%`,
                      background: isWinner
                        ? "linear-gradient(90deg, #3b82f6, #06b6d4)"
                        : "rgba(226, 232, 240, 0.8)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 3. Score Visualizer (Streamlined)
const ScoreVisual: React.FC<{
  answer: ScoreAnswer;
  questionDef?: ScoreQuestion;
}> = ({ answer, questionDef }) => {
  const scoreVal = typeof answer.score === "number" ? answer.score : 0;
  const legend = answer.legend || {};
  const criteriaList = questionDef?.criteria || [];
  const maxScore = criteriaList.length > 0 ? criteriaList.length - 1 : Object.keys(legend).length - 1;
  const confidence = answer.confidence !== undefined ? Math.round(answer.confidence * 100) : null;
  const normalizedMax = maxScore > 0 ? maxScore : 1;
  const progressPercent = Math.min(100, Math.max(0, (scoreVal / normalizedMax) * 100));

  return (
    <div className="score-visual-box">
      {/* Top Score Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="score-display-row">
          <div className="score-big-number">{scoreVal.toFixed(2)}</div>
          <span style={{ fontSize: "1.1rem", color: "var(--text-dim)", fontWeight: 600 }}>
            / {maxScore > 0 ? maxScore : "滿分"}
          </span>
        </div>

        {confidence !== null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>信心指數</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#d97706" }}>
              {confidence}%
            </div>
          </div>
        )}
      </div>

      {/* Continuous Score Scale Bar */}
      <div className="score-scale-container">
        <div className="score-scale-track">
          <div className="score-scale-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="score-scale-ticks">
          {Array.from({ length: maxScore + 1 }).map((_, i) => (
            <span
              key={i}
              style={{
                color: Math.round(scoreVal) === i ? "#d97706" : "var(--text-dim)",
                fontWeight: Math.round(scoreVal) === i ? 700 : 500,
              }}
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
