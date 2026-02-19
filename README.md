+-----------------------------------------------------------------------+
| **SAKSHAM SHAKYA**                                                    |
|                                                                       |
| Aspiring Full-Stack Developer \| MCA @ Lovely Professional University |
|                                                                       |
| linkedin.com/in/sakshamshakya India 🇮🇳                                |
+-----------------------------------------------------------------------+

  ----------------- ----------------- ----------------- -----------------
  **⚡ OPEN TO      **🎓 MCA          **📰 PUBLICATION: **🏛️ NSS
  WORK**            STUDENT**         SOCIO.IO**        PARLIAMENT
                                                        ACHIEVER**

  ----------------- ----------------- ----------------- -----------------

**1. Project Vision**

This futuristic developer portfolio was built to tell **Saksham
Shakya\'s story** --- from a school in Mainpuri, UP to publishing a
real-world browser extension (Socio.io), earning recognition as an NSS
Achiever who visited Parliament, and now pursuing an MCA at Lovely
Professional University. The site is designed as a **cinematic,
scroll-driven experience** that feels like stepping inside a futuristic
Indian tech hub.

  -----------------------------------------------------------------------
  Design Philosophy: \"Not just a portfolio --- a story of discipline,
  curiosity, and code. Rooted in India. Built for the world.\"

  -----------------------------------------------------------------------

**2. Technology Stack**

**Core Framework**

  ----------------- ----------------- ----------------- -----------------
  **Vanilla HTML5** **CSS3 Custom     **JavaScript      **Canvas API**
                    Properties**      ES2024**          

  ----------------- ----------------- ----------------- -----------------

**Animation & 3D Libraries**

+-----------------+-----------------+-----------------+-----------------+
| **Anime.js      | **Canvas API    | **CSS           | **Custom Cursor |
| v3.2.2**        | 2D**            | Animations**    | Engine**        |
|                 |                 |                 |                 |
| scroll-driven   | particle        | scan lines,     | 3-layer cursor  |
| entry           | networks,       | border glow,    | with different  |
| animations,     | Ashoka Chakra,  | orbit rings,    | lag multipliers |
| stagger         | hex grid,       | pulse, ticker   | for depth       |
| effects,        | mandala rings   | scroll          | illusion        |
| counters        |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

**Fonts & Design System**

  --------------------- -------------------------------------------------
  **Display / Heading** Orbitron (Google Fonts) --- futuristic geometric,
                        used for names & section titles

  **Body / UI**         Exo 2 --- clean sci-fi body font, highly readable
                        at all sizes

  **Monospace / Code**  Share Tech Mono --- terminal-style for tags,
                        labels, and code snippets

  **Primary Accent**    #00E5FF --- Electric Cyan (cursor, headings,
                        borders, glow)

  **Secondary Accent**  #FF9500 --- Amber / Saffron (role text,
                        certifications, India palette)

  **Success / Status**  #00FF88 --- Neon Green (online status,
                        availability badge)

  **Dark Background**   #04080F → #070D1A → #0B1425 (layered depth)

  **Light Background**  #EEF4FC → #E0EAF8 → #D2E0F4 (clean, airy light
                        mode)
  --------------------- -------------------------------------------------

**Deployment**

  ----------------- ----------------- ----------------- -----------------
  **Vercel          **Netlify**       **GitHub Pages**  **Any Static
  (Recommended)**                                       Host**

  ----------------- ----------------- ----------------- -----------------

**3. All Pages & Features**

  ---------------- ----------------- ------------------------------------------
                                     

  **🏠 Home**      /                 3-layer cursor, particle network canvas,
                                     mandala rings, hero entrance anime.js
                                     timeline, live photo, skills ticker,
                                     featured projects, blog preview

  **👤 About**     /about            Photo with scan-line FX, corner HUD
                                     overlays, sticky info table (email,
                                     university, publication, status), skill
                                     chips, animated stats

  **🎓 Education** /education        Diamond-gem timeline for MCA/BCA/School,
                                     active/dim timeline dots, certifications
                                     stack with hover glow, education badges

  **💼 Projects**  /projects         Filter bar (All/Full
                                     Stack/Frontend/Backend/Extension),
                                     hexagon-clipped cards, anime.js filter
                                     transitions, Socio.io as star project

  **🏆             /achievements     Animated counter stats (anime.js),
  Achievements**                     Parliament visit card, NSS achievement,
                                     publication, LinkedIn top skills
                                     recognition, dual-degree milestone

  **✍️ Blog**      /blogs            Table layout with numbered rows, live
                                     search input, category filter, date
                                     column, hover-arrow animation, 7 posts
                                     pre-populated

  **📬 Contact**   /contact          Real email/LinkedIn/portfolio links,
                                     availability badge, social links row,
                                     validated form, anime.js toast
                                     notification on submit
  ---------------- ----------------- ------------------------------------------

