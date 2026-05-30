# soul:23 - Technical Specification

## 1. Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Customization |
|-----------|---------|---------------|
| Button | CTAs, submit | Custom accent outline/fill variants |
| Input | Form fields | Dark theme styling |
| Textarea | Description field | Dark theme styling |
| Select | Dropdowns (business type, needs) | Dark theme styling |

### Custom Components
| Component | Purpose | Notes |
|-----------|---------|-------|
| FrameOverlay | Persistent border frame + corner marks | Fixed, pointer-events:none |
| GrainOverlay | Film grain texture overlay | Fixed, low opacity |
| Navigation | Fixed top nav | Logo + links + CTA pill |
| PinnedSection | Wrapper for pinned scroll sections | Handles GSAP ScrollTrigger lifecycle |
| ServiceCard | Service panel with icon + title + bullets | Used in Services Deck |
| ProcessBlock | Process step block with micro flow | Used in Process Flow |
| ProjectCard | Case study project card | Image + metadata |
| TestimonialCard | Testimonial quote card | Quote + author |
| CollageImage | Gallery wall image piece | Handles entrance/exit animations |

### Hooks
| Hook | Purpose |
|------|---------|
| useScrollSnap | Global scroll snap for pinned sections |
| useReducedMotion | Respect prefers-reduced-motion |

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero load entrance (logo, frame, subline) | GSAP timeline | Auto-play timeline on mount | Medium |
| Hero scroll exit | GSAP ScrollTrigger | scrub timeline, exit phase only | Medium |
| Section 2: Split panel slide | GSAP ScrollTrigger | fromTo on left/right panels | Medium |
| Section 2: Headline stagger reveal | GSAP ScrollTrigger + SplitText | SplitText lines, stagger y+opacity | High |
| Section 2: Vertical rule draw | GSAP ScrollTrigger | scaleY 0→1 | Low |
| Section 3: Banner image slide | GSAP ScrollTrigger | fromTo y+opacity | Low |
| Section 3: Column cards stagger | GSAP ScrollTrigger | fromTo y+opacity, stagger 0.06 | Medium |
| Section 3: Column rule draw | GSAP ScrollTrigger | scaleY 0→1 per column | Low |
| Section 4: Collage images slide | GSAP ScrollTrigger | Per-image fromTo (x/y based on position) | Medium |
| Section 4: Center label scale | GSAP ScrollTrigger | scale+opacity | Low |
| Section 5: Headline entrance | GSAP ScrollTrigger | y+opacity | Low |
| Section 5: Image card slide+rotate | GSAP ScrollTrigger | x+rotate+opacity | Medium |
| Section 6: Panel wipe entrance | GSAP ScrollTrigger | y:100vh→0, stagger 0.07 | Medium |
| Section 6: Stacked labels slide | GSAP ScrollTrigger | x+opacity | Low |
| Section 7: Background wipe | GSAP ScrollTrigger | scaleX 1→0 (origin right) | Low |
| Section 7: Step blocks stagger | GSAP ScrollTrigger | y+opacity, stagger 0.08 | Medium |
| Section 7: Arrow draw | GSAP ScrollTrigger | scaleX 0→1 | Low |
| Section 8: Image card slide+rotate | GSAP ScrollTrigger | x+rotate+opacity | Medium |
| Section 8: Text block slide | GSAP ScrollTrigger | x+opacity | Low |
| Section 8: Watermark fade | GSAP ScrollTrigger | opacity+x | Low |
| Section 9: Flowing reveal | GSAP ScrollTrigger (trigger) | batch reveal on enter viewport | Low |
| Section 10: Footer reveal | GSAP ScrollTrigger (trigger) | y+opacity | Low |
| Global scroll snap | GSAP ScrollTrigger | Custom snap function targeting settle centers | High |

---

## 3. Animation Library Choices

### Primary: GSAP + ScrollTrigger
**Rationale**: 
- Pinned sections require precise scroll-linked timelines with scrub
- fromTo() ensures bidirectional playback for reverse scroll
- ScrollTrigger provides clean pin/unpin lifecycle management

### Optional: GSAP SplitText Plugin
**Rationale**:
- Section 2 headline benefits from per-line/word/character control
- Enables staggered text reveals

### Optional: Lenis (Smooth Scroll)
**Rationale**:
- Provides smoother scroll feel
- Must configure ScrollTrigger scrollerProxy if used

---

## 4. Project File Structure

```
app/
├── public/
│   ├── images/
│   │   ├── manifesto.jpg
│   │   ├── capabilities-banner.jpg
│   │   ├── collage-tl.jpg
│   │   ├── collage-tr.jpg
│   │   ├── collage-bl.jpg
│   │   ├── collage-br.jpg
│   │   ├── social-card.jpg
│   │   ├── case-study.jpg
│   │   └── grain.png
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn components
│   │   ├── FrameOverlay.tsx
│   │   ├── GrainOverlay.tsx
│   │   ├── Navigation.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── ProcessBlock.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── CollageImage.tsx
│   ├── sections/
│   │   ├── Section1Hero.tsx
│   │   ├── Section2Manifesto.tsx
│   │   ├── Section3Capabilities.tsx
│   │   ├── Section4Gallery.tsx
│   │   ├── Section5SocialProof.tsx
│   │   ├── Section6Services.tsx
│   │   ├── Section7Process.tsx
│   │   ├── Section8CaseStudy.tsx
│   │   ├── Section9Contact.tsx
│   │   └── Section10Footer.tsx
│   ├── hooks/
│   │   ├── useScrollSnap.ts
│   │   └── useReducedMotion.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. Dependencies

### Core (from init)
- react
- react-dom
- vite
- typescript
- tailwindcss
- @radix-ui/* (via shadcn)
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react

### Animation (to install)
- gsap (includes ScrollTrigger)

### Fonts (Google Fonts)
- Cormorant Garamond (600, 700)
- Inter (400, 500)
- IBM Plex Mono (400)

---

## 6. Key Technical Decisions

### Pinned Section Architecture
- Each pinned section component encapsulates its own ScrollTrigger
- useLayoutEffect for GSAP setup to prevent visual flash
- Cleanup on unmount to prevent ScrollTrigger leaks

### Global Scroll Snap
- Implement after all ScrollTriggers created
- Read pinned ranges from ScrollTrigger instances
- Snap only within pinned ranges (± small buffer)
- Use per-section settleRatio for snap target

### Responsive Pinned Sections
- On mobile: maintain pin but simplify animations
- Reduce motion distances (e.g., 50vw → 30vw)
- Stack layouts instead of side-by-side

### Performance
- will-change: transform on animated elements
- Use transform-only animations (no layout triggers)
- Lazy load images below fold
- Grain overlay as static PNG (not animated)

### Z-Index Stacking
- Section N gets z-index: N
- Ensures next section overlays during transitions
- Frame overlay always on top (z-index: 999)
