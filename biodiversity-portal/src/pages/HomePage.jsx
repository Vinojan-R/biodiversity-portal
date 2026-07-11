import {
  Binoculars,
  Camera,
  GraduationCap,
  MapPinned,
} from "lucide-react";
import { Link } from "react-router-dom";
import SpeciesCard from "../components/species/SpeciesCard";
import { speciesData } from "../data/species";

function HomePage() {
  const features = [
    {
      icon: Camera,
      title: "Species identification",
      description:
        "Upload an image and receive an AI-assisted lizard identification.",
    },
    {
      icon: Binoculars,
      title: "Species catalogue",
      description:
        "Explore information about Sri Lanka's endemic wildlife.",
    },
    {
      icon: MapPinned,
      title: "Habitat mapping",
      description:
        "View observation locations and species distribution information.",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description:
        "Learn about habitats, conservation status and ecological importance.",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700">
        <div className="mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-4xl">
            <p className="font-bold tracking-[0.25em] text-emerald-300 uppercase">
              Explore • Identify • Protect
            </p>

            <h1 className="mt-5 text-5xl leading-tight font-black text-white md:text-7xl">
              Discover Sri Lanka&apos;s endemic wildlife
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100">
              Learn about endemic species, submit observations and support
              biodiversity awareness through technology and citizen science.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/species"
                className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-emerald-950 transition hover:bg-emerald-300"
              >
                Explore species
              </Link>

              <Link
                to="/identify"
                className="rounded-xl border border-white px-6 py-3 font-bold text-white transition hover:bg-white hover:text-emerald-950"
              >
                Identify an animal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-bold tracking-widest text-emerald-700 uppercase">
            Portal features
          </p>

          <h2 className="mt-3 text-4xl font-black text-emerald-950">
            Technology supporting conservation
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm"
            >
              <Icon className="text-emerald-700" size={34} />

              <h3 className="mt-5 text-xl font-bold text-emerald-950">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-bold tracking-widest text-emerald-700 uppercase">
              Featured wildlife
            </p>

            <h2 className="mt-3 text-4xl font-black text-emerald-950">
              Meet some endemic species
            </h2>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {speciesData.slice(0, 3).map((species) => (
              <SpeciesCard key={species.id} species={species} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/species"
              className="inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
            >
              View all species
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;