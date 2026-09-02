// ---------------------------------------------------------------------------
// The five specialists. A LEAF module: it imports nothing, so a client
// component can pull `doctors` without dragging the rest of the site data in
// with it.
//
// That is the whole reason this is not in lib/data/site.ts any more. The home
// page's doctor carousel is a client component, and lib/data/site.ts cannot be
// tree-shaken — `export const treatmentSlugs = treatments.map(...)` is a
// module-scope call webpack has to evaluate, so importing ANY name from that
// file compiled all ten treatment records into the bundle too. On `/` that was
// ~288 lines of treatment prose shipped to the browser to render a carousel
// that never mentions a treatment.
//
// site.ts re-exports everything here, so server components can keep importing
// from `@/lib/data/site`. Client components must import from this file
// directly, or the re-export walks them straight back into site.ts.
// ---------------------------------------------------------------------------

/**
 * Shape of one doctor. Same arrangement as `Treatment` above: the arrays are
 * `readonly` and `slug` stays `string`, which is what lets the `doctors`
 * literal be declared `as const satisfies` and generate `DoctorSlug` from the
 * data instead of hand-listing it.
 */
export interface Doctor {
  slug: string;
  initials: string;
  name: string;
  credentials: string;
  /** Position at the clinic, shown under the name on /doctors. */
  role: string;
  specialty: string;
  /** Years in practice. */
  years: number;
  languages: readonly string[];
  /** Short pills — used by the Home carousel and the /doctors profile. */
  tags: readonly string[];
  /** Areas of clinical focus, listed on /doctors. */
  focus: readonly string[];
  /** Education and fellowship lines, listed on /doctors. */
  training: readonly string[];
  /** Short bio — the Home carousel shows this one. */
  bio: string;
  /** Longer philosophy paragraph. /doctors only. */
  approach: string;
}

