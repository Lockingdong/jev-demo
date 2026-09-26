export type QuestionType = "noul" | "choice" | "score";

export interface NoulQuestion {
  type: "noul";
  instructions: string;
  criteria: {
    true: string;
    false: string;
  };
}

export interface ChoiceQuestion {
  type: "choice";
  instructions: string;
  criteria: Record<string, string>;
}

export interface ScoreQuestion {
  type: "score";
  instructions: string;
  criteria: string[];
}

export type AnyQuestion = NoulQuestion | ChoiceQuestion | ScoreQuestion;

export interface DecisionsRequest {
  model: string;
  state: string | Record<string, unknown> | unknown[];
  questions: Record<string, AnyQuestion>;
  session_id?: string;
}

export interface NoulAnswer {
  type: "noul";
  noul: number;
}

export interface ChoiceAnswer {
  type: "choice";
  choice: string;
  confidence?: number;
  probabilities?: Record<string, number>;
}

export interface ScoreAnswer {
  type: "score";
  score: number;
  confidence?: number;
  legend?: Record<string, string>;
  probabilities?: Record<string, number>;
}

export type AnyAnswer = NoulAnswer | ChoiceAnswer | ScoreAnswer;

export interface DecisionsResponse {
  id?: string;
  model?: string;
  provider?: string;
  answers: Record<string, AnyAnswer>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cost?: number;
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  model: string;
  state: string | Record<string, unknown>;
  questions: Record<string, AnyQuestion>;
}
