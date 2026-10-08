import { CONTACT_EMAIL } from "../../config";

export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title">Start with your hardest agent.</h2>
        <p className="lead">
          Tell us what your agent does and where frontier models fall short. We will scope an eval for it
          and a first model to beat.
        </p>
        <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}
