# Midnight Glass Design System

### 1. Overview & Creative North Star
**Creative North Star: The Editorial Architect**
Midnight Glass is a design system that prioritizes structural rhythm over decorative ornament. It is inspired by high-end architectural journals—utilizing aggressive whitespace, staggered masonry layouts, and sophisticated transparency to create a sense of depth and curated intent. 

The system breaks away from the "standard grid" by employing **Staggered Motion** and **Asymmetrical Weighting**. Elements do not simply appear; they reveal themselves with a calculated delay, emphasizing the individual importance of each piece of content.

### 2. Colors
The palette is rooted in a "Fidelity" blue, used sparingly as a high-contrast focus point against a monochromatic structural base.

- **The "No-Line" Rule:** Visual separation must be achieved through background shifts (e.g., transitioning from `surface` to `surface-container-low`) or spacing. 1px solid borders are strictly prohibited for primary sectioning.
- **Surface Hierarchy & Nesting:** Depth is created by "sinking" content into the canvas. Backgrounds use `surface` (#f9f9fb), while interactive cards use `surface-container-low` (#f3f3f5).
- **The "Glass & Gradient" Rule:** Navigation and floating panels must use Glassmorphism. The standard header utilizes a `backdrop-blur` of 24px with a 60% opacity surface fill to maintain context of the content beneath.
- **Signature Textures:** Primary CTAs leverage a "Luminous Depth" effect—using a primary color base with a 20% opacity shadow of the same hue to simulate a glow rather than a heavy drop shadow.

### 3. Typography
The system uses **Inter** across all scales to maintain a clean, modernist aesthetic. The hierarchy is driven by extreme weight variance and letter-spacing adjustments.

**Typographic Scale (Ground Truth):**
- **Display (Hero):** 4.5rem (72px) / Extrabold / -0.05em tracking. This is the "Editorial Statement" size used for main section headers.
- **Headline:** 3rem (48px) / Bold / -0.025em tracking.
- **Title:** 2.25rem (36px) / Semibold.
- **Body Large:** 1.25rem (20px) / Regular.
- **Body Standard:** 1.125rem (18px) / Regular.

The "Italic Accent" rule: Use primary-colored italics for the final word in a display heading to inject brand personality into static text.

### 4. Elevation & Depth
Elevation in Midnight Glass is expressed through **Tonal Layering** and **Atmospheric Shadows**.

- **The Layering Principle:** Instead of raising elements "up," we layer them using surface tiers. A `surface-container-highest` element feels closer to the user than a `surface` element.
- **Ambient Shadows:** The system uses extra-diffused shadows for interactive states. 
    - *Hover State:* `0 25px 50px -12px rgba(0, 0, 0, 0.25)` — this shadow is intentional and dramatic, emphasizing the "lift" of the portfolio cards.
- **Glassmorphism:** For overlays (like the Lightbox), use a `backdrop-blur-2xl` with a `black/80` background to completely isolate the content while maintaining the feeling of a physical environment.

### 5. Components
- **Buttons:** Fully rounded (pill-shaped). Primary buttons use the brand seed color with a high-contrast label. Interaction includes a subtle `scale-95` transform on click.
- **Cards (The Portfolio Unit):** 1rem (16px) corner radius. Cards should feature a "Reveal" animation—sliding up 40px with a 1s cubic-bezier ease.
- **Navigation:** A fixed, blurred glass bar. Icons should use the "Material Symbols Outlined" set with a weight of 400.
- **Masonry Grid:** Items must be arranged in a CSS column-based masonry layout (2 columns on mobile, 4 on desktop) to avoid the rigid rows of traditional grids.

### 6. Do's and Don'ts
- **Do:** Use `italic` spans in headlines to highlight key brand verbs.
- **Do:** Apply `transition-all` with a minimum duration of 300ms to all interactive elements for a "premium" feel.
- **Don't:** Use solid black (#000000) for text; use `on-surface` (#1a1c1d) to maintain tonal softness.
- **Don't:** Align all cards in a perfectly straight horizontal row; the "Editorial" look requires staggered vertical offsets.
- **Do:** Ensure all modal transitions use a scale-up/scale-down animation (`scale-90` to `scale-100`).