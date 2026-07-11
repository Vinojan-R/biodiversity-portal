import { useMemo, useState } from "react";
import SpeciesCard from "../components/species/SpeciesCard";
import { speciesData } from "../data/species";
import "../styles/species.css";

function SpeciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredSpecies = useMemo(() => {
    return speciesData.filter((species) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        species.commonName.toLowerCase().includes(searchValue) ||
        species.scientificName.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || species.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  return (
    <section className="page-section">
      <div className="page-header">
        <p>Species database</p>
        <h1>Explore endemic wildlife</h1>
        <span>
          Search for endemic lizards, frogs, snakes and geckos found in Sri
          Lanka.
        </span>
      </div>

      <div className="species-controls">
        <input
          type="search"
          placeholder="Search common or scientific name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
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
        <div className="species-grid">
          {filteredSpecies.map((species) => (
            <SpeciesCard key={species.id} species={species} />
          ))}
        </div>
      ) : (
        <p className="empty-message">No matching species were found.</p>
      )}
    </section>
  );
}

export default SpeciesPage;