import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

import heroBird from "../assets/images/home/hero-bird.png";
import sriLankaMap from "../assets/images/home/Srilanka-map.png";

import amphibianImage from "../assets/images/home/amphibian.png";
import mammalImage from "../assets/images/home/mammal.png";
import reptileImage from "../assets/images/home/reptile.png";
import birdImage from "../assets/images/home/bird.png";
import seaCreatureImage from "../assets/images/home/sea-creature.png";

import newsBackground from "../assets/images/home/news-background.png";
import forestFireImage from "../assets/images/home/forest-fire.png";
import huntingImage from "../assets/images/home/illegal-hunting.png";
import urbanizationImage from "../assets/images/home/urbanization.png";

import heatMapImage from "../assets/images/home/heat-map.png";
import leopardDayImage from "../assets/images/home/leopard-day.png";

const animalCategories = [
  {
    id: 1,
    name: "Amphibians",
    count: "50 species",
    image: amphibianImage,
    position: "lg:col-start-1 lg:row-start-1",
  },
  {
    id: 2,
    name: "Mammals",
    count: "105 species",
    image: mammalImage,
    position: "lg:col-start-2 lg:row-span-2 lg:row-start-1",
    large: true,
  },
  {
    id: 3,
    name: "Reptiles",
    count: "25 species",
    image: reptileImage,
    position: "lg:col-start-3 lg:row-start-1",
  },
  {
    id: 4,
    name: "Birds",
    count: "79 species",
    image: birdImage,
    position: "lg:col-start-1 lg:row-start-2",
  },
  {
    id: 5,
    name: "Sea creatures",
    count: "42 species",
    image: seaCreatureImage,
    position: "lg:col-start-3 lg:row-start-2",
  },
];

const newsArticles = [
  {
    id: 1,
    title: "Forest Fire",
    image: forestFireImage,
    description:
      "Forest fires destroy habitats and threaten many endemic animals.",
  },
  {
    id: 2,
    title: "Illegal Hunting & Poaching",
    image: huntingImage,
    description:
      "Illegal wildlife activities continue to affect protected species.",
  },
  {
    id: 3,
    title: "Urbanization",
    image: urbanizationImage,
    description:
      "Rapid urban development reduces and fragments natural habitats.",
  },
];

const events = [
  {
    id: 1,
    day: "1",
    month: "November",
    year: "2026",
    title: "National awareness day",
  },
  {
    id: 2,
    day: "4",
    month: "November",
    year: "2026",
    title: "Wildlife conservation day",
  },
  {
    id: 3,
    day: "5",
    month: "December",
    year: "2026",
    title: "Endemic species awareness day",
  },
];

function shuffleSpecies(species) {
  return [...species].sort(() => Math.random() - 0.5);
}

