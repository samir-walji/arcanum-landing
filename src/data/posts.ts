/** News and research posts, newest first. Add new entries at the top. */
export interface Post {
  title: string;
  summary: string;
  date: string; // display form, e.g. "September 2026"
  tag: string;
  authors?: string;
  url: string;
}

export const POSTS: Post[] = [
  {
    title: "First-token KL divergence is not a reliable drift measure",
    summary:
      "A prompt's first-token KL barely tracks how far its response drifts, and the number itself moves 16× with the definition. An empirical study across five open models.",
    date: "September 2026",
    tag: "Evaluation",
    authors: "Daniel Rupawalla · Simon Jordan",
    url: "https://arxlabs.ai/research/first-token-kl",
  },
];
