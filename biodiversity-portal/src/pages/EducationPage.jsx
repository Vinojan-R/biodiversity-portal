function EducationPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <p>Education and awareness</p>
        <h1>Learn about biodiversity</h1>
        <span>
          Educational articles about endemic wildlife, ecosystems, threats and
          conservation.
        </span>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h3>Endemic species</h3>
          <p>Understand what endemism means and why endemic animals matter.</p>
        </article>

        <article className="feature-card">
          <h3>Habitats</h3>
          <p>Explore rainforests, montane forests, wetlands and dry zones.</p>
        </article>

        <article className="feature-card">
          <h3>Conservation threats</h3>
          <p>Learn about habitat loss, climate change and invasive species.</p>
        </article>
      </div>
    </section>
  );
}

export default EducationPage;