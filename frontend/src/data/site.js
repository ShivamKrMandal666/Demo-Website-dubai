export const clinic = {
  name: "Maison Lumé",
  tagline: "Aesthetic & Cosmetic Clinic",
  established: 2009,
  phone: "+44 20 7946 0123",
  email: "hello@maisonlume.com",
  address: "24 Marchmont Row, Mayfair, London W1",
  hours: "Mon – Sat · 9:00 – 19:00",
};

export const navLinks = [
  { label: "Home", target: "#top" },
  { label: "Treatments", target: "#treatments" },
  { label: "Doctors", target: "#doctors" },
  { label: "Gallery", target: "#gallery", soon: true },
  { label: "Contact", target: "#contact" },
];

export const treatments = [
  {
    n: 1,
    name: "Injectables & Fillers",
    desc: "Botox, dermal fillers and Profhilo for a naturally refreshed, expression-true result.",
    feature: true,
  },
  {
    n: 2,
    name: "Laser & Skin Resurfacing",
    desc: "Fractional laser, IPL and pigmentation correction for luminous, even-toned skin.",
  },
  {
    n: 3,
    name: "Signature Facials",
    desc: "Bespoke medical-grade facials tailored to your skin's seasonal needs.",
  },
  {
    n: 4,
    name: "Body Contouring",
    desc: "Non-surgical sculpting and skin tightening to refine and define.",
  },
  {
    n: 5,
    name: "Regenerative Aesthetics",
    desc: "PRP, polynucleotides and biostimulators that work with your own biology.",
    wide: true,
  },
];

export const doctors = [
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

export const testimonials = [
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

export const googleRating = { score: 4.9, reviews: 1247 };
