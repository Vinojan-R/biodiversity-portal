import protectionBird from "../assets/images/bird-protection.png";
import awarenessMonkey from "../assets/images/monkey-awareness.png";
import educationBird from "../assets/images/bird-education.png";

import AimSection from "../components/home/AimSection";
import AnimalGallery from "../components/home/AnimalGallery";
import HeroSection from "../components/home/HeroSection";
import SriLankaSection from "../components/home/SriLankaSection";
import LandingNavbar from "../components/landing/LandingNavbar";
import Footer from "../components/layout/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <main>
        <HeroSection />

        <SriLankaSection />

        <section className="bg-gradient-to-r from-emerald-950 via-emerald-700 to-white px-6 py-3">
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
            Sri Lanka&apos;s endemic wildlife faces threats from habitat
            destruction, climate change, pollution and harmful human
            activities.
          </p>

          <p>
            The portal helps people identify animals correctly and understand
            their ecological importance.
          </p>
        </AimSection>

        <AimSection
          title="Public awareness"
          image={awarenessMonkey}
          imageAlt="Sri Lankan monkey"
          imageSide="left"
        >
          <p>
            EndemicLens provides accessible information about species,
            conservation status, habitats and safe wildlife interactions.
          </p>

          <p>
            Public awareness can reduce fear, misidentification and
            unnecessary harm to animals.
          </p>
        </AimSection>

        <AimSection
          title="Promotes education"
          image={educationBird}
          imageAlt="Sri Lankan bird"
          imageSide="right"
        >
          <p>
            The portal supports school students, university students,
            researchers and nature enthusiasts.
          </p>

          <p>
            Users can learn about species, habitats, ecological roles and
            conservation threats.
          </p>
        </AimSection>

        <AnimalGallery />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;