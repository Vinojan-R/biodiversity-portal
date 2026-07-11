import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="page-section">
      <h1>404 — Page not found</h1>
      <Link to="/">Return home</Link>
    </section>
  );
}

export default NotFoundPage;