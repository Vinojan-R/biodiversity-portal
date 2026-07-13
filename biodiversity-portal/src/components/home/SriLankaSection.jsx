import sriLankaMap from "../../assets/images/sri-lanka-map.png";

const statistics = [
  {
    value: "138",
    label: "Endangered endemic animals",
  },
  {
    value: "322",
    label: "Endemic animals",
  },
  {
    value: "945",
    label: "Recorded animals",
  },
];

function SriLankaSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.8fr_1.4fr]">
        <div className="flex justify-center">
          <img
            src={sriLankaMap}
            alt="Sri Lanka biodiversity map"
            className="w-full max-w-sm object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-4">
            <span className="h-[3px] w-16 bg-cyan-600"></span>

            <h2 className="font-serif text-5xl font-black text-black">
              Sri Lanka.
            </h2>
          </div>

          <p className="mt-7 text-sm leading-7 text-gray-700 md:text-base">
            Sri Lanka is recognised as a major biodiversity hotspot and is home
            to a remarkable variety of animal species. Many of these animals
            are endemic and cannot be found anywhere else in the world.
          </p>

          <p className="mt-4 text-sm leading-7 text-gray-700 md:text-base">
            Forests, wetlands, mountain ecosystems, grasslands and dry-zone
            habitats support many reptiles, amphibians, mammals and birds.
            These species face threats from habitat loss, climate change and
            human activities.
          </p>

          <p className="mt-4 text-sm leading-7 text-gray-700 md:text-base">
            EndemicLens supports awareness by helping users explore,
            understand and identify Sri Lanka&apos;s wildlife.
          </p>

          <div className="mt-10 grid gap-7 sm:grid-cols-3">
            {statistics.map((statistic) => (
              <article key={statistic.label}>
                <p className="text-sm font-semibold text-gray-600">
                  {statistic.label}
                </p>

                <p className="mt-2 font-serif text-5xl font-black text-black">
                  {statistic.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SriLankaSection;