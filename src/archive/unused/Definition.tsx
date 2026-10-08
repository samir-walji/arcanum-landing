/** A dictionary entry for the company name, set in a serif like a printed lexicon. */
export default function Definition() {
  return (
    <section className="section definition" aria-labelledby="definition-title">
      <div className="wrap">
        <div className="definition-head">
          <h2 className="definition-word" id="definition-title">
            arcanum<sup aria-hidden="true">1</sup>
          </h2>
          <p className="definition-meta">
            <span>/är-ˈkā-nəm/</span>
            <span>
              <i>pl.</i> arcana
            </span>
          </p>
        </div>
        <ol className="senses">
          <li>
            <em>I. n.</em> A secret; specialized knowledge known only to a few.
          </li>
          <li>
            <em>II. n.</em> An applied research lab that turns an enterprise's own work into specialized
            intelligence.
          </li>
        </ol>
        <p className="definition-etym">
          From Latin <i>arcānus</i>, hidden, secret; from <i>arca</i>, a chest.
        </p>
      </div>
    </section>
  );
}
