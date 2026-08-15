// ---------------------------------------------------------------------------
// Static, typed dummy content for the prototype. No fetching, no database —
// every page reads from here (see context/architecture.md invariants).
// ---------------------------------------------------------------------------

export interface Clinic {
  name: string;
  tagline: string;
  established: number;
  phone: string;
  email: string;
  address: string;
  hours: string;
}

/**
 * Routes that actually exist in the App Router today. Widen this union when a
 * new route ships — never hand a NavLink a string.
 */
export type SupportedRoute = "/" | "/treatments";

/**
 * A nav link is either a "coming soon" placeholder, or a real destination that
 * MUST carry both the route it lives on and an in-page `scroll` target. The
 * union makes the inert-link bug unrepresentable: after the `soon` check,
 * `to` and `scroll` are both guaranteed.
 */
export type NavLink =
  | {
      label: string;
      /** Renders a "coming soon" toast instead of navigating. */
      soon: true;
    }
  | {
      label: string;
      soon?: false;
      /** Route the section lives on. Required — drives cross-page navigation. */
      to: SupportedRoute;
      /** In-page selector to smooth-scroll to once on `to`. Required. */
      scroll: string;
    };

export interface TimelinePhase {
  phase: string;
  text: string;
}

/** Width of the card on the Treatments page md 6-column grid. */
export type TreatmentSpan = 2 | 3 | 4;

/**
 * Shape of one treatment. The arrays are `readonly` so the `treatments` literal
 * below can be declared `as const` — that is what preserves the slug literals
 * and lets `TreatmentSlug` be derived from the data instead of hand-listed.
 */
export interface Treatment {
  n: number;
  slug: string;
  name: string;
  short: string;
  tagline: string;
  duration: string;
  sessions: string;
  downtime: string;
  results: string;
  overview: string;
  how: string;
  benefits: readonly string[];
  timeline: readonly TimelinePhase[];
  /** Appears in the Home "Signature Treatments" section. */
  home: boolean;
  span: TreatmentSpan;
}

export interface Doctor {
  initials: string;
  name: string;
  credentials: string;
  specialty: string;
  tags: string[];
  bio: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  treatment: string;
}

export interface GoogleRating {
  score: number;
  reviews: number;
}

export const clinic: Clinic = {
  name: "Maison Lumé",
  tagline: "Aesthetic & Cosmetic Clinic",
  established: 2009,
  phone: "+44 20 7946 0123",
  email: "hello@maisonlume.com",
  address: "24 Marchmont Row, Mayfair, London W1",
  hours: "Mon – Sat · 9:00 – 19:00",
};

// Single-page site for now: every live link scrolls to a section on "/".
// `Treatments` points at the Home section until the /treatments route ships.
export const navLinks: NavLink[] = [
  { label: "Home", to: "/", scroll: "#top" },
  { label: "Treatments", to: "/treatments", scroll: "#treatments" },
  { label: "Doctors", to: "/", scroll: "#doctors" },
  { label: "Gallery", soon: true },
  { label: "Contact", to: "/", scroll: "#contact" },
];

