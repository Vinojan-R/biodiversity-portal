import forestFireImage from "../assets/images/home/forest-fire.png";
import huntingImage from "../assets/images/home/illegal-hunting.png";
import urbanizationImage from "../assets/images/home/urbanization.png";

export const learnNews = [
  {
    id: "forest-fire-habitat-loss",
    title: "Forest fires and the habitats at risk",
    summary: "Learn how fire can fragment forest ecosystems and affect endemic wildlife.",
    image: forestFireImage,
    category: "Conservation",
    publishedDate: "2026-01-18",
    source: "EndemicLens learning desk",
    sourceUrl: "",
    location: "Sri Lanka",
    tags: ["forests", "habitat", "conservation"],
    relatedSpecies: ["purple-faced-langur"],
    featured: true,
    mock: true,
  },
  {
    id: "illegal-wildlife-activity",
    title: "Understanding illegal wildlife activity",
    summary: "A safety-first introduction to reporting suspected poaching and trafficking.",
    image: huntingImage,
    category: "Human-Wildlife Conflict",
    publishedDate: "2026-01-11",
    source: "EndemicLens learning desk",
    sourceUrl: "",
    location: "Sri Lanka",
    tags: ["safety", "reporting", "wildlife"],
    relatedSpecies: [],
    mock: true,
  },
  {
    id: "urbanization-wildlife",
    title: "Urban growth and wildlife corridors",
    summary: "Explore why connected habitats matter for species living near towns and cities.",
    image: urbanizationImage,
    category: "Protected Areas",
    publishedDate: "2025-12-28",
    source: "EndemicLens learning desk",
    sourceUrl: "",
    location: "Sri Lanka",
    tags: ["habitat", "cities", "corridors"],
    relatedSpecies: ["toque-macaque"],
    mock: true,
  },
];
