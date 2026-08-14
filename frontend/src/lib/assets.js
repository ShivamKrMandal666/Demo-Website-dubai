// Home-page background imagery, served from /public/images (optimized) via the
// central manifest in lib/images.js.
import { backgrounds } from "@/lib/images";

export const heroImages = [backgrounds.hero1, backgrounds.hero2, backgrounds.hero3];

export const textures = {
  about: backgrounds.textureAbout,
  treatments: backgrounds.textureTreatments,
  testimonial: backgrounds.textureTestimonial,
  footer: backgrounds.textureFooter,
  ctaBand: backgrounds.ctaBand,
};
