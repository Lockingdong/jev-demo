"use client";

import React, { useState } from "react";
import { AnyQuestion, NoulQuestion, ChoiceQuestion, ScoreQuestion } from "@/lib/types";
import { HelpCircle, Plus, Trash2, Sliders, CheckCircle2, ListOrdered } from "lucide-react";

interface QuestionsBuilderProps {
  questions: Record<string, AnyQuestion>;
  onChange: (questions: Record<string, AnyQuestion>) => void;
}

export const QuestionsBuilder: React.FC<QuestionsBuilderProps> = ({ questions, onChange }) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const questionEntries = Object.entries(questions);

  const handleUpdateQuestion = (key: string, updated: AnyQuestion) => {
    onChange({
      ...questions,
      [key]: updated,
    });
  };

  const handleRenameKey = (oldKey: string, newKeyName: string) => {
    const trimmed = newKeyName.trim();
    if (!trimmed || trimmed === oldKey) return;
    const newQuestions: Record<string, AnyQuestion> = {};
    for (const [k, v] of Object.entries(questions)) {
      if (k === oldKey) {
        newQuestions[trimmed] = v;
      } else {
        newQuestions[k] = v;
      }
    }
    onChange(newQuestions);
  };

  const handleDeleteQuestion = (key: string) => {
    const newQuestions = { ...questions };
    delete newQuestions[key];
    onChange(newQuestions);
  };

  return (
    <div className="glass-card">
      <div className="card-header" style={{ marginBottom: "0.85rem", paddingBottom: "0.6rem" }}>
        <div className="card-title-group">
          <HelpCircle className="w-4 h-4 text-pink-400" />
          <h2>決策問題 (Questions)</h2>
          <span className="card-badge">{questionEntries.length} 題</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsCustomizing(!isCustomizing)}
            style={{ fontSize: "0.82rem", padding: "0.32rem 0.65rem" }}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isCustomizing ? "完成自訂" : "自訂題目"}</span>
          </button>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="questions-list">
        {questionEntries.length === 0 ? (
          <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-dim)", fontSize: "0.9rem" }}>
            尚未設定任何問題，請選擇上方範例情境。
          </div>
        ) : (
          questionEntries.map(([qKey, q]) => {
            // Read-only clean view
            if (!isCustomizing) {
              return (
                <div key={qKey} className="question-item-card" style={{ padding: "1rem 1.15rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#0284c7", fontSize: "0.92rem" }}>
                      {qKey}
                    </span>
                    <span className={`type-pill ${q.type}`}>{q.type}</span>
                  </div>

                  <div style={{ fontSize: "0.92rem", color: "#0f172a", lineHeight: 1.5, marginBottom: "0.6rem" }}>
                    {String(q.instructions)}
                  </div>

                  {/* Complete criteria preview for presentation */}
                  {q.type === "noul" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.86rem", marginTop: "0.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.55rem",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          padding: "0.5rem 0.8rem",
                          borderRadius: "8px",
                          lineHeight: 1.55,
                        }}
                      >
                        <span style={{ color: "#475569", fontWeight: 600, fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap" }}>
                          true:
                        </span>
                        <span style={{ color: "#334155" }}>
                          {(q as NoulQuestion).criteria.true}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.55rem",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          padding: "0.5rem 0.8rem",
                          borderRadius: "8px",
                          lineHeight: 1.55,
                        }}
                      >
                        <span style={{ color: "#475569", fontWeight: 600, fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap" }}>
                          false:
                        </span>
                        <span style={{ color: "#334155" }}>
                          {(q as NoulQuestion).criteria.false}
                        </span>
                      </div>
                    </div>
                  )}

                  {q.type === "choice" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.86rem", marginTop: "0.5rem" }}>
                      {Object.entries((q as ChoiceQuestion).criteria || {}).map(([opt, desc]) => (
                        <div
                          key={opt}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.55rem",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            padding: "0.5rem 0.8rem",
                            borderRadius: "8px",
                            lineHeight: 1.55,
                          }}
                        >
                          <span
                            style={{
                              color: "#475569",
                              fontWeight: 600,
                              fontFamily: "ui-monospace, monospace",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {opt}:
                          </span>
                          <span style={{ color: "#334155" }}>{desc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "score" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.86rem", marginTop: "0.5rem" }}>
                      {((q as ScoreQuestion).criteria || []).map((desc, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            padding: "0.5rem 0.8rem",
                            borderRadius: "8px",
                            lineHeight: 1.55,
                            fontSize: "0.88rem",
                            color: "#334155",
                          }}
                        >
                          {desc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Editable mode
            return (
              <div key={qKey} className="question-item-card">
                <div className="question-top-bar">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                    <input
                      type="text"
                      className="q-key-input"
                      key={qKey}
                      defaultValue={qKey}
                      onBlur={(e) => handleRenameKey(qKey, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      title="點擊修改鍵名 (按 Enter 或點空白處儲存)"
                    />
                    <span className={`type-pill ${q.type}`}>{q.type}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDeleteQuestion(qKey)}
                    title="刪除此問題"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Instructions */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    className="text-input"
                    value={q.instructions as string}
                    onChange={(e) => handleUpdateQuestion(qKey, { ...q, instructions: e.target.value })}
                    placeholder="問題具體判斷指示..."
                    style={{ fontSize: "0.9rem", background: "rgba(0,0,0,0.2)" }}
                  />
                </div>

                {/* Criteria By Type */}
                {q.type === "noul" && (
                  <NoulCriteriaEditor
                    question={q as NoulQuestion}
                    onChange={(updated) => handleUpdateQuestion(qKey, updated)}
                  />
                )}

                {q.type === "choice" && (
                  <ChoiceCriteriaEditor
                    question={q as ChoiceQuestion}
                    onChange={(updated) => handleUpdateQuestion(qKey, updated)}
                  />
                )}

                {q.type === "score" && (
                  <ScoreCriteriaEditor
                    question={q as ScoreQuestion}
                    onChange={(updated) => handleUpdateQuestion(qKey, updated)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Sub-editor: Noul (True / False)
const NoulCriteriaEditor: React.FC<{
  question: NoulQuestion;
  onChange: (updated: NoulQuestion) => void;
}> = ({ question, onChange }) => {
  return (
    <div className="criteria-section">
      <div className="criteria-title">
        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
          判定準則 (Criteria)
        </span>
      </div>
      <div className="criteria-grid">
        <div className="criteria-row">
          <span className="criteria-key" style={{ color: "#475569" }}>
            true:
          </span>
          <input
            type="text"
            className="text-input"
            style={{ fontSize: "0.9rem" }}
            value={question.criteria.true}
            onChange={(e) =>
              onChange({
                ...question,
                criteria: { ...question.criteria, true: e.target.value },
              })
            }
            placeholder="判定為 true 之條件準則..."
          />
        </div>
        <div className="criteria-row">
          <span className="criteria-key" style={{ color: "#475569" }}>
            false:
          </span>
          <input
            type="text"
            className="text-input"
            style={{ fontSize: "0.9rem" }}
            value={question.criteria.false}
            onChange={(e) =>
              onChange({
                ...question,
                criteria: { ...question.criteria, false: e.target.value },
              })
            }
            placeholder="判定為 false 之條件準則..."
          />
        </div>
      </div>
    </div>
  );
};

// Sub-editor: Choice
const ChoiceCriteriaEditor: React.FC<{
  question: ChoiceQuestion;
  onChange: (updated: ChoiceQuestion) => void;
}> = ({ question, onChange }) => {
  const options = Object.entries(question.criteria || {});

  const handleUpdateOption = (optKey: string, desc: string) => {
    onChange({
      ...question,
      criteria: {
        ...question.criteria,
        [optKey]: desc,
      },
    });
  };

  const handleRenameOptionKey = (oldKey: string, newKeyName: string) => {
    const trimmed = newKeyName.trim();
    if (!trimmed || trimmed === oldKey) return;
    const nextCriteria: Record<string, string> = {};
    for (const [k, v] of Object.entries(question.criteria || {})) {
      if (k === oldKey) {
        nextCriteria[trimmed] = v;
      } else {
        nextCriteria[k] = v;
      }
    }
    onChange({
      ...question,
      criteria: nextCriteria,
    });
  };

  const handleDeleteOption = (optKey: string) => {
    const nextCriteria = { ...question.criteria };
    delete nextCriteria[optKey];
    onChange({
      ...question,
      criteria: nextCriteria,
    });
  };

  const handleAddOption = () => {
    const newKey = `option_${options.length + 1}`;
    onChange({
      ...question,
      criteria: {
        ...question.criteria,
        [newKey]: "新選項之判定條件敘述",
      },
    });
  };

  return (
    <div className="criteria-section">
      <div className="criteria-title">
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          分類選項與準則 ({options.length} 個選項)
        </span>
        <button
          type="button"
          onClick={handleAddOption}
          className="btn-secondary"
          style={{ fontSize: "0.82rem", padding: "0.3rem 0.6rem" }}
        >
          <Plus className="w-3 h-3" />
          <span>加選項</span>
        </button>
      </div>

      <div className="criteria-grid">
        {options.map(([optKey, desc]) => (
          <div key={optKey} className="criteria-row">
            <input
              type="text"
              className="option-key-input"
              key={optKey}
              defaultValue={optKey}
              onBlur={(e) => handleRenameOptionKey(optKey, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="選項鍵名..."
              title="點擊修改選項鍵名 (按 Enter 或點空白處儲存)"
            />
            <input
              type="text"
              className="text-input"
              style={{ fontSize: "0.9rem", flex: 1 }}
              value={desc}
              onChange={(e) => handleUpdateOption(optKey, e.target.value)}
              placeholder="選項符合條件說明..."
            />
            {options.length > 2 && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleDeleteOption(optKey)}
                title="刪除此選項"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-editor: Score
const ScoreCriteriaEditor: React.FC<{
  question: ScoreQuestion;
  onChange: (updated: ScoreQuestion) => void;
}> = ({ question, onChange }) => {
  const steps = question.criteria || [];

  const handleUpdateStep = (index: number, val: string) => {
    const nextSteps = [...steps];
    nextSteps[index] = val;
    onChange({
      ...question,
      criteria: nextSteps,
    });
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) return;
    const nextSteps = steps.filter((_, i) => i !== index);
    onChange({
      ...question,
      criteria: nextSteps,
    });
  };

  const handleAddStep = () => {
    onChange({
      ...question,
      criteria: [...steps, `階梯 ${steps.length} 描述條件`],
    });
  };

  return (
    <div className="criteria-section">
      <div className="criteria-title">
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
          階梯量規定義 (0 ~ {steps.length - 1} 級)
        </span>
        <button
          type="button"
          onClick={handleAddStep}
          className="btn-secondary"
          style={{ fontSize: "0.82rem", padding: "0.3rem 0.6rem" }}
        >
          <Plus className="w-3 h-3" />
          <span>加階梯</span>
        </button>
      </div>

      <div className="criteria-grid">
        {steps.map((stepDesc, idx) => (
          <div key={idx} className="criteria-row">
            <input
              type="text"
              className="text-input"
              style={{ fontSize: "0.9rem" }}
              value={stepDesc}
              onChange={(e) => handleUpdateStep(idx, e.target.value)}
              placeholder={`階梯 ${idx} 代表意義（如：${idx} 分 ...）`}
            />
            {steps.length > 2 && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleDeleteStep(idx)}
                title="刪除此等級"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
