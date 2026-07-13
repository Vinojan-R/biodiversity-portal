import protectionBird from "../assets/images/bird-protection.png";
import awarenessMonkey from "../assets/images/monkey-awareness.png";
import educationBird from "../assets/images/bird-education.png";
import AimSection from "../components/home/AimSection";
import AnimalGallery from "../components/home/AnimalGallery";
import HeroSection from "../components/home/HeroSection";
import SriLankaSection from "../components/home/SriLankaSection";

function HomePage() {
  return (
    <>
      <HeroSection />

      <SriLankaSection />

      <section className="bg-gradient-to-r from-green-950 via-green-700 to-white px-6 py-3">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl font-black text-white md:text-4xl">
            Our Aim.........
          </h2>
        </div>
      </section>

      <AimSection
        title="Protect endemic animals"
        image={protectionBird}
        imageAlt="Sri Lankan endemic bird"
        imageSide="right"
      >
        <p>
          Sri Lanka&apos;s endemic wildlife faces serious threats from habitat
          destruction, climate change, illegal wildlife activities and
          pollution.
        </p>

        <p>
          The portal helps people identify animals correctly and understand
          their ecological importance.
        </p>

        <p>
          Better information can reduce fear-driven harm and support
          responsible wildlife protection.
        </p>
      </AimSection>

      <AimSection
        title="Public awareness"
        image={awarenessMonkey}
        imageAlt="Sri Lankan monkey"
        imageSide="left"
      >
        <p>
          Many people encounter animals without knowing whether they are
          dangerous, protected or harmless.
        </p>

        <p>
          EndemicLens provides accessible information about species,
          conservation status, habitat and safe interactions.
        </p>

        <p>
          Public awareness can reduce misidentification and encourage
          conservation-friendly behaviour.
        </p>
      </AimSection>

      <AimSection
        title="Promotes education"
        image={educationBird}
        imageAlt="Sri Lankan bird in a nest"
        imageSide="right"
      >
        <p>
          The portal is designed as an educational resource for school
          students, university students, researchers and nature enthusiasts.
        </p>

        <p>
          Users can explore species profiles, habitats, ecological roles and
          conservation threats.
        </p>

        <p>
          Biodiversity knowledge becomes easier to access and understand.
        </p>
      </AimSection>

      <AnimalGallery />
    </>
  );
}

export default HomePage;