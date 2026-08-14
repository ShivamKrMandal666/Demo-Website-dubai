import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first, WebP as the fallback for browsers that lack it. Measured
    // against WebP-only on the throttled mobile profile: identical FCP/LCP,
    // 64 KB less transferred — the extra AVIF decode cost does not show up.
    formats: ["image/avif", "image/webp"],
    // The largest source in public/images is 1264x848 (backgrounds and detail
    // heroes); the cards are 900x900. The default deviceSizes top out at 3840,
    // so a wide or high-DPR viewport was asking the optimizer to *upscale* —
    // re-encoding a 1264px source at 3840px, which made texture-treatments.jpg
    // grow from 239 KB to 308 KB. Capping the ladder at 1200 means no
    // candidate ever exceeds the source. Nothing is lost visually: the
    // previous CSS `background-image` already stretched that same 1264px file
    // across the full viewport.
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
  },
};

export default nextConfig;
