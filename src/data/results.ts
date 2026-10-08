export interface ComparisonRow {
  name: string;
  note?: string;
  us: number;
  frontier: number;
}

export interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
}

// Evals built for the voice agent. Same rendered audio, same deterministic grader,
// same tool definitions for both models. Scores are percentages.
export const comparison: ComparisonGroup[] = [
  {
    title: "Tool use",
    rows: [
      { name: "Correct tool and call order", us: 98.9, frontier: 86.2 },
      { name: "General tool use", note: "199 tasks, 24 tools", us: 73.4, frontier: 63.3 },
    ],
  },
  {
    title: "Instruction following",
    rows: [
      { name: "Entity resolution", us: 78.1, frontier: 56.2 },
      {
        name: "Surfaces every option when ambiguous",
        note: "Instead of guessing one",
        us: 72.6,
        frontier: 46.3,
      },
      { name: "User intent preserved", us: 94.4, frontier: 83.3 },
    ],
  },
  {
    title: "Speech and names",
    rows: [
      { name: "Noisy and degraded audio", note: "300 scenarios", us: 78.3, frontier: 24.0 },
      {
        name: "Hard name cases",
        note: "Duplicate names, mishearings, missing contacts",
        us: 77.3,
        frontier: 22.7,
      },
      { name: "Name resolution from speech", note: "98 tasks", us: 58.2, frontier: 42.9 },
    ],
  },
];

export interface BenchmarkEntry {
  name: string;
  score: number;
  short: string;
  ours?: boolean;
}

// Audio MultiChallenge, Scale AI's benchmark for frontier voice models in
// multi-turn spoken conversation.
export const benchmark: BenchmarkEntry[] = [
  { name: "Gemini 3.8 Flash (high)", short: "Gemini 3.8", score: 60.4 },
  { name: "Arcane-Audio, about 30B", short: "Arcane-Audio · ~30B", score: 60.14, ours: true },
  { name: "Inkling (Thinking), 975B", short: "Inkling 975B", score: 56.64 },
  { name: "Inkling-small, 276B", short: "Inkling S 276B", score: 54.87 },
  { name: "Gemini 3 Pro Preview (Thinking)", short: "Gemini 3 Pro", score: 54.65 },
  { name: "GPT-Realtime-2 (xHigh)", short: "GPT RT 2", score: 48.45 },
];

export const BENCHMARK_MAX = 80;
