# Modern Landing Pharmacy Design

## Problem
The landing page still looks basic and lacks modern pharmacy-brand polish. The user wants a **clinica premium** look with stronger interactivity, replacing static/simple presentation with a richer first impression.

## Scope
- Redesign **landing + navbar** for home experience.
- Keep existing routes and business logic unchanged.
- Reuse existing product images already served by `/images/*`.

## Goals
1. Landing feels like a modern online pharmacy.
2. Stronger interactivity (hover/focus/touch feedback) without sacrificing accessibility.
3. Preserve current conversion path (catalog CTA and category links).

## UX Direction
- Style: **Clinica premium** (clean white surfaces, soft blue accents, subtle depth).
- Tone: trustworthy, calm, professional.
- Motion: subtle, purposeful, 180–220ms transitions.

## Information Architecture
1. **Hero (premium)**  
   - Clear value proposition, supporting text, main CTA to catalog.
   - Visual support with real product imagery.
2. **Category Grid (image-led)**  
   - Four category cards with real product images and category labels.
   - Click-through keeps current behavior: `/products?category=<cat>`.
3. **Benefits Section**  
   - Delivery speed, stock confidence, secure checkout.
4. **Trust Band**  
   - Lightweight trust markers/metrics to reinforce confidence.

## Interaction Design
- Category cards:
  - Hover: slight lift + soft shadow + subtle border tint.
  - Image micro-zoom on hover (transform only).
  - Keyboard: visible focus ring.
- CTA buttons:
  - Distinct hover/active states with no layout shift.
- Navbar:
  - Sticky premium top bar with soft blur/translucent background.
  - Scroll state slightly increases surface opacity for readability.
- Motion/accessibility:
  - Respect `prefers-reduced-motion`.
  - Interaction never depends on hover only.

## Technical Design
- Files to update:
  - `frontend/src/pages/LandingPage.tsx`
  - `frontend/src/components/Navbar.tsx`
  - `frontend/src/index.css`
- No new UI libraries.
- Keep hardcoded category image mapping (already accepted).
- Preserve fallback image behavior when image load fails.

## Data Flow
- No API/data model changes.
- Existing category metadata in landing remains the source for label/link/image.

## Error Handling
- If an image fails, card switches to neutral fallback image.
- Links remain functional regardless of image failure.

## Accessibility & Quality Checks
- Ensure text contrast meets AA on light surfaces.
- Keep focus-visible styling for keyboard navigation.
- Maintain clear tap targets on mobile.
- Verify no horizontal overflow on common breakpoints.

## Test Strategy
- Typecheck workspace after UI changes.
- Browser validation:
  - Landing sections render in order.
  - Category links navigate with correct query param.
  - Hover/focus states render correctly.
  - Mobile layout remains stable.

## Out of Scope
- Backend/API changes.
- Auth/cart/checkout redesign.
- New content management system for landing content.
