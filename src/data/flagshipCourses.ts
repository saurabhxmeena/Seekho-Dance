export interface CourseChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  topics: string[];
  practiceNote?: string;
  statusBadge: "Core Module" | "Interactive Practice" | "Capstone Project" | "Strategy & Workflow" | "Workshop";
  routineLink?: {
    id: string;
    slug: string;
    title: string;
    artist: string;
  };
}

export interface FlagshipCourse {
  id: "course-zero" | "course-creator";
  number: "01" | "02";
  title: string;
  subtitle: string;
  badge: string;
  pill: string;
  headline: string;
  philosophy: string;
  overview: string;
  targetAudience: string[];
  learningOutcomes: string[];
  price: number; // in rupees
  pricePaise: number;
  includedInMembership: boolean;
  coverImage: string;
  accentColor: string; // for subtle highlights
  chapters: CourseChapter[];
  keyHighlights: {
    iconName: string;
    label: string;
    desc: string;
  }[];
}

export const FLAGSHIP_COURSES: FlagshipCourse[] = [
  {
    id: "course-zero",
    number: "01",
    title: "Dance From Zero",
    subtitle: "Your first step into the world of dance.",
    badge: "Course 01 — Learn to Dance",
    pill: "For Complete Beginners",
    headline: "Never danced before? Perfect. Start here.",
    philosophy: "From your very first movement to your first recorded routine — learn rhythm, coordination, and confidence at your own pace.",
    overview:
      "A structured step-by-step foundation designed specifically for people who have never danced, feel clumsy or stiff on the dance floor, or simply want to learn without judgement. Starting with basic beat recognition and weight transfers, you will gradually build the muscle memory, musicality, and coordination needed to dance with natural confidence.",
    targetAudience: [
      "Complete beginners with zero previous dance experience",
      "Anyone who feels awkward, stiff, or out of sync with music",
      "Learners preparing for weddings, parties, or social gatherings",
      "People wanting to learn dance for personal fitness and joy",
      "Aspiring dancers wanting to record their first confident video",
    ],
    learningOutcomes: [
      "Recognize and internalize musical beats, tempo, and 8-count timing without counting out loud",
      "Coordinate footwork, hip weight shifts, and upper-body posture fluidly",
      "Master foundational movement combinations used across popular dance styles",
      "Break down full song choreographies into manageable, repeatable practice chunks",
      "Practice comfortably using mirror-flip video and slow-motion tempo controls",
      "Record your first complete, polished dance video with proper smartphone framing",
    ],
    price: 999,
    pricePaise: 99900,
    includedInMembership: true,
    coverImage: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop",
    accentColor: "orange",
    keyHighlights: [
      {
        iconName: "Footprints",
        label: "Zero Experience Needed",
        desc: "Designed from ground zero. No complex jargon or dance background required.",
      },
      {
        iconName: "Repeat",
        label: "Slow-Mo & Mirror Practice",
        desc: "Break down real routines at 0.5x tempo with horizontal mirror flip.",
      },
      {
        iconName: "Video",
        label: "Your First Dance Video",
        desc: "Ends with a hands-on guide to record your very first 30-second dance video.",
      },
    ],
    chapters: [
      {
        id: "zero-ch1",
        chapterNumber: 1,
        title: "Chapter 01 — Start Moving",
        subtitle: "Finding comfort in rhythm and natural movement",
        topics: [
          "Understanding musical rhythm, pulse, and the universal 8-count beat",
          "Developing basic body coordination and posture balance",
          "Releasing upper-body tension and finding comfort in movement",
        ],
        practiceNote: "Initial rhythm warmup drills to get your body flowing with the beat.",
        statusBadge: "Core Module",
      },
      {
        id: "zero-ch2",
        chapterNumber: 2,
        title: "Chapter 02 — Your First Dance Moves",
        subtitle: "The essential building blocks of dance",
        topics: [
          "Fundamental weight shifts, center of gravity, and bounce rhythm",
          "Basic footwork: step-touch, pivot basics, and directional weight transfer",
          "Simple hand coordination and upper-body accents",
        ],
        practiceNote: "Daily 10-minute footwork drill to build natural muscle memory.",
        statusBadge: "Core Module",
      },
      {
        id: "zero-ch3",
        chapterNumber: 3,
        title: "Chapter 03 — Build Your Foundation",
        subtitle: "Connecting individual steps into fluid sequences",
        topics: [
          "Combining individual steps into continuous 4-count and 8-count chains",
          "Learning short movement combinations with tempo variations",
          "Improving transition smoothness, timing, and posture recovery",
        ],
        practiceNote: "Combination drill combining step-touch, hip sway, and wrist accents.",
        statusBadge: "Core Module",
      },
      {
        id: "zero-ch4",
        chapterNumber: 4,
        title: "Chapter 04 — Learn a Complete Routine",
        subtitle: "Putting choreography together with real music",
        topics: [
          "Breaking choreography into manageable, repeatable 8-count phrases",
          "Practicing transitions between introductory steps and chorus hooksteps",
          "Connecting movements smoothly using tempo adjustments (0.5x, 0.75x, 1x)",
        ],
        practiceNote: "Interactive practice session available in Seekho Studio using Tauba Tauba or Tum Se Hi.",
        statusBadge: "Interactive Practice",
        routineLink: {
          id: "tauba-tauba",
          slug: "tauba-tauba",
          title: "Tauba Tauba",
          artist: "Karan Aujla (Bad Newz)",
        },
      },
      {
        id: "zero-ch5",
        chapterNumber: 5,
        title: "Chapter 05 — Dance With Confidence",
        subtitle: "Expression, presence, and personal style",
        topics: [
          "Facial expression, eyeline focus, and projecting positive energy",
          "Practicing in front of a mirror or camera without self-criticism",
          "Building a sustainable 15-minute daily practice routine",
        ],
        practiceNote: "Camera-presence exercise designed to remove camera hesitation.",
        statusBadge: "Core Module",
      },
      {
        id: "zero-ch6",
        chapterNumber: 6,
        title: "Chapter 06 — Your First Dance Video",
        subtitle: "Recording and celebrating your journey",
        topics: [
          "Selecting the right music section and finding the musical cue",
          "Setting up your smartphone camera: angle, height, and natural lighting",
          "Basic framing fundamentals: full-body versus dynamic mid-shot",
          "Recording your first dance video with poise and clean execution",
        ],
        practiceNote: "Capstone milestone: Record your first 30-second dance clip.",
        statusBadge: "Capstone Project",
      },
    ],
  },
  {
    id: "course-creator",
    number: "02",
    title: "Create Your Dance Channel",
    subtitle: "Turn your passion for dance into a creator journey.",
    badge: "Course 02 — Become a Dance Creator",
    pill: "For Aspiring Creators",
    headline: "Learn to turn your dance passion into content people want to watch.",
    philosophy: "From choosing your niche to filming, editing, audience growth, and ethical monetization — build a dance channel that lasts.",
    overview:
      "A comprehensive, practical roadmap for dancers ready to share their work online. Whether starting a YouTube channel, producing high-retention Shorts, or building a sustainable creator brand, this course demystifies the technical, creative, and operational sides of video creation without false promises of overnight fame.",
    targetAudience: [
      "Dancers ready to share their choreographies on YouTube and social media",
      "Aspiring creators looking to start a dance, fitness, or tutorial channel",
      "Dancers wanting to upgrade their filming, lighting, and audio quality",
      "Creators looking for a repeatable workflow and content strategy",
      "Artists seeking to understand monetization channels and brand partnerships",
    ],
    learningOutcomes: [
      "Identify your unique dance-content niche, target viewer, and visual brand identity",
      "Set up a complete YouTube channel with optimized metadata, banner, and playlists",
      "Shoot crisp dance footage on a smartphone with proper lighting and stabilization",
      "Navigate music copyright, Content ID guidelines, and royalty-free alternatives",
      "Design high-CTR thumbnails and structure videos for strong initial audience retention",
      "Understand legitimate creator revenue streams including YPP, sponsorships, and teaching",
    ],
    price: 999,
    pricePaise: 99900,
    includedInMembership: true,
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    accentColor: "amber",
    keyHighlights: [
      {
        iconName: "Smartphone",
        label: "Smartphone Production",
        desc: "Learn to light, frame, and record studio-grade video with just your phone.",
      },
      {
        iconName: "Youtube",
        label: "Channel Blueprint",
        desc: "End-to-end guide to setup, playlists, SEO, and audience retention.",
      },
      {
        iconName: "TrendingUp",
        label: "Sustainable Monetization",
        desc: "Real insight into ads, brand deals, and creator income — no hype.",
      },
    ],
    chapters: [
      {
        id: "creator-ch1",
        chapterNumber: 1,
        title: "Chapter 01 — Find Your Creator Identity",
        subtitle: "Carving out your unique dance niche",
        topics: [
          "Choosing your dance-content niche: tutorials, hooksteps, fitness, or cultural fusion",
          "Understanding your audience and what motivates people to subscribe",
          "Developing a recognizable content aesthetic, signature style, and color palette",
        ],
        practiceNote: "Creator Blueprint exercise: defining your 1-sentence channel positioning.",
        statusBadge: "Strategy & Workflow",
      },
      {
        id: "creator-ch2",
        chapterNumber: 2,
        title: "Chapter 02 — Build Your YouTube Channel",
        subtitle: "Professional channel architecture and setup",
        topics: [
          "Channel setup, handle selection, category selection, and URL configuration",
          "Visual branding: avatar, banner safe-zone design, and watermark graphics",
          "Writing search-friendly channel descriptions, default tags, and playlist layout",
        ],
        practiceNote: "Channel setup checklist with resolution specs for mobile and desktop.",
        statusBadge: "Core Module",
      },
      {
        id: "creator-ch3",
        chapterNumber: 3,
        title: "Chapter 03 — Create Better Dance Videos",
        subtitle: "Cinematography and editing fundamentals",
        topics: [
          "Smartphone filming settings: 4K vs 1080p, 60fps for movement, and shutter locks",
          "Lighting dance: 3-point light setup, natural daylight, and avoiding floor reflections",
          "Audio synchronization: syncing external studio tracks to mobile camera clips",
          "Music copyright awareness: YouTube Content ID, licensing, and attribution rules",
        ],
        practiceNote: "Production guide for clean audio-to-video alignment and framing.",
        statusBadge: "Workshop",
      },
      {
        id: "creator-ch4",
        chapterNumber: 4,
        title: "Chapter 04 — Content Strategy",
        subtitle: "Consistent publishing without burnout",
        topics: [
          "The balance between rapid-discovery Shorts and deep-loyalty long-form videos",
          "Brainstorming high-intent tutorial ideas from new trending track releases",
          "Creating a repeatable batch-filming and rough-cut editing workflow",
          "Designing a sustainable weekly or bi-weekly publishing calendar",
        ],
        practiceNote: "Downloadable 30-day dance content calendar template.",
        statusBadge: "Strategy & Workflow",
      },
      {
        id: "creator-ch5",
        chapterNumber: 5,
        title: "Chapter 05 — Grow Your Audience",
        subtitle: "Packaging, discovery, and retention",
        topics: [
          "Designing clean, high-contrast thumbnails that capture movement",
          "Writing searchable titles without clickbait or deceptive claims",
          "Hooking viewers in the first 5 seconds and sustaining watch-time curves",
          "Interpreting YouTube Studio metrics: CTR, average percentage viewed, returning viewers",
        ],
        practiceNote: "Thumbnail and hook checklist before publishing any dance video.",
        statusBadge: "Core Module",
      },
      {
        id: "creator-ch6",
        chapterNumber: 6,
        title: "Chapter 06 — Monetize Your Channel",
        subtitle: "Ethical creator economics and business models",
        topics: [
          "YouTube Partner Program (YPP) criteria and ad-revenue fundamentals",
          "Partnering with music labels and indie artists for sponsored choreography reels",
          "Affiliate marketing for dancewear, shoes, studio lighting, and phone accessories",
          "Hosting private online workshops and masterclasses for your community",
          "Treating dance content as a long-term professional craft with ethical business practices",
        ],
        practiceNote: "Revenue stream roadmap outlining diverse creator income paths.",
        statusBadge: "Core Module",
      },
    ],
  },
];
