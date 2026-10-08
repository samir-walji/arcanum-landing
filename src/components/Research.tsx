import { POSTS } from "../data/posts";

export default function Research() {
  return (
    <section className="section" id="research" aria-labelledby="research-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="research-title">News and Research</h2>
        </div>
        <ul className="posts">
          {POSTS.map((post) => (
            <li key={post.url}>
              <a className="post" href={post.url} target="_blank" rel="noreferrer">
                <p className="post-meta">
                  <span>{post.date}</span>
                  <span>{post.tag}</span>
                </p>
                <div className="post-body">
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
