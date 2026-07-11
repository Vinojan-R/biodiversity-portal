function Footer() {
  return (
    <footer className="bg-emerald-950 px-6 py-10 text-emerald-100">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-white">BiodiversityLK</h2>

          <p className="mt-3 leading-7 text-emerald-200">
            Supporting education, identification and conservation of Sri
            Lanka&apos;s endemic wildlife.
          </p>
        </div>

        <p className="text-sm text-emerald-300">
          © 2026 Group Artemis — Rajarata University of Sri Lanka
        </p>
      </div>
    </footer>
  );
}

export default Footer;