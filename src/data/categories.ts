import { DanceCategory } from "@/types";

export const DANCE_CATEGORIES: DanceCategory[] = [
  {
    id: "bollywood",
    name: "Bollywood Commercial",
    slug: "bollywood",
    tagline: "High-energy hooksteps & expressive storytelling",
    description: "The viral Indian cinema choreography taking over global stages. Focus on crisp hand gestures (mudras), dynamic hip weight shifts, and electrifying facial expressions.",
    coverImage: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop",
    routineCount: 42,
    sampleSongs: ["Tauba Tauba", "Chaleya", "Ghungroo", "Aasa Kooda"]
  },
  {
    id: "afro-fusion",
    name: "Afro Fusion & Amapiano",
    slug: "afro-fusion",
    tagline: "Grounded polyrhythms, waistline control & bounce",
    description: "Centering down into the earth with South African Bacardi, Nigerian Afrobeats, and Amapiano footwork. Master the distinct shoulder roll and knee bounce.",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
    routineCount: 38,
    sampleSongs: ["Water", "Calm Down", "Rush", "Tshwala Bam"]
  },
  {
    id: "k-pop",
    name: "K-Pop Choreography",
    slug: "k-pop",
    tagline: "Razor-sharp formations, micro-isolations & speed",
    description: "Precision-driven choreography defined by clean lines, geometric arm placements, synchronization, and dramatic center-stage dynamic accents.",
    coverImage: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=1200&auto=format&fit=crop",
    routineCount: 35,
    sampleSongs: ["Seven", "Standing Next to You", "Super Shy", "Drama"]
  },
  {
    id: "urban-hiphop",
    name: "Urban Hip-Hop",
    slug: "urban-hiphop",
    tagline: "Heavy grooves, bounce fundamentals & attitude",
    description: "Street-inspired commercial choreography focusing on musicality, bounce, isolations, sliding weight transitions, and rhythmic syncopation.",
    coverImage: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=1200&auto=format&fit=crop",
    routineCount: 29,
    sampleSongs: ["Greedy", "Industry Baby", "Paint The Town Red", "FE!N"]
  },
  {
    id: "south-fusion",
    name: "South Fusion & Folk Street",
    slug: "south-fusion",
    tagline: "Fast kuthu beats, lunges & celebratory vibes",
    description: "High-tempo, grounded South Indian street style combined with modern urban isolations. Known for infectious energy and rapid-fire foot taps.",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    routineCount: 19,
    sampleSongs: ["Illuminati", "Natu Natu", "Arabic Kuthu", "Kaavaalaa"]
  },
  {
    id: "latin-salsa",
    name: "Latin & Reggaeton",
    slug: "latin-salsa",
    tagline: "Sensual hip rolls, fluid ribcage & syncopation",
    description: "Rhythm-heavy Caribbean and Latin American dance movements emphasizing core control, smooth hip transitions, and percussive footwork.",
    coverImage: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1200&auto=format&fit=crop",
    routineCount: 24,
    sampleSongs: ["Despacito", "Mi Gente", "Dákiti", "Monaco"]
  }
];