// The 10 treatments. `home: true` items appear in the Home "Signature
// Treatments" section (reusing the same generated card images). `span` drives
// the varied (non-uniform) grid on the Treatments page (md 6-col grid).
//
// `as const satisfies` rather than `: Treatment[]`: `satisfies` still type-checks
// every entry against Treatment, but `as const` keeps each `slug` as a literal,
// so TreatmentSlug / treatmentSlugs below are generated from this array. Adding,
// removing or renaming a treatment therefore updates the slug union, the static
// route list and the image-map exhaustiveness check in lib/images.ts by itself.
export const treatments = [
  {
    n: 1,
    slug: "injectables-fillers",
    name: "Injectables & Fillers",
    short: "Botox, dermal fillers and Profhilo for a naturally refreshed, expression-true result.",
    tagline: "Precision injectables that soften lines and restore volume — never frozen, always you.",
    duration: "30–45 min",
    sessions: "1 session, reviewed at 2 weeks",
    downtime: "Minimal — back to life the same day",
    results: "Visible in 3–14 days, lasting 3–12 months",
    overview:
      "Injectables and dermal fillers are the cornerstone of subtle facial rejuvenation. Botulinum toxin relaxes the muscles that etch expression lines, while hyaluronic-acid fillers replace lost volume and refine contour — restoring balance without changing what makes you, you.",
    how:
      "After a detailed facial assessment, your doctor maps the precise points to treat. Ultra-fine needles deliver small, measured amounts of product; the entire treatment is carried out in a single relaxed appointment with topical numbing for comfort.",
    benefits: [
      "Softer frown, forehead and eye lines",
      "Restored cheek and lip volume",
      "Natural, expression-true movement",
      "No general anaesthetic or surgery",
    ],
    timeline: [
      { phase: "Day 0", text: "Treatment takes 30–45 minutes with little to no downtime." },
      { phase: "Days 3–14", text: "Results settle and refine as any swelling subsides." },
      { phase: "3–12 months", text: "Effects gradually soften; a review keeps results consistent." },
    ],
    home: true,
    span: 4,
  },
  {
    n: 2,
    slug: "laser-skin-resurfacing",
    name: "Laser & Skin Resurfacing",
    short: "Fractional laser, IPL and pigmentation correction for luminous, even-toned skin.",
    tagline: "Advanced light-based therapies that resurface, brighten and rebuild skin from within.",
    duration: "45–60 min",
    sessions: "3–6 for best results",
    downtime: "24–72 hours of mild redness",
    results: "Progressive over 2–8 weeks",
    overview:
      "Our laser and light platforms treat pigmentation, fine lines, texture and redness by stimulating controlled renewal in the skin. Fractional resurfacing rebuilds collagen, while IPL targets sun damage and uneven tone for a clearer, more luminous complexion.",
    how:
      "A cooled handpiece delivers precisely calibrated energy tailored to your skin type and concern. Treatments are staged a few weeks apart so the skin can regenerate between sessions, building steady, natural improvement.",
    benefits: [
      "Reduced pigmentation and sun damage",
      "Smoother texture and refined pores",
      "Improved tone and radiance",
      "Collagen stimulation for firmer skin",
    ],
    timeline: [
      { phase: "Day 0", text: "Warmth and mild redness, similar to light sunburn." },
      { phase: "Week 1", text: "Skin renews; any flaking resolves within days." },
      { phase: "Weeks 2–8", text: "Tone evens and glow builds with each session." },
    ],
    home: true,
    span: 2,
  },
  {
    n: 3,
    slug: "signature-facials",
    name: "Signature Facials",
    short: "Bespoke medical-grade facials tailored to your skin's seasonal needs.",
    tagline: "Results-driven, deeply restorative facials designed around your skin — not a menu.",
    duration: "60 min",
    sessions: "Monthly, or as advised",
    downtime: "None",
    results: "Immediate glow, cumulative skin health",
    overview:
      "More than a spa treatment, our signature facials combine medical-grade actives, gentle exfoliation and expert massage to cleanse, hydrate and rebalance. Each is designed around your skin's condition on the day.",
    how:
      "Your therapist assesses your skin, then layers cleansing, exfoliation, extraction, active serums and masks, finishing with lymphatic massage and targeted LED to lock in results.",
    benefits: [
      "Deep hydration and instant radiance",
      "Balanced, decongested skin",
      "Relaxing, restorative experience",
      "Maintains the results of clinical treatments",
    ],
    timeline: [
      { phase: "Day 0", text: "Skin looks refreshed and luminous immediately." },
      { phase: "Days 1–7", text: "Hydration and texture continue to improve." },
      { phase: "Ongoing", text: "Monthly visits build lasting skin health." },
    ],
    home: true,
    span: 2,
  },
  {
    n: 4,
    slug: "body-contouring",
    name: "Body Contouring",
    short: "Non-surgical sculpting and skin tightening to refine and define.",
    tagline: "Sculpt, tighten and define — without surgery or downtime.",
    duration: "45–75 min",
    sessions: "4–8 for optimal shaping",
    downtime: "None to minimal",
    results: "Gradual over 6–12 weeks",
    overview:
      "Our body-contouring technologies reduce stubborn pockets of fat and tighten lax skin using targeted energy — helping to refine areas that resist diet and exercise, comfortably and without incisions.",
    how:
      "Applicators deliver controlled heating or cooling to the target area, prompting fat reduction and collagen contraction. Sessions are spaced across several weeks as your body naturally processes and refines the results.",
    benefits: [
      "Reduced stubborn fat pockets",
      "Firmer, tighter skin",
      "No surgery or anaesthetic",
      "Comfortable, walk-in walk-out sessions",
    ],
    timeline: [
      { phase: "Day 0", text: "Warmth or cooling during a comfortable session." },
      { phase: "Weeks 2–6", text: "The body gradually clears treated fat cells." },
      { phase: "Weeks 6–12", text: "Skin firms and contours become more defined." },
    ],
    home: true,
    span: 4,
  },
  {
    n: 5,
    slug: "regenerative-aesthetics",
    name: "Regenerative Aesthetics",
    short: "PRP, polynucleotides and biostimulators that work with your own biology.",
    tagline: "Harnessing your body's own repair signals for skin that improves over time.",
    duration: "45 min",
    sessions: "3, spaced 3–4 weeks apart",
    downtime: "24–48 hours",
    results: "Builds over 4–12 weeks",
    overview:
      "Regenerative aesthetics use the body's own healing biology — platelet-rich plasma, polynucleotides and biostimulators — to improve skin quality, elasticity and glow gradually and durably, rather than simply adding volume.",
    how:
      "Where PRP is used, a small blood sample is drawn and spun to concentrate growth factors, then reintroduced into the skin. Biostimulators and polynucleotides are delivered via fine needles to kick-start collagen over the following weeks.",
    benefits: [
      "Improved skin quality and elasticity",
      "Natural, gradual rejuvenation",
      "Uses your own biology (PRP)",
      "Complements injectables and lasers",
    ],
    timeline: [
      { phase: "Day 0", text: "Mild redness or pinpoint marks that settle quickly." },
      { phase: "Weeks 2–4", text: "Skin begins to look fresher and more elastic." },
      { phase: "Weeks 4–12", text: "Collagen matures for firmer, healthier skin." },
    ],
    home: true,
    span: 3,
  },
  {
    n: 6,
    slug: "skin-boosters-hydration",
    name: "Skin Boosters & Hydration Therapy",
    short: "Deep hydrating injectables that restore elasticity and radiance from within.",
    tagline: "Micro-droplets of hydration that rebuild bounce, glow and resilience.",
    duration: "30 min",
    sessions: "2–3 initial, then maintenance",
    downtime: "24 hours",
    results: "2–4 weeks, lasting months",
    overview:
      "Skin boosters deliver stabilised hyaluronic acid deep into the skin to hydrate from within, improving elasticity, fine lines and that lit-from-inside glow — ideal for face, neck and hands.",
    how:
      "A series of tiny injections distributes micro-droplets of hydrating product evenly across the treatment area, drawing and holding moisture while gently stimulating collagen.",
    benefits: [
      "Intense, long-lasting hydration",
      "Improved elasticity and bounce",
      "Softened fine lines",
      "Radiant, dewy complexion",
    ],
    timeline: [
      { phase: "Day 0", text: "Small bumps that settle within about a day." },
      { phase: "Weeks 2–4", text: "Hydration and glow become clearly visible." },
      { phase: "Months", text: "Effects last several months with top-ups." },
    ],
    home: false,
    span: 3,
  },
  {
    n: 7,
    slug: "thread-lifts",
    name: "Thread Lifts",
    short: "Dissolvable threads for a subtle, non-surgical lift and firmer contour.",
    tagline: "A refined, non-surgical lift that redefines contour and stimulates collagen.",
    duration: "45–60 min",
    sessions: "1, repeatable",
    downtime: "2–5 days",
    results: "Immediate lift, improving to 3 months",
    overview:
      "Thread lifts use fine, dissolvable sutures to gently reposition and support soft tissue, offering a subtle lift to the brow, cheeks, jawline or neck while stimulating long-term collagen along the thread path.",
    how:
      "Under local anaesthetic, threads are placed through tiny entry points and gently tensioned to lift and support. They dissolve over months, leaving behind a scaffold of new collagen.",
    benefits: [
      "Subtle, immediate lift",
      "Collagen stimulation over time",
      "No general anaesthetic or scarring",
      "Natural, refreshed contour",
    ],
    timeline: [
      { phase: "Day 0", text: "Immediate lift with some tightness and mild swelling." },
      { phase: "Days 2–14", text: "Swelling settles and the result looks natural." },
      { phase: "Months 1–3", text: "Collagen builds along the threads for lasting support." },
    ],
    home: false,
    span: 4,
  },
  {
    n: 8,
    slug: "chemical-peels",
    name: "Chemical Peels",
    short: "Medical-grade peels to resurface, brighten and smooth texture and tone.",
    tagline: "Medical-grade resurfacing that reveals brighter, smoother, renewed skin.",
    duration: "30–45 min",
    sessions: "3–6 in a course",
    downtime: "2–7 days depending on depth",
    results: "Visible from about 1 week",
    overview:
      "Chemical peels apply carefully selected acids to exfoliate the outer layers of skin, accelerating renewal to address pigmentation, congestion, fine lines and dull, uneven texture.",
    how:
      "After cleansing, the peel solution is applied and left for a controlled time before neutralising. Superficial peels have little downtime; medium peels prompt a few days of light flaking as fresh skin emerges.",
    benefits: [
      "Brighter, more even tone",
      "Smoother texture and refined pores",
      "Reduced congestion and breakouts",
      "Softened fine lines",
    ],
    timeline: [
      { phase: "Day 0", text: "Tingling and mild redness after application." },
      { phase: "Days 2–7", text: "Light flaking reveals fresher skin beneath." },
      { phase: "Weeks 2–6", text: "Tone and clarity improve across the course." },
    ],
    home: false,
    span: 2,
  },
  {
    n: 9,
    slug: "hair-restoration",
    name: "Hair Restoration",
    short: "PRP and growth-factor therapies to strengthen and revive thinning hair.",
    tagline: "Revive density and strength with growth-factor and PRP therapies.",
    duration: "45 min",
    sessions: "3–4 initial, then maintenance",
    downtime: "None",
    results: "Visible over 3–6 months",
    overview:
      "Our hair-restoration programme uses platelet-rich plasma and growth-factor therapies to nourish follicles, prolong the growth phase and improve density in areas of early thinning.",
    how:
      "Concentrated growth factors from your own blood (PRP) are delivered into the scalp via fine injections, stimulating dormant follicles. A course is followed by periodic maintenance.",
    benefits: [
      "Improved hair density and thickness",
      "Strengthened existing follicles",
      "Uses your own biology (PRP)",
      "No surgery or downtime",
    ],
    timeline: [
      { phase: "Day 0", text: "A quick session with no downtime." },
      { phase: "Months 1–3", text: "Shedding reduces and strands strengthen." },
      { phase: "Months 3–6", text: "Density and coverage visibly improve." },
    ],
    home: false,
    span: 3,
  },
  {
    n: 10,
    slug: "facial-contouring-jawline",
    name: "Facial Contouring & Jawline Sculpting",
    short: "Precision fillers and definers for a refined, balanced profile.",
    tagline: "Definition and balance for the jaw, chin and profile — sculpted with precision.",
    duration: "45 min",
    sessions: "1–2, reviewed at 2 weeks",
    downtime: "Minimal",
    results: "Immediate, refining over 2 weeks",
    overview:
      "Facial contouring uses structured fillers to define the jawline, chin and cheeks, improving profile balance and creating a sharper, more sculpted appearance — particularly effective for a soft or undefined jaw.",
    how:
      "Firmer, structural fillers are placed along the bone at precise points to add definition and projection. Your doctor sculpts gradually, reviewing balance from every angle.",
    benefits: [
      "Sharper, more defined jawline",
      "Improved chin and profile balance",
      "Structured, long-lasting result",
      "Tailored to your facial proportions",
    ],
    timeline: [
      { phase: "Day 0", text: "Immediate definition with possible minor swelling." },
      { phase: "Days 3–14", text: "Contours settle into a natural, sculpted line." },
      { phase: "12+ months", text: "Results are long-lasting with periodic review." },
    ],
    home: false,
    span: 3,
  },
] as const satisfies readonly Treatment[];

