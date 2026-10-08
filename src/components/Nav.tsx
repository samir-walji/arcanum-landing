import { CONTACT_EMAIL } from "../config";

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="Arcanum home">
          Arcanum
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#approach">How We Partner</a>
          <a href="#research">News and Research</a>
        </nav>
        <a className="btn btn-sm" href={`mailto:${CONTACT_EMAIL}`}>
          Contact us
        </a>
      </div>
    </header>
  );
}
