/**
 * Where the team comes from, as a slowly scrolling strip.
 *
 * Entries with a `logo` show the image (dark-on-transparent PNGs, whitened in CSS); entries
 * without one show their name as text until a logo file is added to public/logos/.
 */
// Works at the site root and under a subpath (GitHub Pages project sites).
const BASE = import.meta.env.BASE_URL;

type Org = { name: string; logo?: { src: string; width: number; height: number }; mark?: string };

const ORGS: Org[] = [
  { name: "Palantir", logo: { src: `${BASE}logos/palantir.png`, width: 117, height: 28 } },
  { name: "Mercor", logo: { src: `${BASE}logos/mercor.png`, width: 147, height: 28 } },
  { name: "Scale AI", logo: { src: `${BASE}logos/scale.png`, width: 148, height: 28 } },
  { name: "Meta Superintelligence Labs", mark: `${BASE}logos/meta.png` },
  { name: "Glean", logo: { src: `${BASE}logos/glean.png`, width: 70, height: 28 } },
];

function OrgItem({ org, decorative }: { org: Org; decorative: boolean }) {
  const { name, logo, mark } = org;
  return (
    <li className="logo-item">
      {logo ? (
        <img
          src={logo.src}
          alt={decorative ? "" : name}
          width={logo.width}
          height={logo.height}
          loading="eager"
          decoding="async"
        />
      ) : mark ? (
        <span className="logo-combo">
          <img
            className="logo-mark"
            src={mark}
            alt=""
            width={42}
            height={28}
            loading="eager"
            decoding="async"
          />
          <span>{name}</span>
        </span>
      ) : (
        <span>{name}</span>
      )}
    </li>
  );
}

export default function TeamLogos() {
  // The list is rendered several times so the strip can loop seamlessly; copies after the
  // first are hidden from assistive tech.
  const copies = 4;
  return (
    <section className="logos" aria-labelledby="logos-title">
      <div className="wrap">
        <h2 className="logos-title" id="logos-title">
          Researchers and engineers from
        </h2>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: copies }, (_, i) => (
            <ul className="logo-list" key={i} aria-hidden={i > 0 ? true : undefined}>
              {ORGS.map((org) => (
                <OrgItem key={org.name} org={org} decorative={i > 0} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
