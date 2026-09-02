// ---------------------------------------------------------------------------
// Google reviews and the aggregate rating. A LEAF module, split from
// lib/data/site.ts for the same bundle reason as ./doctors: the reviews
// carousel on `/` is a client component, and any import from site.ts pulls the
// whole of it — treatments, doctors and all — because `treatmentSlugs` is a
// module-scope `.map()` webpack has to evaluate.
//
// site.ts re-exports these, so server components can keep importing from
// `@/lib/data/site`. Client components must import from here directly.
// ---------------------------------------------------------------------------

export interface Review {
  /** Stable React key. Display names collide too easily to key a carousel on. */
  id: string;
  quote: string;
  name: string;
  /** What they came in for — the card's second attribution line. */
  treatment: string;
  /** Whole stars, 1–5. Rendered per review, so these are not all 5. */
  rating: number;
  /** Relative recency, the way Google prints it. */
  when: string;
}

export interface GoogleRating {
  score: number;
  reviews: number;
}

// Eight, not three. The carousel shows three at a time on desktop and rotates by
// one, so anything under four would repeat a card inside a single view.
//
// PLACEHOLDER — invented reviews for the prototype. Replace with the real Google
// Business feed before launch; nothing here is a real customer.
export const reviews: Review[] = [
  {
    id: "isabelle-r",
    quote:
      "I finally look like myself — just rested. The team's restraint is everything; nothing overdone, everything considered.",
    name: "Isabelle R.",
    treatment: "Profhilo & Skin",
    rating: 5,
    when: "2 weeks ago",
  },
  {
    id: "daniel-m",
    quote:
      "From the consultation to aftercare it felt genuinely bespoke. The most natural results I've ever had, without question.",
    name: "Daniel M.",
    treatment: "Facial Harmonisation",
    rating: 5,
    when: "a month ago",
  },
  {
    id: "priya-n",
    quote:
      "A calm, beautiful space and doctors who actually listen. I trust them completely with my skin.",
    name: "Priya N.",
    treatment: "Laser Resurfacing",
    rating: 5,
    when: "a month ago",
  },
  {
    id: "helena-k",
    quote:
      "They talked me out of two things I'd asked for and suggested something subtler. I've never had a clinic do that before.",
    name: "Helena K.",
    treatment: "Injectables & Fillers",
    rating: 5,
    when: "2 months ago",
  },
  {
    id: "marcus-a",
    quote:
      "Booked for one session, stayed for the follow-up care. Everything was explained, nothing was rushed, and the result speaks quietly.",
    name: "Marcus A.",
    treatment: "Thread Lifts",
    rating: 5,
    when: "2 months ago",
  },
  {
    id: "sofia-l",
    quote:
      "Six weeks in and my skin still looks like it did the day I left. Worth every bit of the wait for an appointment.",
    name: "Sofia L.",
    treatment: "Chemical Peels",
    rating: 5,
    when: "3 months ago",
  },
  {
    id: "george-w",
    quote:
      "Genuinely excellent clinicians and a beautiful space. Only note is that parking nearby is a challenge — plan for the walk.",
    name: "George W.",
    treatment: "Regenerative Aesthetics",
    rating: 4,
    when: "3 months ago",
  },
  {
    id: "amara-o",
    quote:
      "The consultation alone was worth it. I left understanding my own skin better than I have in years.",
    name: "Amara O.",
    treatment: "Signature Facials",
    rating: 5,
    when: "4 months ago",
  },
];

export const googleRating: GoogleRating = { score: 4.9, reviews: 1247 };