function WildlifeShowcase() {
  const [species, setSpecies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSpecies() {
      try {
        const response = await apiRequest("/species?page=1&limit=50");
        if (active) setSpecies(shuffleSpecies(response.data.species));
      } catch (requestError) {
        if (active) setError(requestError.message);
      }
    }
    loadSpecies();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (paused || species.length <= 4) return undefined;
    const timer = window.setInterval(() => setStartIndex((current) => (current + 1) % species.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused, species.length]);

  function move(direction) {
    setStartIndex((current) => (current + direction + species.length) % species.length);
  }

  const visibleSpecies = Array.from({ length: Math.min(4, species.length) }, (_, offset) => species[(startIndex + offset) % species.length]);

  return (
    <section className="bg-slate-200 px-4 py-5" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div><h2 className="font-serif text-2xl font-black text-black">Wildlife showcase</h2><p className="mt-1 text-xs font-semibold text-slate-600">Discover species from the live catalogue</p></div>
          <div className="flex gap-2"><button type="button" onClick={() => move(-1)} disabled={species.length < 2} aria-label="Previous animals" className="rounded-full border border-emerald-900 p-2 text-emerald-950 transition hover:bg-emerald-950 hover:text-white disabled:opacity-40"><ChevronLeft size={18} /></button><button type="button" onClick={() => move(1)} disabled={species.length < 2} aria-label="Next animals" className="rounded-full border border-emerald-900 p-2 text-emerald-950 transition hover:bg-emerald-950 hover:text-white disabled:opacity-40"><ChevronRight size={18} /></button></div>
        </div>
        {error ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Wildlife catalogue is temporarily unavailable.</div> : species.length === 0 ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading wildlife catalogue...</div> : <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{visibleSpecies.map((animal, offset) => <motion.div key={`${animal.id}-${startIndex}-${offset}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: offset * 0.05 }}><Link to={`/species/${animal.id}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-emerald-950 shadow-sm ring-1 ring-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-400" aria-label={`View details for ${animal.commonName}`}><img src={animal.image} alt={animal.commonName} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent opacity-80 transition group-hover:bg-black/45" /><div className="absolute right-4 bottom-4 left-4 translate-y-2 text-white opacity-90 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><h3 className="font-serif text-lg font-black leading-tight">{animal.commonName}</h3><p className="mt-1 text-xs italic text-emerald-100">{animal.scientificName}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold">View details <ArrowUpRight size={14} /></span></div></Link></motion.div>)}</div>}
        {species.length > 4 && <div className="mt-4 flex justify-center gap-1.5" aria-label="Wildlife carousel position">{species.slice(0, Math.min(species.length, 8)).map((_, index) => <button key={index} type="button" onClick={() => setStartIndex(index)} aria-label={`Show animals starting at position ${index + 1}`} className={`h-2 rounded-full transition-all ${startIndex === index ? "w-6 bg-emerald-950" : "w-2 bg-emerald-700/30"}`} />)}</div>}
      </div>
    </section>
  );
}

function CategoryCircle({ category }) {
  const size = category.large
    ? "h-52 w-52 md:h-64 md:w-64"
    : "h-40 w-40 md:h-48 md:w-48";

  return (
    <Link
      to="/species"
      className={`group relative mx-auto overflow-hidden rounded-full border-4 border-emerald-950 shadow-lg ${size} ${category.position}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      <div className="absolute right-0 bottom-5 left-0 text-center text-white">
        <h3 className="font-serif text-xl font-black">{category.name}</h3>
        <p className="font-serif text-lg font-bold">{category.count}</p>
      </div>
    </Link>
  );
}

function NewsCard({ article }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-xl transition duration-300 hover:-translate-y-2">
      <img
        src={article.image}
        alt={article.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="font-serif text-2xl font-black text-black">
          {article.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {article.description}
        </p>

        <Link
          to="/learn?focus=news"
          className="mt-4 inline-flex items-center gap-2 font-bold text-emerald-900 hover:underline"
        >
          Read more
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}

function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="px-3 py-3">
        <div className="mx-auto grid max-w-7xl overflow-hidden bg-[#061b18] lg:grid-cols-[1.6fr_0.9fr]">
          <div className="relative flex min-h-[500px] items-center overflow-hidden px-8 py-16 md:px-14">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-[50px] border-emerald-800" />
              <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full border-[35px] border-emerald-700" />
            </div>

            <div className="relative z-10 max-w-2xl text-white">
              <p className="text-sm font-bold tracking-[0.25em] text-emerald-300 uppercase">
                Welcome to EndemicLens
              </p>

              <h1 className="mt-5 font-serif text-4xl leading-tight font-black md:text-6xl">
                Discover &amp; Protect Sri Lanka&apos;s Biodiversity
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                Explore Sri Lanka&apos;s remarkable wildlife, identify endemic
                animals, record observations and learn how you can support
                biodiversity conservation.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-emerald-100">
                <span>105 Mammals</span>
                <span>50 Amphibians</span>
                <span>25 Reptiles</span>
                <span>42 Sea creatures</span>
                <span>79 Birds</span>
              </div>

              <div className="mt-8 flex items-center justify-between gap-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous"
                    className="rounded-full border border-white/40 p-2 text-white hover:bg-white hover:text-emerald-950"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next"
                    className="rounded-full border border-white/40 p-2 text-white hover:bg-white hover:text-emerald-950"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <Link
                  to="/species"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-serif font-bold text-emerald-950 transition hover:bg-emerald-100"
                >
                  Explore the portal
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className="min-h-[420px] p-4 lg:min-h-[500px]">
            <img
              src={heroBird}
              alt="Sri Lankan endemic bird"
              className="h-full min-h-[390px] w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      <WildlifeShowcase />

      {/* Sri Lanka information */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.5fr]">
          <div className="flex justify-center">
            <img
              src={sriLankaMap}
              alt="Sri Lanka biodiversity illustration"
              className="w-full max-w-sm object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-5">
              <span className="h-[3px] w-20 bg-cyan-600" />

              <h2 className="font-serif text-5xl font-black text-black md:text-6xl">
                Sri Lanka.
              </h2>
            </div>

            <p className="mt-7 text-sm leading-7 text-slate-700 md:text-base">
              Sri Lanka is a globally recognised biodiversity hotspot,
              containing tropical rainforests, mountain ecosystems, wetlands,
              grasslands and dry-zone forests. These habitats support a wide
              variety of endemic animals.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
              Many animals found on the island cannot be found anywhere else in
              the world. Protecting them requires accurate information,
              conservation action and meaningful public participation.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <article>
                <p className="text-sm font-bold text-slate-700">
                  Endangered endemic animals
                </p>
                <p className="mt-2 font-serif text-5xl font-black text-black">
                  138
                </p>
              </article>

              <article>
                <p className="text-sm font-bold text-slate-700">
                  Endemic animals
                </p>
                <p className="mt-2 font-serif text-5xl font-black text-black">
                  322
                </p>
              </article>

              <article>
                <p className="text-sm font-bold text-slate-700">
                  Total animals
                </p>
                <p className="mt-2 font-serif text-5xl font-black text-black">
                  945
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Animal categories */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {animalCategories.map((category) => (
            <CategoryCircle key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Floating identify button */}
      <div className="sticky bottom-5 z-30 flex justify-end px-5">
        <Link
          to="/identify"
          aria-label="Identify an animal"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl ring-4 ring-emerald-950 transition hover:scale-110"
        >
          <Camera size={30} />
        </Link>
      </div>

      {/* Latest news */}
      <section
        className="relative bg-cover bg-center px-6 py-16"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 64, 30, 0.45), rgba(16, 64, 30, 0.45)),
            url(${newsBackground})
          `,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-md bg-black px-8 py-3 text-center">
            <h2 className="font-serif text-3xl font-black text-white">
              Latest news
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {newsArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Maps */}
      <section className="bg-slate-200 px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={heatMapImage}
              alt="Sri Lanka animal population density map"
              className="w-full max-w-md rounded-xl bg-white object-contain p-4 shadow"
            />
          </div>

          <div>
            <h2 className="font-serif text-4xl font-black text-black">
              Maps
            </h2>

            <p className="mt-5 leading-7 text-slate-700">
              Explore species observations, habitat distribution and
              biodiversity concentration areas across Sri Lanka.
            </p>

            <div className="mt-8 flex max-w-sm flex-col gap-4">
              <Link
                to="/map"
                className="rounded-full bg-emerald-950 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
              >
                Heat map
              </Link>

              <Link
                to="/map"
                className="rounded-full bg-emerald-950 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
              >
                Density map
              </Link>

              <Link
                to="/map"
                className="rounded-full bg-emerald-950 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
              >
                Your findings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-slate-200 px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            {events.map((event) => (
              <Link
                key={event.id}
                to="/learn?focus=days"
                className="grid overflow-hidden bg-white shadow-sm sm:grid-cols-[150px_1fr]"
              >
                <div className="bg-emerald-950 px-5 py-4 text-white">
                  <div className="flex items-start gap-2">
                    <span className="font-serif text-3xl font-black">
                      {event.day}
                    </span>

                    <span className="mt-2 text-xs">{event.month}</span>
                  </div>

                  <p className="font-serif text-3xl font-black">
                    {event.year}
                  </p>
                </div>

                <div className="flex items-center px-7 py-5">
                  <h3 className="font-serif text-lg font-bold text-black">
                    {event.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <img
            src={leopardDayImage}
            alt="World Leopard Day"
            className="h-full max-h-[480px] w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default HomePage;