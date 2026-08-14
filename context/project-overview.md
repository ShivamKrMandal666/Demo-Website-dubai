# Aesthetic Clinic Website — Prototype

## Overview

A prototype aesthetic/cosmetic clinic website built as a pitch, to be sent via cold email to Dubai-based aesthetic clinics. It demonstrates build quality and design standard on dummy content. Real production features are added only after a clinic approves and signs on.

## Goals

1. A polished, fast, animation-rich prototype that wins clinic approval from a cold email
2. Codebase structured so post-approval features layer in cleanly without a rebuild
3. Consistent, reusable page structure (navbar, footer, map) across all 5 pages

## Core User Flow (prototype)

1. Visitor lands on Home
2. Browses Treatments → opens individual treatment detail pages
3. Views Doctors and Gallery
4. Reaches Contact / Book Appointment CTA (UI only — no backend yet)

## Features

### Prototype (current phase)

- Pages: Home, Treatments, Doctors, Contact, Gallery
- Dummy content and generated/placeholder images throughout
- "Book Appointment" CTA present but UI-only (not wired to a backend)
- Static Google Map and Google Ratings display blocks

### Post-Approval (future phase, not in current scope)

- CMS integration for client-editable content
- Google Tag Manager + GA4
- Supabase for backend and storage (appointments, consultations, media)
- Resend for appointment confirmation emails
- Arabic-English language toggle
- Client dashboard

## Scope

### In Scope (now)

- Frontend-only prototype, all 5 pages
- Dummy data and generated placeholder images

### Out of Scope (now)

- Any backend, database, or real booking logic
- CMS, analytics, transactional email, localization, dashboard — deferred until post-approval

## Success Criteria

1. Prototype is strong enough to send cold and win approval from a Dubai clinic
2. All 5 pages built and functional as a static, UI-only experience
3. Codebase structure supports adding post-approval features without restructuring