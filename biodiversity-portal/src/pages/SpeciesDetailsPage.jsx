import {
  ArrowLeft,
  Leaf,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { speciesData } from "../data/species";

function SpeciesDetailsPage() {
  const { id } = useParams();

  const species = speciesData.find(
    (animal) => animal.id === id,
  );

  if (!species) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900">
            Species not found
          </h1>

          <Link
            to="/species"
            className="mt-6 inline-flex rounded-xl bg-emerald-950 px-6 py-3 font-bold text-white"
          >
            Return to species
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          to="/species"
          className="inline-flex items-center gap-2 font-bold text-emerald-800"
        >
          <ArrowLeft size={18} />
          Back to species
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          <img
            src={species.image}
            alt={species.commonName}
            className="h-full min-h-[430px] w-full object-cover"
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/900x700/064e3b/ffffff?text=Species+Image";
            }}
          />

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800 capitalize">
                {species.category.replace("-", " ")}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  species.endemic
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {species.endemic
                  ? "Endemic to Sri Lanka"
                  : "Native or recorded in Sri Lanka"}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
              {species.commonName}
            </h1>

            <p className="mt-2 text-xl italic text-slate-500">
              {species.scientificName}
            </p>

            <p className="mt-7 text-lg leading-8 text-slate-600">
              {species.description}
            </p>

            <div className="mt-9 space-y-5">
              <div className="flex gap-4">
                <Leaf className="shrink-0 text-emerald-700" />

                <div>
                  <h2 className="font-black text-slate-900">
                    Habitat
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {species.habitat}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="shrink-0 text-emerald-700" />

                <div>
                  <h2 className="font-black text-slate-900">
                    Distribution
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {species.region}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="shrink-0 text-emerald-700" />

                <div>
                  <h2 className="font-black text-slate-900">
                    Conservation status
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {species.conservationStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-900">
                Species identification and conservation information
                should be verified against the latest National Red List
                or by a qualified wildlife specialist.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SpeciesDetailsPage;