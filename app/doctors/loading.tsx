import { PageShellSkeleton } from "@/components/site/PageShellSkeleton";

// Three, matching the alternating full-width profiles that dominate this route.
export default function Loading() {
  return <PageShellSkeleton rows={3} />;
}
