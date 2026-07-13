import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import heroBird from "../assets/images/home/hero-bird.png";
import sriLankaMap from "../assets/images/home/Srilanka-map.png";

import observation1 from "../assets/images/home/observation-1.png";
import observation2 from "../assets/images/home/observation-2.png";
import observation3 from "../assets/images/home/observation-3.png";
import observation4 from "../assets/images/home/observation-4.png";
import observation5 from "../assets/images/home/observation-5.png";
import observation6 from "../assets/images/home/observation-6.png";

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

const observations = [
  {
    id: 1,
    commonName: "Purple-faced Langur",
    scientificName: "Semnopithecus vetulus",
    image: observation1,
  },
  {
    id: 2,
    commonName: "Red Slender Loris",
    scientificName: "Loris tardigradus",
    image: observation2,
  },
  {
    id: 3,
    commonName: "Green Lizard",
    scientificName: "Calotes calotes",
    image: observation3,
  },
  {
    id: 4,
    commonName: "Sri Lanka Spurfowl",
    scientificName: "Galloperdix bicalcarata",
    image: observation4,
  },
  {
    id: 5,
    commonName: "Pygmy Lizard",
    scientificName: "Cophotis ceylanica",
    image: observation5,
  },
  {
    id: 6,
    commonName: "Mouse Deer",
    scientificName: "Moschiola meminna",
    image: observation6,
  },
];

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

function ObservationCard({ observation }) {
  return (
    <article className="min-w-[150px] overflow-hidden bg-white">
      <img
        src={observation.image}
        alt={observation.commonName}
        className="h-32 w-full object-cover"
      />

      <div className="p-2">
        <p className="text-[10px] font-bold uppercase text-slate-700">
          {observation.commonName}
        </p>

        <p className="mt-1 text-[9px] italic text-slate-500">
          {observation.scientificName}
        </p>
      </div>
    </article>
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

        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 font-bold text-emerald-900 hover:underline"
        >
          Read more
          <ArrowUpRight size={17} />
        </button>
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

      {/* Recent observations */}
      <section className="bg-slate-200 px-4 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-black text-black">
              Recent observations
            </h2>

            <Link
              to="/species"
              className="text-sm font-bold text-emerald-900 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {observations.map((observation) => (
              <ObservationCard
                key={observation.id}
                observation={observation}
              />
            ))}
          </div>
        </div>
      </section>

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
              <article
                key={event.id}
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
              </article>
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