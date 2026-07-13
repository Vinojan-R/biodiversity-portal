import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function SpeciesCard({ species }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-emerald-950">
        <img
          src={species.image}
          alt={species.commonName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              "https://placehold.co/700x500/064e3b/ffffff?text=Species+Image";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2">
          {species.endemic && (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              Endemic
            </span>
          )}

          {!species.endemic && (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
              Native / Recorded
            </span>
          )}
        </div>

        <span className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white capitalize backdrop-blur">
          {species.category.replace("-", " ")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
          {species.category.replace("-", " ")}
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900">
          {species.commonName}
        </h2>

        <p className="mt-1 italic text-slate-500">
          {species.scientificName}
        </p>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {species.description}
        </p>

        <div className="mt-5 flex items-start gap-2 text-sm text-slate-600">
          <MapPin
            size={17}
            className="mt-0.5 shrink-0 text-emerald-700"
          />

          <span>{species.region}</span>
        </div>

        <div className="mt-auto pt-6">
          <Link
            to={`/species/${species.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            View details
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default SpeciesCard;