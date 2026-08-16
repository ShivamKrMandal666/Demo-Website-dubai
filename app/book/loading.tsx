import { PageShellSkeleton } from "@/components/site/PageShellSkeleton";

// /book keeps a shorter hero than the browse routes — it is a task route, and a
// full-height hero pushes the first field past the fold.
export default function Loading() {
  return <PageShellSkeleton heroClassName="h-[42vh] min-h-[340px]" rows={1} />;
}
