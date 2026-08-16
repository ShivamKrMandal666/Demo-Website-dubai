import { PageShellSkeleton } from "@/components/site/PageShellSkeleton";

// The detail hero is 60vh, shorter than the 62vh browse routes.
export default function Loading() {
  return <PageShellSkeleton heroClassName="h-[60vh] min-h-[440px]" rows={2} />;
}
