"use client";

import React from "react";
import { PresetScenario } from "@/lib/types";
import { PRESET_SCENARIOS } from "@/lib/presets";
import { Layers } from "lucide-react";

interface PresetSelectorProps {
  currentPresetId: string;
  onSelect: (preset: PresetScenario) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ currentPresetId, onSelect }) => {
  const getShortTitle = (preset: PresetScenario) => {
    if (preset.id === "noul-ramen-complaint") return "🍜 拉麵負評危機 (Noul)";
    if (preset.id === "choice-steakhouse-feedback") return "🥩 牛排客訴主因 (Choice)";
    if (preset.id === "score-hotpot-satisfaction") return "🍲 火鍋滿意度 (Score)";
    return preset.title;
  };

  return (
    <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.88rem",
          color: "var(--text-dim)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        <Layers className="w-4 h-4 text-indigo-400" />
        <span>示範案例:</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        {PRESET_SCENARIOS.map((preset) => {
          const isActive = preset.id === currentPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-pill ${isActive ? "active" : ""}`}
              onClick={() => onSelect(preset)}
            >
              <span>{getShortTitle(preset)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
