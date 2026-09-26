"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { PresetSelector } from "@/components/PresetSelector";
import { StateEditor } from "@/components/StateEditor";
import { QuestionsBuilder } from "@/components/QuestionsBuilder";
import { ResultsViewer } from "@/components/ResultsViewer";
import { PRESET_SCENARIOS } from "@/lib/presets";
import { PresetScenario, AnyQuestion, DecisionsResponse } from "@/lib/types";
import { Play, Sparkles, AlertCircle } from "lucide-react";

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState<PresetScenario>(PRESET_SCENARIOS[0]);
  const [model, setModel] = useState<string>("typesafe/jev-1.13");
  const [stateValue, setStateValue] = useState<string | Record<string, unknown>>(
    PRESET_SCENARIOS[0].state
  );
  const [questions, setQuestions] = useState<Record<string, AnyQuestion>>(
    PRESET_SCENARIOS[0].questions
  );

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DecisionsResponse | null>(null);
  const [error, setError] = useState<{ code?: number; message: string } | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPreset(preset);
    setModel(preset.model || "typesafe/jev-1.13");
    setStateValue(preset.state);
    setQuestions(preset.questions);
    setResponse(null);
    setError(null);
  };

  const currentPayload = {
    model,
    state: stateValue,
    questions,
  };

  const payloadJson = JSON.stringify(currentPayload, null, 2);

  const handleRunEvaluation = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/systemone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payloadJson,
      });

      const data = await res.json();

      if (!res.ok) {
        setError({
          code: res.status,
          message:
            data.error?.message ||
            data.message ||
            "呼叫 Jev API 發生錯誤，請確認 API Key 與請求設定。",
        });
        setResponse(null);
      } else {
        setResponse(data);
        setLatencyMs(data.latencyMs);
      }
    } catch (err: unknown) {
      setError({
        code: 500,
        message: err instanceof Error ? err.message : "連線逾時或網路錯誤",
      });
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, payloadJson]);

  // Global hotkey: Cmd + Enter or Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunEvaluation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunEvaluation]);

  return (
    <div className="container-root">
      {/* Top Navigation */}
      <Header model={model} setModel={setModel} />

      {/* Relatable Preset Scenarios Switcher */}
      <PresetSelector
        currentPresetId={selectedPreset.id}
        onSelect={handleSelectPreset}
      />

      {/* Two-column Interactive Dashboard */}
      <div className="dashboard-grid">
        {/* Left Column: State & Questions Configuration */}
        <div>
          {/* State Input */}
          <StateEditor stateValue={stateValue} onChange={setStateValue} />

          {/* Questions Definition */}
          <QuestionsBuilder questions={questions} onChange={setQuestions} />
        </div>

        {/* Right Column: Execution & Visual Decision Results */}
        <div>
          {/* Hero Action Run Button */}
          <div style={{ marginBottom: "1.25rem" }}>
            <button
              type="button"
              className="btn-run"
              onClick={handleRunEvaluation}
              disabled={isLoading}
              title="按快捷鍵 ⌘ + Enter 亦可快速執行"
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                    }}
                    className="animate-spin"
                  />
                  <span>Jev 正在推論評估中...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>🚀 執行 Jev 決策評估 (Run System One)</span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      background: "rgba(0, 0, 0, 0.25)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      opacity: 0.85,
                      fontWeight: 500,
                    }}
                  >
                    ⌘ + Enter
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Visual Results & Inspect Tabs */}
          <ResultsViewer
            response={response}
            error={error}
            isLoading={isLoading}
            latencyMs={latencyMs}
            questions={questions}
            payloadJson={payloadJson}
          />
        </div>
      </div>
    </div>
  );
}
