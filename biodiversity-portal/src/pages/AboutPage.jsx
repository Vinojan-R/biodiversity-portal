import {
  BookOpen,
  BrainCircuit,
  Leaf,
  MapPinned,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-assisted identification",
    description:
      "EndemicLens uses image-based machine learning as a supporting tool for identifying Sri Lankan wildlife.",
  },
  {
    icon: BookOpen,
    title: "Environmental education",
    description:
      "The portal presents accessible information about species, habitats, threats and conservation.",
  },
  {
    icon: MapPinned,
    title: "Citizen science",
    description:
      "Users can contribute observations and location information to support biodiversity awareness.",
  },
  {
    icon: Leaf,
    title: "Conservation awareness",
    description:
      "The project aims to reduce misidentification and encourage responsible interaction with wildlife.",
  },
];

function AboutPage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold tracking-[0.25em] text-emerald-300 uppercase">
            About EndemicLens
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-6xl">
            Connecting technology, education and biodiversity conservation
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-100">
            EndemicLens is a web-based biodiversity portal designed to help
            people explore, identify and understand Sri Lanka&apos;s endemic
            wildlife.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <article>
            <p className="font-bold tracking-widest text-emerald-700 uppercase">
              Our purpose
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              Why we created EndemicLens
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-slate-600">
              <p>
                Sri Lanka is home to a remarkable variety of endemic animals,
                but many people do not have easy access to accurate,
                understandable species information.
              </p>

              <p>
                Misidentification can lead to fear, unnecessary harm and poor
                conservation decisions. EndemicLens aims to make biodiversity
                information easier to access through a modern digital
                platform.
              </p>

              <p>
                The system combines species information, image-assisted
                identification, educational resources, observations and
                biodiversity maps.
              </p>
            </div>
          </article>

          <article className="rounded-3xl bg-emerald-950 p-8 text-white shadow-xl md:p-10">
            <Users size={42} className="text-emerald-300" />

            <h2 className="mt-5 text-3xl font-black">Our project team</h2>

            <p className="mt-5 leading-8 text-emerald-100">
              EndemicLens is developed by Group Artemis as part of the Bachelor
              of Information and Communication Technology degree programme at
              Rajarata University of Sri Lanka.
            </p>

            <p className="mt-5 leading-8 text-emerald-100">
              The project is designed for students, researchers, nature
              enthusiasts and members of the public interested in Sri Lankan
              biodiversity.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold tracking-widest text-emerald-700 uppercase">
              What the portal provides
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              Supporting awareness through useful digital tools
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-emerald-100 bg-slate-50 p-7"
              >
                <Icon className="text-emerald-700" size={34} />

                <h3 className="mt-5 text-xl font-black text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;