/**
 * A treatment as it actually exists in the data. Same fields as `Treatment`, but
 * `slug` is the literal union rather than `string` — use this for anything that
 * feeds `treatmentCardImage` / `treatmentHeroImage`.
 */
export type TreatmentRecord = (typeof treatments)[number];

/** The ten slugs, as a union. Generated — never hand-edit. */
export type TreatmentSlug = TreatmentRecord["slug"];

/** The ten slugs, as a list. Drives `generateStaticParams` for the detail route. */
export const treatmentSlugs: readonly TreatmentSlug[] = treatments.map((t) => t.slug);

export const getTreatmentBySlug = (slug: string): TreatmentRecord | undefined =>
  treatments.find((t) => t.slug === slug);

export const doctors: Doctor[] = [
  {
    initials: "EW",
    name: "Dr. Elena Whitfield",
    credentials: "MD, FRCS · Founder & Medical Director",
    specialty: "Facial Harmonisation",
    tags: ["Facial Balancing", "Rhinomodelling", "Regenerative"],
    bio: "With over fifteen years in aesthetic medicine, Elena is known for an exacting, natural-first philosophy — treating the face as a whole, never a checklist.",
  },
  {
    initials: "MA",
    name: "Dr. Marcus Adeyemi",
    credentials: "MBBS, MRCP · Aesthetic Physician",
    specialty: "Injectable Artistry",
    tags: ["Anti-wrinkle", "Lip Enhancement", "Profhilo"],
    bio: "Marcus blends a physician's precision with an artist's eye, specialising in subtle injectable work that reads as simply well-rested.",
  },
  {
    initials: "SM",
    name: "Dr. Sofia Marchetti",
    credentials: "MD · Dermatology & Laser",
    specialty: "Skin & Laser Medicine",
    tags: ["Pigmentation", "Resurfacing", "Rosacea"],
    bio: "A dermatologist by training, Sofia leads our laser and skin-health programmes, restoring clarity and tone through evidence-led protocols.",
  },
  {
    initials: "JP",
    name: "Dr. Jonathan Pryce",
    credentials: "MD · Regenerative Aesthetics",
    specialty: "Regenerative Therapies",
    tags: ["PRP", "Polynucleotides", "Biostimulators"],
    bio: "Jonathan pioneers our regenerative approach, using the body's own signalling to improve skin quality gradually and durably.",
  },
  {
    initials: "AO",
    name: "Dr. Amara Okafor",
    credentials: "MBChB · Cosmetic Doctor",
    specialty: "Non-Surgical Rejuvenation",
    tags: ["Threads", "Skin Tightening", "Contouring"],
    bio: "Amara focuses on non-surgical lifting and contouring, crafting refined, unhurried plans that respect each patient's natural architecture.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "I finally look like myself — just rested. The team's restraint is everything; nothing overdone, everything considered.",
    name: "Isabelle R.",
    treatment: "Profhilo & Skin",
  },
  {
    quote:
      "From the consultation to aftercare it felt genuinely bespoke. The most natural results I've ever had, without question.",
    name: "Daniel M.",
    treatment: "Facial Harmonisation",
  },
  {
    quote:
      "A calm, beautiful space and doctors who actually listen. I trust them completely with my skin.",
    name: "Priya N.",
    treatment: "Laser Resurfacing",
  },
];

export const googleRating: GoogleRating = { score: 4.9, reviews: 1247 };
