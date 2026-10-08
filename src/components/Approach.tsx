// How an engagement works: the two paragraphs carry the story, and the parts beside each one
// name what gets built at that stage (worded after the one-pager's case study).
const steps = [
  {
    label: "Benchmark",
    text: [
      "Our forward deployed researchers and engineers work alongside your team, using our evals and model training infrastructure to build a sophisticated benchmark for your agent's use case.",
    ],
    parts: [
      {
        title: "Evaluation Suite",
        body: "Realistic scenarios that simulate your agent's production environment with high fidelity.",
      },
    ],
  },
  {
    label: "Model system",
    text: [
      "Then we implement the best model system for it: trained models, harnesses, and routing, improved over time by continual learning loops.",
      "You own the trained model weights and can run them in your own infrastructure, or we can host inference for you.",
    ],
    parts: [
      {
        title: "Proprietary Trained LLM",
        body: "Outperform frontier models on your use case, at lower latency and cost, using our training and agent verification environments.",
      },
      {
        title: "Routing",
        body: "Harder or low-confidence requests can be escalated to a frontier model. The trained model handles the rest.",
      },
      {
        title: "Continual Learning Loop",
        body: "Failures and user corrections from production become new eval cases and training data.",
      },
    ],
  },
];

export default function Approach() {
  return (
    <section className="section" id="approach" aria-labelledby="approach-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="approach-title">Evals and model systems for complex enterprise agents</h2>
          <p>
            We benchmark frontier models on your use case, then build a system that beats them, with lower
            latency and inference cost.
          </p>
        </div>
        <ol className="flow">
          {steps.map((step, i) => (
            <li className="flow-row" key={step.label}>
              <p className="flow-step">
                <span className="flow-num">{String(i + 1).padStart(2, "0")}</span>
                {step.label}
              </p>
              <div className="flow-text">
                {step.text.map((sentence) => (
                  <p key={sentence}>{sentence}</p>
                ))}
              </div>
              <ul className="flow-parts">
                {step.parts.map((part) => (
                  <li className="part" key={part.title}>
                    <h3>{part.title}</h3>
                    <p>{part.body}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
