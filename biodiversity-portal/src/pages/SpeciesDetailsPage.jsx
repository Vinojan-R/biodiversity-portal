import { useMemo, useState } from "react";
import SpeciesCard from "../components/species/SpeciesCard";
import { speciesData } from "../data/species";

function SpeciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredSpecies = useMemo(() => {
    return speciesData.filter((species) => {
      const value = searchTerm.toLowerCase();

      const matchesSearch =
        species.commonName.toLowerCase().includes(value) ||
        species.scientificName.toLowerCase().includes(value);

      const matchesCategory =
        category === "All" || species.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="font-bold tracking-widest text-emerald-700 uppercase">
          Species database
        </p>

        <h1 className="mt-3 text-4xl font-black text-emerald-950 md:text-5xl">
          Explore endemic wildlife
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Search endemic lizards, frogs, snakes and geckos found in Sri Lanka.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-[1fr_240px]">
        <input
          type="search"
          placeholder="Search common or scientific name..."
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="All">All categories</option>
          <option value="Lizard">Lizards</option>
          <option value="Frog">Frogs</option>
          <option value="Snake">Snakes</option>
          <option value="Gecko">Geckos</option>
        </select>
      </div>

      {filteredSpecies.length > 0 ? (
        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpecies.map((species) => (
            <SpeciesCard key={species.id} species={species} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl bg-slate-100 p-10 text-center text-slate-600">
          No matching species were found.
        </div>
      )}
    </section>
  );
}

export default SpeciesPage;