// The five specialists. `as const satisfies` for the same reason as
// `treatments` above: it keeps each `slug` a literal, so `DoctorSlug` — and the
// portrait map in lib/images.ts that is keyed by it — is generated from this
// array rather than maintained alongside it.
export const doctors = [
  {
    slug: "elena-whitfield",
    initials: "EW",
    name: "Dr. Elena Whitfield",
    credentials: "MD, FRCS · Founder & Medical Director",
    role: "Founder & Medical Director",
    specialty: "Facial Harmonisation",
    years: 18,
    languages: ["English", "French"],
    tags: ["Facial Balancing", "Rhinomodelling", "Regenerative"],
    focus: [
      "Whole-face assessment and proportion",
      "Non-surgical rhinomodelling",
      "Advanced injectable correction",
      "Complication management and revision",
    ],
    training: [
      "MD, King's College London",
      "FRCS (Plast) — Royal College of Surgeons",
      "Fellowship in Facial Aesthetic Medicine, Paris",
    ],
    bio: "With over fifteen years in aesthetic medicine, Elena is known for an exacting, natural-first philosophy — treating the face as a whole, never a checklist.",
    approach:
      "Elena founded Maison Lumé on a simple conviction: the best aesthetic work is the work nobody can name. Every consultation begins with what a patient wants to feel rather than what they want to change, and she will decline a treatment as readily as she recommends one. She leads the clinic's peer review, where every complex plan is discussed by the full team before a needle is drawn.",
  },
  {
    slug: "marcus-adeyemi",
    initials: "MA",
    name: "Dr. Marcus Adeyemi",
    credentials: "MBBS, MRCP · Aesthetic Physician",
    role: "Aesthetic Physician",
    specialty: "Injectable Artistry",
    years: 11,
    languages: ["English", "Yoruba"],
    tags: ["Anti-wrinkle", "Lip Enhancement", "Profhilo"],
    focus: [
      "Expression-preserving anti-wrinkle treatment",
      "Lip definition and hydration",
      "Profhilo and bio-remodelling",
      "Preventative programmes for under-35s",
    ],
    training: [
      "MBBS, University of Manchester",
      "MRCP — Royal College of Physicians",
      "Advanced Injectables Diploma, London",
    ],
    bio: "Marcus blends a physician's precision with an artist's eye, specialising in subtle injectable work that reads as simply well-rested.",
    approach:
      "Marcus treats movement as part of the result, not something to be removed. He works in small, staged amounts and reviews at two weeks rather than committing everything in one sitting — an approach that takes longer and consistently produces the outcome patients actually asked for. He is the doctor most often requested by people having their first treatment.",
  },
  {
    slug: "sofia-marchetti",
    initials: "SM",
    name: "Dr. Sofia Marchetti",
    credentials: "MD · Dermatology & Laser",
    role: "Consultant Dermatologist",
    specialty: "Skin & Laser Medicine",
    years: 14,
    languages: ["English", "Italian", "Spanish"],
    tags: ["Pigmentation", "Resurfacing", "Rosacea"],
    focus: [
      "Melasma and stubborn pigmentation",
      "Fractional laser resurfacing",
      "Rosacea and reactive skin",
      "Medical-grade skincare protocols",
    ],
    training: [
      "MD, Università di Bologna",
      "Specialist Registration in Dermatology",
      "Laser & Energy-Based Devices Fellowship, Milan",
    ],
    bio: "A dermatologist by training, Sofia leads our laser and skin-health programmes, restoring clarity and tone through evidence-led protocols.",
    approach:
      "Sofia came to aesthetics from clinical dermatology, and it shows in how she sequences a course: skin is prepared for weeks before a laser is switched on, and every protocol is adjusted to how that particular skin actually responded, not to a standard schedule. She is the clinic's reference point for darker skin types and for anything that has been treated badly elsewhere.",
  },
  {
    slug: "jonathan-pryce",
    initials: "JP",
    name: "Dr. Jonathan Pryce",
    credentials: "MD · Regenerative Aesthetics",
    role: "Lead, Regenerative Medicine",
    specialty: "Regenerative Therapies",
    years: 16,
    languages: ["English"],
    tags: ["PRP", "Polynucleotides", "Biostimulators"],
    focus: [
      "Platelet-rich plasma for skin and scalp",
      "Polynucleotide skin quality programmes",
      "Collagen biostimulators",
      "Hair restoration protocols",
    ],
    training: [
      "MD, University of Edinburgh",
      "Diploma in Regenerative Aesthetic Medicine",
      "Clinical research in autologous therapies",
    ],
    bio: "Jonathan pioneers our regenerative approach, using the body's own signalling to improve skin quality gradually and durably.",
    approach:
      "Jonathan is the least interested of the five in an immediate result. His programmes are built around what skin looks like in six months, using the body's own repair signalling rather than added volume — which makes him the doctor patients see when they want to age well rather than look different. He keeps his own outcome data and will show it to you.",
  },
  {
    slug: "rami-haddad",
    initials: "RH",
    name: "Dr. Rami Haddad",
    credentials: "MBChB · Cosmetic Doctor",
    role: "Cosmetic Doctor",
    specialty: "Non-Surgical Rejuvenation",
    years: 12,
    languages: ["English", "Arabic", "German"],
    tags: ["Threads", "Skin Tightening", "Contouring"],
    focus: [
      "PDO and PLLA thread lifting",
      "Jawline and profile contouring",
      "Energy-based skin tightening",
      "Male aesthetic treatment",
    ],
    training: [
      "MBChB, American University of Beirut",
      "Advanced Thread Lift Certification, Seoul",
      "Facial Contouring Masterclass, Dubai",
    ],
    bio: "Rami focuses on non-surgical lifting and contouring, crafting refined, unhurried plans that respect each patient's natural architecture.",
    approach:
      "Rami's work is structural — he reads a face for where support has been lost before he considers where to add. Threads and contouring are unforgiving of a heavy hand, so he plans in stages across months and tells patients plainly when surgery would serve them better than anything he can offer. He runs the clinic's male aesthetics consultations.",
  },
] as const satisfies readonly Doctor[];

/**
 * A doctor as it actually exists in the data — `slug` is the literal union
 * rather than `string`. Use this for anything that feeds `doctorPortrait`.
 */
export type DoctorRecord = (typeof doctors)[number];

/** The five slugs, as a union. Generated — never hand-edit. */
export type DoctorSlug = DoctorRecord["slug"];

// Mirrors `getTreatmentBySlug` above. There is deliberately no /doctors/[slug]
// route, but /book?doctor=<slug> has to turn an untrusted query string into a
// real record — reading `.slug` off the result is what narrows it back to the
// literal union, so nothing needs to cast the raw param.
export const getDoctorBySlug = (slug: string): DoctorRecord | undefined =>
  doctors.find((d) => d.slug === slug);

