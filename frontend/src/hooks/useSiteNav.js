import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { scrollToId } from "@/hooks/useSmoothScroll";

// Route-aware navigation shared by the Navbar and Footer.
// - links with `to` navigate between pages (carrying an optional scroll target)
// - links with only `scroll` smooth-scroll within the current page
// - links with `soon` show a friendly toast
export function useSiteNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateLink = useCallback(
    (link) => {
      if (link.soon) {
        toast("Gallery is on its way", {
          description: "This page is coming soon — check back shortly.",
        });
        return;
      }
      if (link.to) {
        if (link.to === location.pathname) {
          scrollToId(link.scroll || "#top");
        } else {
          navigate(link.to, link.scroll ? { state: { scrollTo: link.scroll } } : undefined);
        }
        return;
      }
      if (link.scroll) scrollToId(link.scroll);
    },
    [navigate, location.pathname],
  );

  const goToTreatment = useCallback((slug) => navigate(`/treatments/${slug}`), [navigate]);

  return { navigateLink, goToTreatment, pathname: location.pathname };
}
