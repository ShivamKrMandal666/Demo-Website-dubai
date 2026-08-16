// ---------------------------------------------------------------------------
// A one-signal channel between imperative navigations and the progress bar.
//
// <RouteProgress> starts itself from clicks on real <a> elements, which covers
// every Link on the site — treatment cards, "Discover", the footer's legal
// links. The primary navigation is not one of those: Navbar and Footer render
// <button>s and call router.push through useSiteNav, so no anchor is ever
// clicked and the bar would never start on the most-used path on the site.
//
// Hence an explicit signal rather than monkey-patching the router: useSiteNav
// announces that a navigation is beginning, and anything that cares can listen.
//
// Lives in lib/ rather than components/ so a client component can import it
// without pulling in React. app/gallery/ deliberately does not use it — the
// island navigates with its own router.push and shows no site chrome.
// ---------------------------------------------------------------------------

type Listener = () => void;

const listeners = new Set<Listener>();

/** Called by useSiteNav immediately before it pushes a route. */
export const startRouteProgress = (): void => {
  listeners.forEach((listener) => listener());
};

/** Returns an unsubscribe function, for use in a useEffect cleanup. */
export const onRouteProgressStart = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
