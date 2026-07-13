import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero-lizard.png";

function HeroSection() {
  return (
    <section
      className="relative min-h-[700px] overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.72) 45%,
            rgba(0,0,0,0.22) 100%
          ),
          url(${heroImage})
        `,
      }}
    >
      <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-10 px-6 pt-28 md:grid-cols-[1.5fr_0.7fr]">
        <div className="max-w-2xl text-white">
          <p className="mb-5 text-sm font-bold tracking-[0.25em] text-green-300 uppercase">
            Explore • Identify • Protect
          </p>

          <h1 className="font-serif text-5xl leading-[0.95] font-black md:text-7xl">
            Discover
            <span className="block text-3xl md:text-5xl">
              the hidden wildlife of
            </span>
            <span className="block text-5xl md:text-7xl">
              Sri Lanka.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-gray-200 md:text-base">
            Identify and learn about Sri Lanka&apos;s endemic wildlife while
            supporting conservation, education and public awareness.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/species"
              className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Explore species
            </Link>

            <Link
              to="/identify"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-green-950"
            >
              Identify an animal
            </Link>
          </div>
        </div>

        <div className="max-w-xs text-white md:justify-self-end">
          <h2 className="font-serif text-3xl leading-tight font-bold">
            Identify Any Animal Instantly
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-200">
            Upload or capture an image and let the application suggest the
            species.
          </p>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Download the App
            <Download size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;