read @AGENTS.md first.

Build the Contact page and the Book Appointment flow. Both share the same underlying form pattern, using the optimistic-UI feature already built into this project.

SHARED FORM PATTERN
- Build a single reusable ConsultationForm component (shared components folder) used by both Contact and Booking, since they're functionally the same request form with different context.
- Fields: Name, Phone, Email, Preferred Treatment (dropdown/select), Preferred Doctor (optional, dropdown/select), Preferred date/time range (not a live calendar or specific slot picker — a general preference, e.g. a date field plus a "morning/afternoon/evening" preference), and a short Message field.
- No live calendar, no slot locking, no payment step anywhere in this flow — treat this strictly as a consultation request, not a confirmed booking.
- On submit: use optimistic UI — show an immediate success state (e.g. "Request received — our team will contact you within [X hours] to confirm your appointment") without waiting on a real backend response, since there's no backend wired up yet for this prototype.
- Use the existing reusable components and UI CSS variables for all form styling, buttons, inputs, and the success state — don't hardcode new styles.
- Handle basic client-side validation (required fields, valid email/phone format) with clear inline error states.

PART 1 — CONTACT PAGE
- Standard page: Navbar, Google Map, Footer reused as-is (same as Treatments/Doctors pages).
- Hero or header section introducing the page (short heading + supporting line — no CTA needed here beyond the form itself).
- The ConsultationForm, used here as a general enquiry — Preferred Treatment and Preferred Doctor fields are optional/blank by default (visitor can leave them unselected).
- Include clinic contact details near the form (phone, WhatsApp, email, address) if not already covered elsewhere — check ui-context first so this isn't duplicated with the footer.

PART 2 — BOOK APPOINTMENT FLOW
- "Book a Consultation" / "Book an Appointment" buttons across the site (Treatments page treatment cards, individual treatment pages, Doctors page doctor cards, Home page CTAs) should open the same ConsultationForm — either as a dedicated route (e.g. /book) or as a modal, your call on what fits the existing navigation pattern better.
- When triggered from a specific context, pre-fill the relevant field(s): from a treatment page → Preferred Treatment pre-filled; from a doctor's card → Preferred Doctor pre-filled. Visitor can still change these before submitting.
- Same optimistic success confirmation as the Contact form.
- Button copy across the site should say "Book a Consultation" (not "Book Now" or anything implying instant confirmation) to stay consistent with the consultation-request model, not instant self-booking.

Confirm with me whether Booking should be a dedicated page (/book) or a modal before finalizing the routing — don't decide that silently.