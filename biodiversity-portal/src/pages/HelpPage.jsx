import {
  Camera,
  ChevronDown,
  CircleHelp,
  Mail,
  MapPinned,
  Search,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const helpTopics = [
  {
    icon: Search,
    title: "Explore species",
    description:
      "Search for animals using their common name, scientific name or category.",
    link: "/species",
  },
  {
    icon: Camera,
    title: "Identify an animal",
    description:
      "Upload a clear wildlife photograph and receive an identification suggestion.",
    link: "/identify",
  },
  {
    icon: MapPinned,
    title: "Use biodiversity maps",
    description:
      "Explore species observation locations and habitat distribution information.",
    link: "/map",
  },
  {
    icon: UserRound,
    title: "Manage your account",
    description:
      "Learn how to sign in, update your profile and manage observations.",
    link: "/home",
  },
];

const faqs = [
  {
    question: "Is every identification result completely accurate?",
    answer:
      "No. Machine-learning results are suggestions and should be verified using reliable references or a qualified wildlife expert.",
  },
  {
    question: "What type of image should I upload?",
    answer:
      "Use a clear, well-lit photograph where the animal is visible and not heavily obstructed by leaves, shadows or other objects.",
  },
  {
    question: "Can I submit an animal observation?",
    answer:
      "Observation submission will allow registered users to provide a photograph, date and location. This feature can be connected to the backend during development.",
  },
  {
    question: "Why are some species marked as native rather than endemic?",
    answer:
      "An endemic species occurs naturally only in Sri Lanka. Native species may also occur naturally in other countries or regions.",
  },
];

function HelpPage() {
  const [openQuestion, setOpenQuestion] = useState(0);

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <CircleHelp className="mx-auto text-emerald-300" size={50} />

          <h1 className="mt-5 text-4xl font-black md:text-6xl">
            How can we help?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-100">
            Find guidance for using EndemicLens, identifying species and
            exploring biodiversity information.
          </p>

          <div className="relative mx-auto mt-8 max-w-2xl">
            <Search
              className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"
              size={21}
            />

            <input
              type="search"
              placeholder="Search help topics..."
              className="w-full rounded-2xl bg-white py-4 pr-5 pl-14 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-300/30"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-black text-slate-900">
          Popular help topics
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {helpTopics.map(({ icon: Icon, title, description, link }) => (
            <Link
              key={title}
              to={link}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
            >
              <Icon size={32} className="text-emerald-700" />

              <h3 className="mt-5 text-xl font-black text-slate-900">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black text-slate-900">
            Frequently asked questions
          </h2>

          <div className="mt-8 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openQuestion === index;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 bg-slate-50 px-6 py-5 text-left"
                  >
                    <span className="font-bold text-slate-900">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`shrink-0 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="px-6 py-5 leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-950 p-8 text-center text-white md:p-12">
          <Mail className="mx-auto text-emerald-300" size={42} />

          <h2 className="mt-5 text-3xl font-black">
            Still need assistance?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-emerald-100">
            Contact the EndemicLens project team for technical support,
            feedback or questions about the portal.
          </p>

          <a
            href="mailto:endemiclens@example.com"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-emerald-950 transition hover:bg-emerald-100"
          >
            Contact support
          </a>
        </div>
      </section>
    </main>
  );
}

export default HelpPage;