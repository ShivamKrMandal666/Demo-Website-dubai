// ---------------------------------------------------------------------------
// Central image manifest.
// All imagery lives in /public/images (optimized WebP-quality JPEGs) and is
// referenced ONLY from here, so image paths are never scattered across
// components. Folders: treatments/ (card images), heroes/ (detail-page hero
// backgrounds), backgrounds/ (home + treatments-page section backgrounds).
//
// Every image is a STATIC IMPORT rather than a string path. Two reasons:
//
//  1. No upscaling. next/image only knows an image's intrinsic size when it is
//     statically imported; with a bare string it assumes the source is huge and
//     generates srcset candidates all the way to w=3840. The sources here are
//     1264x848 (backgrounds/heroes) and 900x900 (cards), so those candidates
//     were re-encoding *upscaled* images — a 900px card was being served at
//     3840px, and texture-treatments.jpg grew from 239 KB to 308 KB. Static
//     imports cap the srcset at the real width.
//  2. The slug -> image link is checked at compile time. `TreatmentSlug` is
//     derived from the `treatments` array in lib/data/site.ts, and the Record
//     types below are keyed by it — so a treatment whose card or hero image is
//     missing, or whose slug is misspelled, is a build error rather than a
//     silent runtime undefined.
// ---------------------------------------------------------------------------
import type { StaticImageData } from "next/image";
import type { TreatmentSlug } from "@/lib/data/site";

// -- treatment card images (also reused on the individual detail page) -------
import cardInjectablesFillers from "@/public/images/treatments/injectables-fillers.jpg";
import cardLaserSkinResurfacing from "@/public/images/treatments/laser-skin-resurfacing.jpg";
import cardSignatureFacials from "@/public/images/treatments/signature-facials.jpg";
import cardBodyContouring from "@/public/images/treatments/body-contouring.jpg";
import cardRegenerativeAesthetics from "@/public/images/treatments/regenerative-aesthetics.jpg";
import cardSkinBoostersHydration from "@/public/images/treatments/skin-boosters-hydration.jpg";
import cardThreadLifts from "@/public/images/treatments/thread-lifts.jpg";
import cardChemicalPeels from "@/public/images/treatments/chemical-peels.jpg";
import cardHairRestoration from "@/public/images/treatments/hair-restoration.jpg";
import cardFacialContouringJawline from "@/public/images/treatments/facial-contouring-jawline.jpg";

// -- per-treatment detail-page hero backgrounds ------------------------------
import heroInjectablesFillers from "@/public/images/heroes/injectables-fillers.jpg";
import heroLaserSkinResurfacing from "@/public/images/heroes/laser-skin-resurfacing.jpg";
import heroSignatureFacials from "@/public/images/heroes/signature-facials.jpg";
import heroBodyContouring from "@/public/images/heroes/body-contouring.jpg";
import heroRegenerativeAesthetics from "@/public/images/heroes/regenerative-aesthetics.jpg";
import heroSkinBoostersHydration from "@/public/images/heroes/skin-boosters-hydration.jpg";
import heroThreadLifts from "@/public/images/heroes/thread-lifts.jpg";
import heroChemicalPeels from "@/public/images/heroes/chemical-peels.jpg";
import heroHairRestoration from "@/public/images/heroes/hair-restoration.jpg";
import heroFacialContouringJawline from "@/public/images/heroes/facial-contouring-jawline.jpg";

// -- section backgrounds -----------------------------------------------------
import bgTreatmentsHero from "@/public/images/backgrounds/treatments-hero.jpg";
import bgHero1 from "@/public/images/backgrounds/hero-1.jpg";
import bgHero2 from "@/public/images/backgrounds/hero-2.jpg";
import bgHero3 from "@/public/images/backgrounds/hero-3.jpg";
import bgTextureAbout from "@/public/images/backgrounds/texture-about.jpg";
import bgTextureTreatments from "@/public/images/backgrounds/texture-treatments.jpg";
import bgTextureTestimonial from "@/public/images/backgrounds/texture-testimonial.jpg";
import bgTextureFooter from "@/public/images/backgrounds/texture-footer.jpg";
import bgCtaBand from "@/public/images/backgrounds/cta-band.jpg";

// Both maps are keyed by TreatmentSlug, so adding a treatment to lib/data/site.ts
// without adding its two images — or misspelling either — fails
// `npm run typecheck`.
const cardImages: Record<TreatmentSlug, StaticImageData> = {
  "injectables-fillers": cardInjectablesFillers,
  "laser-skin-resurfacing": cardLaserSkinResurfacing,
  "signature-facials": cardSignatureFacials,
  "body-contouring": cardBodyContouring,
  "regenerative-aesthetics": cardRegenerativeAesthetics,
  "skin-boosters-hydration": cardSkinBoostersHydration,
  "thread-lifts": cardThreadLifts,
  "chemical-peels": cardChemicalPeels,
  "hair-restoration": cardHairRestoration,
  "facial-contouring-jawline": cardFacialContouringJawline,
};

const heroImagesBySlug: Record<TreatmentSlug, StaticImageData> = {
  "injectables-fillers": heroInjectablesFillers,
  "laser-skin-resurfacing": heroLaserSkinResurfacing,
  "signature-facials": heroSignatureFacials,
  "body-contouring": heroBodyContouring,
  "regenerative-aesthetics": heroRegenerativeAesthetics,
  "skin-boosters-hydration": heroSkinBoostersHydration,
  "thread-lifts": heroThreadLifts,
  "chemical-peels": heroChemicalPeels,
  "hair-restoration": heroHairRestoration,
  "facial-contouring-jawline": heroFacialContouringJawline,
};

// Per-treatment card image (also reused on the individual detail page)
export const treatmentCardImage = (slug: TreatmentSlug): StaticImageData => cardImages[slug];
// Per-treatment unique detail-page hero background
export const treatmentHeroImage = (slug: TreatmentSlug): StaticImageData => heroImagesBySlug[slug];

export const backgrounds = {
  treatmentsHero: bgTreatmentsHero,
  hero1: bgHero1,
  hero2: bgHero2,
  hero3: bgHero3,
  textureAbout: bgTextureAbout,
  textureTreatments: bgTextureTreatments,
  textureTestimonial: bgTextureTestimonial,
  textureFooter: bgTextureFooter,
  ctaBand: bgCtaBand,
} as const;

// Home-page aliases: the rotating hero backdrops and the per-section textures,
// named by the section that uses them.
export const heroImages: StaticImageData[] = [
  backgrounds.hero1,
  backgrounds.hero2,
  backgrounds.hero3,
];

export const textures = {
  about: backgrounds.textureAbout,
  treatments: backgrounds.textureTreatments,
  testimonial: backgrounds.textureTestimonial,
  footer: backgrounds.textureFooter,
  ctaBand: backgrounds.ctaBand,
} as const;
