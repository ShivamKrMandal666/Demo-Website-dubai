// ---------------------------------------------------------------------------
// Central image manifest.
// All imagery lives in /public/images (optimized WebP-quality JPEGs) and is
// referenced ONLY from here, so image paths are never scattered across
// components. Folders: treatments/ (card images), heroes/ (detail-page hero
// backgrounds), backgrounds/ (home + treatments-page section backgrounds).
// ---------------------------------------------------------------------------
const T = "/images/treatments";
const H = "/images/heroes";
const B = "/images/backgrounds";

export const treatmentSlugs = [
  "injectables-fillers",
  "laser-skin-resurfacing",
  "signature-facials",
  "body-contouring",
  "regenerative-aesthetics",
  "skin-boosters-hydration",
  "thread-lifts",
  "chemical-peels",
  "hair-restoration",
  "facial-contouring-jawline",
] as const;

// Per-treatment card image (also reused on the individual detail page)
export const treatmentCardImage = (slug: string): string => `${T}/${slug}.jpg`;
// Per-treatment unique detail-page hero background
export const treatmentHeroImage = (slug: string): string => `${H}/${slug}.jpg`;

export const backgrounds = {
  treatmentsHero: `${B}/treatments-hero.jpg`,
  hero1: `${B}/hero-1.jpg`,
  hero2: `${B}/hero-2.jpg`,
  hero3: `${B}/hero-3.jpg`,
  textureAbout: `${B}/texture-about.jpg`,
  textureTreatments: `${B}/texture-treatments.jpg`,
  textureTestimonial: `${B}/texture-testimonial.jpg`,
  textureFooter: `${B}/texture-footer.jpg`,
  ctaBand: `${B}/cta-band.jpg`,
} as const;
