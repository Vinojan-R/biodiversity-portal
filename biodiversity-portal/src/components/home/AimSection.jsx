function AimSection({
  title,
  image,
  imageAlt,
  imageSide = "right",
  children,
}) {
  const isImageLeft = imageSide === "left";

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid min-h-[560px] max-w-7xl items-center lg:grid-cols-2">
        <div
          className={`px-8 py-16 md:px-14 lg:px-16 ${
            isImageLeft ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <h2 className="font-serif text-4xl font-black text-black md:text-5xl">
            {title}
          </h2>

          <div className="mt-8 max-w-xl space-y-5 text-sm leading-7 text-gray-700 md:text-base">
            {children}
          </div>
        </div>

        <div
          className={`relative flex min-h-[500px] items-end justify-center overflow-hidden bg-green-950 ${
            isImageLeft ? "lg:order-1" : "lg:order-2"
          }`}
          style={{
            clipPath: isImageLeft
              ? "polygon(0 0, 68% 0, 100% 100%, 0 100%)"
              : "polygon(32% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="relative z-10 max-h-[520px] w-full object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}

export default AimSection;