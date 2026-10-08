import { useEffect, useState } from "react";
import { CONTACT_EMAIL } from "../config";

export default function Nav() {
  // The hero headline already says "Arcanum", so the nav brand only appears once it has
  // scrolled up under the bar.
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    const title = document.getElementById("hero-title");
    if (!title) {
      setShowBrand(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowBrand(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className={`brand${showBrand ? " is-visible" : ""}`} href="#top" aria-label="Arcanum home" tabIndex={showBrand ? 0 : -1}>
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
