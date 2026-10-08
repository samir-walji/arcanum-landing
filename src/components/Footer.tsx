import type { MouseEvent } from "react";

// Placeholder links: not wired up yet. Replace href and drop the onClick when they are.
const LINKS = [
  { heading: "Company", items: ["Careers", "Contact"] },
  { heading: "Connect", items: ["LinkedIn", "X (Twitter)"] },
];

const inert = (event: MouseEvent) => event.preventDefault();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="lexicon">
            <p className="lexicon-word" lang="la">
              arcanum<sup aria-hidden="true">1</sup>
            </p>
            <p className="lexicon-pron">
              /är-ˈkā-nəm/ &nbsp;<i>pl.</i> arcana
            </p>
            <ol className="lexicon-senses">
              <li>
                <em>I. n.</em> Hidden knowledge: specialized information known only to a few.
              </li>
              <li>
                <em>II. n.</em> In alchemy, a secret remedy; an elixir.
              </li>
            </ol>
            <p className="lexicon-note">1. From Latin arcānus, hidden, secret; from arca, a chest.</p>
          </div>

          <nav className="footer-cols" aria-label="Footer">
            {LINKS.map((col) => (
              <div className="footer-col" key={col.heading}>
                <h3>{col.heading}</h3>
                <ul>
                  {col.items.map((label) => (
                    <li key={label}>
                      <a href="#" onClick={inert}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Arcanum Labs, Inc.</span>
        </div>
      </div>
    </footer>
  );
}
