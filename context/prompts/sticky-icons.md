read @AGENTS.md first.

Add sticky contact icons (WhatsApp + Phone) that appear on every page of the site.

BEHAVIOR
- Two floating icon buttons, positioned on the right side of the viewport, stacked vertically.
- Fixed/sticky positioning — they stay in the same screen position regardless of scroll position or which page is loaded (Home, Treatments, individual treatment pages, Doctors, Contact).
- Exception: on the Gallery page specifically, these icons must NOT appear at all — hide them completely while on /gallery, and have them reappear normally the moment the visitor navigates away from Gallery to any other page.
- Since Gallery is already isolated from the shared layout (no navbar/footer/map), place this component in the shared root layout the way you would the Navbar, but explicitly exclude it from the Gallery route the same way Gallery already excludes Navbar/Footer/Map.

FUNCTIONALITY
- WhatsApp icon: opens a WhatsApp chat link (wa.me style link with a placeholder number for now — I'll swap in the real number later).
- Phone icon: triggers a quick call via a tel: link (placeholder number for now).
- Neither icon opens the appointment/consultation form — that stays reserved for the "Book a Consultation" flow. These two icons are only for quick WhatsApp chat or quick phone call, not detailed booking.

DESIGN
- Use the existing reusable components and UI CSS variables — don't hardcode new colors or one-off styles, this component should feel consistent with the rest of the site (unlike Gallery, which is intentionally isolated).
- Add a subtle hover effect and shadow consistent with how other interactive elements on the site already behave.
- Make sure the icons don't overlap or collide with other fixed/sticky elements already on the page (e.g. Gallery's back button on its own route, any other fixed UI).
- Keep it responsive — icons should reposition or resize sensibly on mobile so they don't block content or the Gallery back button.

Build this as its own reusable component in the shared components folder, since it's used site-wide (excluding Gallery).