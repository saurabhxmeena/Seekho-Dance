import { DanceCategory } from "@/types";

export const DANCE_CATEGORIES: DanceCategory[] = [
  {
    id: "bollywood",
    name: "Bollywood",
    slug: "bollywood",
    tagline: "Iconic cinematic hooksteps & expressive moves",
    description: "High-energy cinema choreography from trending releases and all-time classics.",
    coverImage: "/categories/bollywood.jpg",
    sampleSongs: ["Tauba Tauba", "Chaleya", "Ghungroo"]
  },
  {
    id: "traditional",
    name: "Traditional Dance Videos",
    slug: "traditional",
    tagline: "Classical mudras, cultural folk & timeless heritage",
    description: "Authentic cultural routines, classical footwork patterns, and expressive storytelling.",
    coverImage: "/categories/traditional.jpg",
    sampleSongs: ["Ghoomar", "Albela Sajan", "Nagada Sang Dhol"]
  },
  {
    id: "rajasthani",
    name: "Rajasthani Dance Videos",
    slug: "rajasthani",
    tagline: "Ghoomar, Kalbeliya & royal folk beats",
    description: "Graceful twirls, rhythmic hand claps, and energetic folk steps from Rajasthan.",
    coverImage: "/categories/rajasthani.jpg",
    sampleSongs: ["Chaudhary", "Padharo Mhare Des", "Kesariya Balam"]
  },
  {
    id: "haryanvi",
    name: "Haryanvi Dance Videos",
    slug: "haryanvi",
    tagline: "High-energy beats, thumkas & folk swagger",
    description: "Upbeat desi rhythms, dynamic shoulder accents, and viral celebration footwork.",
    coverImage: "/categories/haryanvi.jpg",
    sampleSongs: ["52 Gaj Ka Daman", "Bahu Kale Ki", "Chatak Matak"]
  },
  {
    id: "wedding",
    name: "Mixed Wedding Dance Videos",
    slug: "wedding",
    tagline: "Sangeet, baraat & celebration group routines",
    description: "Crowd-pleasing group combinations and couple routines designed for celebrations.",
    coverImage: "/categories/wedding.jpg",
    sampleSongs: ["London Thumakda", "Gallan Goodiyaan", "Sauda Khara Khara"]
  },
  {
    id: "punjabi",
    name: "Punjabi & Bhangra Dance Videos",
    slug: "punjabi",
    tagline: "High-voltage dhol beats, energetic hops & festive swagger",
    description: "Infectious Punjabi folk rhythms, dynamic shoulder bounces, and celebratory steps.",
    coverImage: "/categories/punjabi.jpg",
    sampleSongs: ["Mundian To Bach Ke", "Coka", "Lover"]
  }
];
