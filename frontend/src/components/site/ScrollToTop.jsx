import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll to the top on every route change (unless a targeted in-page
// scroll was requested via navigation state, which the page handles itself).
export const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (state && state.scrollTo) return;
    const id = setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname, state]);
  return null;
};
