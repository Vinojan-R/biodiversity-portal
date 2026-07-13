import bearImage from "../../assets/images/sloth-bear.jpg";
import elephantImage from "../../assets/images/elephant.jpg";
import leopardImage from "../../assets/images/leopard.jpg";

const animals = [
  {
    name: "Sri Lankan Sloth Bear",
    image: bearImage,
  },
  {
    name: "Sri Lankan Leopard",
    image: leopardImage,
  },
  {
    name: "Sri Lankan Elephant",
    image: elephantImage,
  },
];

function AnimalGallery() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {animals.map((animal) => (
            <article
              key={animal.name}
              className="group relative h-64 overflow-hidden"
              style={{
                clipPath: "polygon(9% 0, 100% 0, 91% 100%, 0 100%)",
              }}
            >
              <img
                src={animal.image}
                alt={animal.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/40"></div>

              <div className="absolute right-0 bottom-0 left-0 translate-y-full bg-black/70 p-4 text-white transition duration-300 group-hover:translate-y-0">
                <h3 className="font-serif text-xl font-bold">
                  {animal.name}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimalGallery;