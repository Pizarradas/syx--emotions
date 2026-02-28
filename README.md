# SYX Design System

![License: MIT](https://img.shields.io/badge/License-MIT-7c3aed.svg)
![Version](https://img.shields.io/badge/version-3.0.3-7c3aed)
![CSS](<https://img.shields.io/badge/CSS-@layer%20%7C%20color--mix()-informational>)
![Sass](https://img.shields.io/badge/Sass-Dart%20Sass-CC6699?logo=sass)

> A modern, token-driven SCSS design system built on Atomic Design principles.  
> Zero external CSS dependencies. Dart Sass native.  
> Built by **José Luis Pizarro Feo**

---

## What is SYX?

SYX is a **premium, component-first design system** engineered for high-fidelity, Awwwards-tier web experiences. It bridges the gap between the mathematical safety of a strict design system and the uncompromised creative freedom of raw SCSS + GSAP.

**Core Capabilities:**
- A **3-layer token architecture** (Primitive → Semantic → Component) for extreme theming.
- **The Emotion Engine**: Client-side, instant `<html data-theme="joy|anger|sadness">` contextual styling via CSS variables.
- **Awwwards-Ready Components**: Out-of-the-box support for GSAP Infinite Marquees, Cursor-tracking Image Galleries, and 60fps Parallax tracking.
- An **Atomic Design component hierarchy** (Atoms → Molecules → Organisms) driven by BEM methodology.
- **CSS `@layer`** for specificity management without a single `!important`.
- **Fluid typography** with `clamp()` on every scale step.

---

## Quick Start

### Option A — Zero install (use the compiled CSS)

Download or clone the repo, then link the CSS directly in your HTML:

```html
<!-- The Emotions Theme contains all premium components -->
<link rel="stylesheet" href="css/styles-theme-emotions.css" />

<!-- REQUIRED: two classes on <body> and a data-theme to trigger the Emotion Engine -->
<html data-theme="joy">
<body class="syx syx--theme-emotions">
  <!-- Use SYX components -->
  <button class="atom-btn atom-btn--primary atom-btn--filled atom-btn--size-md">
    Click me
  </button>
</body>
</html>
```

Open `index.html` in your browser to see the full live Awwwards-tier demo.

---

### Option B — Build from SCSS with npm

```bash
npm install
npm run build        # compiles all themes
npm run build:core   # compiles minimal production bundle (styles-core.css)
npm run build:prod   # compiles + runs PurgeCSS
npm run watch        # watches SCSS for changes
```

### Option C — Dart Sass CLI directly

```bash
sass scss/styles-theme-emotions.scss css/styles-theme-emotions.css --style=compressed --no-source-map
```

---

## Project Structure

```
syx/
│
├── scss/                        # All source SCSS
│   ├── abstracts/               # Tokens, mixins, functions, maps
│   │   ├── tokens/
│   │   │   ├── primitives/      # Raw values (colors, spacing, fonts)
│   │   │   ├── semantic/        # Contextual aliases (color-primary, etc.)
│   │   │   └── components/      # Per-component tokens (btn, form, header…)
│   │   ├── mixins/              # 15 SYX native mixins
│   │   ├── functions/
│   │   └── maps/
│   │
│   ├── base/                    # Reset, elements, helpers
│   ├── atoms/                   # 19 atomic components
│   ├── molecules/               # 4 composite components
│   ├── organisms/               # 6 complex components
│   ├── layout/                  # Grid system
│   ├── utilities/               # Display, spacing, text utilities
│   ├── pages/                   # Page-specific styles
│   │
│   ├── styles-core.scss         # Minimal production bundle entry point
│   └── themes/                  # Theme definitions
│       ├── _shared/             # Shared core + bundles
│       ├── _template/           # Template for new themes
│       └── emotions/            # The Emotions Demo (Dynamic Theming & GSAP)
│
├── css/                         # Compiled output
├── fonts/                       # Self-hosted webfonts
├── img/                         # Images and icons
├── js/                          # Vanilla JS Logic (GSAP triggers, localstorage)
│
├── index.html                   # Live Demo: The Tech Portal
├── article.html                 # Read Demo: The Article Page
└── BLUEPRINT.md                 # Architectural Philosophy Document
```

---

## Documentation

| Document                                                                | Description                           |
| ----------------------------------------------------------------------- | ------------------------------------- |
| [BLUEPRINT.md](BLUEPRINT.md)                                            | The SYX Architectural Philosophy (vs Tailwind/React) |
| [ARCHITECTURE.md](scss/ARCHITECTURE.md)                                 | Technical architecture deep-dive      |
| [GETTING-STARTED.md](scss/GETTING-STARTED.md)                           | Step-by-step guide for new developers |
| [abstracts/mixins/README.md](scss/abstracts/mixins/README.md)           | Complete mixin reference              |
| [abstracts/tokens/TOKEN-GUIDE.md](scss/abstracts/tokens/TOKEN-GUIDE.md) | Token system guide                    |
| [CONTRIBUTING.md](scss/CONTRIBUTING.md)                                 | Contribution guidelines               |
| [themes/\_template/README.md](scss/themes/_template/README.md)          | How to create a new theme             |

---

## Key Concepts

### Token Layers

```
Primitive  →  Semantic  →  Component
#3B82F6       color-primary  btn-primary-bg
```

Never use primitive tokens directly in components. Always go through semantic → component.

### Mixin Usage

```scss
// Always use SYX mixins instead of raw CSS
@include transition(color 0.2s ease); // not: transition: color 0.2s ease;
@include absolute(
  $top: 0,
  $right: 0
); // not: position: absolute; top: 0; right: 0;
@include padding(1rem null); // not: padding-top: 1rem; padding-bottom: 1rem;
```

### CSS @layer Stack

```
syx.reset → syx.base → syx.tokens → syx.atoms → syx.molecules → syx.organisms → syx.utilities
```

Utilities always win over components. No `!important` needed.

---

## Themes

| Theme       | Primary Color  | Capabilities |
| ----------- | -------------- | ------------ |
| emotions    | Dynamic (6x)   | GSAP Parallax, Masonry Maze, Hover Galleries, ScrollTrigger |
| `_template` | Neutral (core) | Clean foundational slate for new brands |
| `_shared`   | N/A            | Contains the Atomic Design components |

---

## Score (Feb 2026)

**93/100** — Architecture, tokens, theming, atomic design, mixin library, dark-mode, accessibility utilities, and `@layer` specificity management all production-ready.  
Roadmap to 100: Organisms expansion + Public documentation site.
