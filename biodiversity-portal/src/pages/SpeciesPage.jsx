import {
  Bird,
  Fish,
  Search,
  SlidersHorizontal,
  Squirrel,
  Turtle,
} from "lucide-react";
import { useMemo, useState } from "react";

import SpeciesCard from "../components/species/SpeciesCard";
import { speciesData } from "../data/species";
import { speciesCategories } from "../data/speciesCategories";

const categoryIcons = {
  mammals: Squirrel,
  birds: Bird,
  amphibians: Turtle,
  reptiles: Turtle,
  "sea-creatures": Fish,
};

function SpeciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [endemicFilter, setEndemicFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("common-name");

  const filteredSpecies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = speciesData.filter((species) => {
      const matchesSearch =
        species.commonName.toLowerCase().includes(normalizedSearch) ||
        species.scientificName.toLowerCase().includes(normalizedSearch) ||
        species.habitat.toLowerCase().includes(normalizedSearch) ||
        species.region.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        species.category === selectedCategory;

      const matchesEndemic =
        endemicFilter === "all" ||
        (endemicFilter === "endemic" && species.endemic) ||
        (endemicFilter === "native" && !species.endemic);

      return matchesSearch && matchesCategory && matchesEndemic;
    });

    return [...result].sort((first, second) => {
      if (sortOrder === "scientific-name") {
        return first.scientificName.localeCompare(
          second.scientificName,
        );
      }

      return first.commonName.localeCompare(second.commonName);
    });
  }, [
    searchTerm,
    selectedCategory,
    endemicFilter,
    sortOrder,
  ]);

  const activeCategoryInformation =
    selectedCategory === "all"
      ? null
      : speciesCategories.find(
          (category) => category.id === selectedCategory,
        );

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
    setEndemicFilter("all");
    setSortOrder("common-name");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold tracking-[0.25em] text-emerald-300 uppercase">
            Species database
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-6xl">
            Explore the wildlife of Sri Lanka
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-100">
            Search species by common name, scientific name, category,
            habitat or region. Learn about endemic wildlife and other
            species recorded in Sri Lanka.
          </p>

          <div className="relative mt-9 max-w-3xl">
            <Search
              className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"
              size={22}
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search common name, scientific name, habitat or region..."
              className="w-full rounded-2xl bg-white py-4 pr-5 pl-14 text-slate-900 outline-none ring-4 ring-white/10 placeholder:text-slate-400 focus:ring-emerald-300"
            />
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {speciesCategories.map((category) => {
            const Icon =
              categoryIcons[category.id] || SlidersHorizontal;

            const isSelected =
              selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    isSelected ? "all" : category.id,
                  )
                }
                className={`rounded-2xl border p-6 text-left transition ${
                  isSelected
                    ? "border-emerald-950 bg-emerald-950 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-900 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
                }`}
              >
                <Icon
                  size={34}
                  className={
                    isSelected
                      ? "text-emerald-300"
                      : "text-emerald-700"
                  }
                />

                <h2 className="mt-4 text-xl font-black">
                  {category.name}
                </h2>

                <p
                  className={`mt-1 text-3xl font-black ${
                    isSelected
                      ? "text-emerald-300"
                      : "text-emerald-800"
                  }`}
                >
                  {category.count}
                </p>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    isSelected
                      ? "text-emerald-100"
                      : "text-slate-500"
                  }`}
                >
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Category
              </span>

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All categories</option>

                {speciesCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Origin
              </span>

              <select
                value={endemicFilter}
                onChange={(event) =>
                  setEndemicFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700"
              >
                <option value="all">All species</option>
                <option value="endemic">
                  Endemic to Sri Lanka
                </option>
                <option value="native">
                  Native or recorded species
                </option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Sort by
              </span>

              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-700"
              >
                <option value="common-name">
                  Common name
                </option>

                <option value="scientific-name">
                  Scientific name
                </option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold tracking-widest text-emerald-700 uppercase">
              {activeCategoryInformation
                ? activeCategoryInformation.name
                : "All categories"}
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {filteredSpecies.length} species currently available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The larger category number represents your planned portal
              total. The value above represents records currently added
              to the dataset.
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:border-emerald-700 hover:text-emerald-800"
          >
            Clear filters
          </button>
        </div>

        {filteredSpecies.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpecies.map((species) => (
              <SpeciesCard
                key={species.id}
                species={species}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <Search
              size={45}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              No matching species found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another name, category, habitat or region.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-emerald-950 px-6 py-3 font-bold text-white"
            >
              Reset search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default SpeciesPage;