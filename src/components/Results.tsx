import type { CSSProperties } from "react";
import { BENCHMARK_MAX, benchmark, comparison } from "../data/results";

type BarStyle = CSSProperties & { "--v": number };
type ColStyle = CSSProperties & { "--h": number };

// Gridlines every 10%, top to bottom.
const ticks = Array.from({ length: BENCHMARK_MAX / 10 + 1 }, (_, i) => BENCHMARK_MAX - i * 10);

function Bar({ value, kind, digits = 1 }: { value: number; kind: "us" | "them"; digits?: number }) {
  const style: BarStyle = { "--v": value };
  return (
    <div className={`bar ${kind}`} style={style}>
      <i />
      <b>{value.toFixed(digits)}%</b>
    </div>
  );
}

export default function Results() {
  return (
    <section className="section" id="results" data-theme="light" aria-labelledby="results-title">
      <div className="wrap">
        <div className="case-top">
        <div className="sec-head">
          <span className="eyebrow">
            <b>Case study</b>
            <span>Fortune 200 company</span>
          </span>
          <h2 id="results-title">A 30B model, <span className="hl">specialized for one agent,</span> beats the “frontier.”</h2>
          <p>
            We built the evaluation suite and model system behind a customer-facing enterprise agent used in a product with <b className="hl">50 million daily active users</b>. The agent takes
            spoken requests and completes multi-step work across workplace tools. It outperforms
            OpenAI's on every eval we defined.
          </p>
        </div>

        <div className="stats">
          <div className="stat">
            <b>3x</b>
            <span>higher scores on the hardest cases</span>
          </div>
          <div className="stat">
            <b>8x</b>
            <span>lower time to first audible token</span>
          </div>
          <div className="stat">
            <b>25x</b>
            <span>lower inference cost</span>
          </div>
        </div>
        </div>

        <div className="chart">
          <div className="chart-head">
            <h3>Arcane-Audio against OpenAI GPT-Audio-1.5</h3>
            <p>Evals tailored to this customer's use case</p>
          </div>
          <div className="legend">
            <span>
              <i className="k-us" />
              Arcane-Audio, about 30B parameters
            </span>
            <span>
              <i className="k-them" />
              OpenAI GPT-Audio-1.5, frontier model
            </span>
          </div>

          {comparison.map((group) => (
            <div className="grp" key={group.title}>
              <h4>{group.title}</h4>
              {group.rows.map((row) => (
                <div className="row" key={row.name}>
                  <div className="name">
                    {row.name}
                    {row.note && <small>{row.note}</small>}
                  </div>
                  <div className="bars">
                    <Bar value={row.us} kind="us" />
                    <Bar value={row.frontier} kind="them" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="chart scale-bm">
          <div className="chart-head">
            <h3>Competitive with frontier models on a public benchmark</h3>
            <p>Audio MultiChallenge, Scale AI's benchmark for frontier voice models in multi-turn spoken conversation.</p>
            <p className="chart-note">
              <b>At about 30B parameters</b>, Arcane-Audio is roughly 10 to 30x smaller than the models it's
              matching. Smaller models are faster and cheaper to run.
            </p>
          </div>
          <div className="vchart">
            <div className="vax" aria-hidden="true">
              {ticks.map((t) => (
                <span key={t}>{t}%</span>
              ))}
            </div>
            <div className="vgrid" aria-hidden="true" />
            <div className="vcols">
              {benchmark.map((entry) => {
                const style: ColStyle = { "--h": (entry.score / BENCHMARK_MAX) * 100 };
                return (
                  <div className={`vcol${entry.ours ? " us" : ""}`} key={entry.name}>
                    <div className="vplot" style={style}>
                      <span className="vscore">{entry.score.toFixed(2)}%</span>
                      <span className="vbar" />
                    </div>
                    <div className="vlabel">
                      <span className="full">{entry.name}</span>
                      <span className="short">{entry.short}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
