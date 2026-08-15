import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Local class merger, deliberately not `cn` from @/lib/utils.
 *
 * It is the same three lines over the same two npm packages, and duplication
 * would normally be the wrong call — but /gallery is specified as an island:
 * nothing in app/gallery/ may import from the site's shared modules, and
 * nothing here may be promoted back into them. Keeping this local is what makes
 * that property checkable at a glance rather than a matter of trust.
 *
 * twMerge is load-bearing here, not decoration: the cva variants below are
 * overridden per call site via `className`, and it is twMerge that decides the
 * later class wins instead of leaving both in the attribute.
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