**4. Custom Cursor System**

The portfolio uses a **3-layer cursor** built entirely in JavaScript
with different lag multipliers for a parallax depth effect:

  --------------------- -------------------------------------------------
  **Layer 1 --- Dot**   Instant response (lag 1.0) --- 6px solid cyan
                        dot, sharp glow box-shadow, snaps exactly to
                        mouse

  **Layer 2 --- Ring**  Smooth lag (0.14) --- 34px translucent cyan
                        circle follows with gentle easing, expands on
                        hover

  **Layer 3 ---         Slowest lag (0.08) --- SVG crosshair with
  Crosshair**           concentric rings, creates depth of field illusion

  **Mouse Trail**       2 canvas particles per move event --- cyan/amber
                        sparks with opacity fade using RAF loop

  **Hover Expansion**   body.cursor-expand class --- dot & ring scale up
                        on all interactive elements for tactile feedback
  --------------------- -------------------------------------------------

**Cursor Code Pattern**

let mx=0, my=0, ox=0, oy=0, bx=0, by=0;

document.addEventListener(\'mousemove\', e =\> { mx=e.clientX;
my=e.clientY; dot.style.left=mx+\'px\'; \... });

function animCursor() {

ox += (mx-ox) \* 0.14; // ring lag

bx += (mx-bx) \* 0.08; // crosshair slower lag

outer.style.left = ox+\'px\'; blade.style.left = bx+\'px\';

requestAnimationFrame(animCursor);

}

**5. Anime.js Animations**

**Hero Entrance Timeline**

On page load and every time Home is revisited, a staggered anime.js
timeline fires:

-   First name fades up (700ms, easeOutExpo)

-   Last name follows 400ms later with cyan glow

-   Role text slides in from left (500ms)

-   Status badge scales from 0.8→1 (400ms)

-   CTA buttons fade up together (500ms)

-   Stats grid items stagger with 80ms delay each (500ms)

-   Photo frame scales from 0.95→1 simultaneously (600ms)

-   Stats count up from 0→target using innerHTML interpolation

**Project Filter Transitions**

When a filter button is clicked, all non-matching cards animate:

-   opacity 1→0.15 + scale 1→0.96 in 300ms easeOutQuad

-   Matching cards remain at full opacity and scale

-   pointer-events toggled to prevent interaction with dimmed cards

**Recurring / Loop Animations**

-   Logo hex glow: box-shadow pulses between none and full cyan glow (2s
    loop)

-   Nav pill shimmer: border-color cycles every 3 seconds

-   Scan-line flicker: opacity 0.5→0.9→0.5 on photo every 2.5s

-   Counter animation: anime innerHTML tween with round:1 for
    whole-number counting

-   Toast notification: translateY spring-in then fade-out after 4
    seconds

**6. Background Canvas System**

A full-viewport Canvas 2D animation runs continuously behind all pages:

  ------------------- ---------------------------------------------------
  **Particle          110 particles moving with slow random velocity,
  Network**           connected by lines when \< 120px apart with opacity
                      proportional to distance

  **Mandala Rings**   4 concentric rings of dots (8/12/18/24 dots)
                      rotating at different speeds and directions in the
                      top-right corner

  **Hex Grid**        Honeycomb pattern of hexagons (5×5 grid) rendered
                      in the bottom-left with 5% opacity cyan stroke

  **Radial Mesh       2 radial gradients (cyan top-right, amber
  Gradient**          bottom-left) layered for atmospheric depth

  **Blueprint Grid**  Faint 90px grid lines across full canvas at 3%
                      opacity for technical/blueprint aesthetic

  **Theme Aware**     Canvas opacity is 50% in dark mode, 30% in light
                      mode to maintain readability
  ------------------- ---------------------------------------------------

**7. Personal Data (from LinkedIn Profile)**

**Contact & Identity**

  --------------------- -------------------------------------------------
  **Full Name**         Saksham Shakya

  **Email**             sakshamshakya94@gmail.com

  **Portfolio**         sakshamshakya.tech

  **LinkedIn**          linkedin.com/in/sakshamshakya

  **Location**          India 🇮🇳

  **Tagline**           Aspiring Full-Stack Developer \| Dedicated
                        Student Building Real-World Skills \| Visited
                        Parliament As NSS Achiever

  **Publication**       Socio.io --- A Web Based Extension
  --------------------- -------------------------------------------------

**Education Timeline**

  --------------------- -------------------------------------------------
  **MCA (Current)**     Master of Computer Applications --- LPU, Punjab
                        (August 2025 -- August 2027)

  **B.Sc. CS**          Bachelor\'s Degree, Computer Science --- LPU,
                        Punjab (August 2022 -- June 2025)

  **High School**       High School Diploma --- Dr. Kiran Saujiya Senior
                        Secondary School, Mainpuri
  --------------------- -------------------------------------------------

**Top Skills (LinkedIn)**

  ----------------------- ----------------------- -----------------------
  **Next.js**             **Google API**          **Vercel**

  ----------------------- ----------------------- -----------------------

**8. Folder Structure**

  -----------------------------------------------------------------------
  Note: The current version is a single self-contained HTML file
  (saksham_portfolio.html) with all CSS, JS, and base64 photo embedded.
  The structure below represents the recommended React/Vite migration
  path.

  -----------------------------------------------------------------------

saksham-portfolio/

├── index.html ← Single-file version (current)

├── public/

│ ├── saksham.jpg ← Profile photo

│ └── favicon.ico

├── src/

│ ├── pages/

│ │ ├── Home.jsx

│ │ ├── About.jsx

│ │ ├── Education.jsx

│ │ ├── Projects.jsx

│ │ ├── Achievements.jsx

│ │ ├── Blogs.jsx

│ │ └── Contact.jsx

│ ├── components/

│ │ ├── Cursor.jsx ← 3-layer cursor system

│ │ ├── BgCanvas.jsx ← Particle network + mandala

│ │ ├── Navbar.jsx ← Pill nav with active states

│ │ └── TrailCanvas.jsx ← Mouse spark trail

│ ├── styles/

│ │ └── theme.css ← CSS custom properties (dark/light)

│ └── main.jsx

├── tailwind.config.js

├── vite.config.js

└── README.md

**9. Getting Started**

**Option A --- Single HTML File (Current)**

Open **saksham_portfolio.html** directly in any modern browser. No build
step required.

-   Works offline --- all assets embedded

-   Photo base64-encoded inside the file

-   CDN loaded: Anime.js + Google Fonts (needs internet for fonts)

**Option B --- React + Vite Migration**

-   npm create vite@latest saksham-portfolio \-- \--template react

-   npm install animejs tailwindcss \@types/animejs

-   npm install -D \@vitejs/plugin-react

-   npm run dev \# Start at localhost:5173

**10. Deployment Guide**

**Vercel (Recommended --- matches sakshamshakya.tech)**

-   Push to GitHub repository

-   Connect repo at vercel.com --- it auto-detects static HTML

-   Custom domain: Add sakshamshakya.tech in Vercel dashboard → DNS

-   Zero config for single HTML file deployment

**Netlify**

-   Drag & drop saksham_portfolio.html to netlify.com/drop

-   Or connect GitHub for auto-deploy on every git push

**11. Light / Dark Theme System**

Theme switching uses a single attribute toggle with CSS custom
properties for instant, smooth transitions:

\<html data-theme=\"dark\"\> \<!\-- or data-theme=\"light\" \--\>

:root { /\* DARK mode defaults \*/

\--bg: #04080F; \--c: #00E5FF; \--tx: #D6EEFF;

}

\[data-theme=\"light\"\] { /\* LIGHT mode overrides \*/

\--bg: #EEF4FC; \--c: #0077BB; \--tx: #081828;

}

The moon/sun toggle button flips data-theme and triggers an anime.js
opacity pulse for a smooth feel.

**12. Future Roadmap**

**Phase 1 --- Content**

-   Add real project screenshots and live demo links

-   Write and publish actual blog posts (Next.js, Google API, NSS
    journey)

-   Add downloadable PDF resume button

**Phase 2 --- Tech Upgrade**

-   Migrate to React 19 + Vite 6 + TypeScript

-   Integrate Framer Motion for page transitions

-   Add Three.js / React Three Fiber for true 3D globe

-   Backend: EmailJS or Supabase for contact form

**Phase 3 --- Features**

-   PWA support with service worker offline caching

-   Hindi / English language toggle (i18n)

-   AI chatbot: \"Ask Saksham\" powered by Claude API

-   GitHub contribution graph live embed

-   LeetCode stats widget

**13. Performance Notes**

+-----------------------------------------------------------------------+
| **Made with ⚡ in India 🇮🇳**                                          |
|                                                                       |
| Saksham Shakya \| sakshamshakya.tech \| MCA @ LPU, Punjab             |
|                                                                       |
| *\"Vasudhaiva Kutumbakam\" --- The World is One Family*               |
+-----------------------------------------------------------------------+
