import { Link } from "react-router-dom";

function SpeciesCard({ species }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-56 items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-900">
        <span className="rounded-full border border-white/30 bg-black/20 px-4 py-2 text-sm font-semibold text-white">
          {species.category}
        </span>
      </div>

      <div className="p-6">
        <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
          {species.category}
        </p>

        <h3 className="mt-2 text-xl font-bold text-emerald-950">
          {species.commonName}
        </h3>

        <p className="mt-1 italic text-slate-500">
          {species.scientificName}
        </p>

        <div className="mt-5 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-800">Habitat:</span>{" "}
            {species.habitat}
          </p>

          <p>
            <span className="font-semibold text-slate-800">Status:</span>{" "}
            {species.conservationStatus}
          </p>
        </div>

        <Link
          to={`/species/${species.id}`}
          className="mt-6 inline-flex rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800"
        >
          View species
        </Link>
      </div>
    </article>
  );
}

export default SpeciesCard;