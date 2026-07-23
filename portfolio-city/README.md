# Shubham Dambale — Portfolio City 🌃

A world-class, interactive **3D miniature technology city** portfolio. Every building is a chapter
of my engineering story: the Company HQ is my experience, the Tech Park is my projects, the Skill
Bank holds my stack, and so on. Fly in, hover to explore, click to enter.

Built to impress recruiters in 30 seconds — and to stay honest: **every fact comes from my résumé**,
and anything the résumé doesn't cover is shown as a clearly-marked amber placeholder rather than
invented.

> Live demo: _add your deployed URL here_

---

## ✨ Highlights

- **Procedural 3D city** (React Three Fiber + Three.js) — roads, an instanced skyline, moving cars,
  drones, birds, clouds, walking people, street lights and traffic lights.
- **Cinematic camera** — a scripted fly-in on load, smooth GSAP tweens when you enter a building,
  and a gentle idle orbit.
- **Nine landmark districts**, each a distinct silhouette mapping to a portfolio section.
- **Day/night + weather** (clear / rain / snow) with a fully tweened lighting model.
- **Command palette** (`⌘K`), **minimap**, **full keyboard navigation**, **custom cursor**.
- **Synthesised audio** — ambient pad + UI blips via the Web Audio API (muted by default, no files).
- **Fireworks** when the résumé is downloaded 🎆.
- **Mobile**: WebGL is swapped for a lightweight **isometric SVG city** — all content stays reachable.
- **Adaptive quality** — auto-downgrades on weaker GPUs to protect the 60 FPS target.
- **SEO + a11y**: per-route meta/OG/JSON-LD, sitemap, robots, skip links, focus rings, reduced-motion
  support, `prefers-color-scheme`, and a `<noscript>` fallback.

## 🧱 Tech stack

React 19 · Vite · TypeScript · Three.js · React Three Fiber · Drei · React Three Postprocessing ·
GSAP · Framer Motion · Tailwind CSS v4 · React Router 7 · Zustand.

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # typecheck (tsc -b) + production build to /dist
npm run preview    # serve the production build locally
```

Requires **Node ≥ 20.19** (Vite 8).

## 🗂️ Project structure

```
public/
  resume/           # résumé PDF (served for download)
  models/           # (optional) Blender .glb slots — city is procedural by default
  textures/ audio/  # optional asset drop-zones (all runtime-generated today)
  404.html          # SPA deep-link fallback for GitHub Pages
  robots.txt sitemap.xml site.webmanifest favicon.svg og-image.svg
src/
  data/             # SINGLE SOURCE OF TRUTH — everything is derived from the résumé here
    profile.ts experience.ts projects.ts skills.ts growth.ts districts.ts
  types/            # domain types + the Placeholder ("PH") mechanism
  store/            # Zustand store (phase, theme, time, weather, quality, audio…)
  lib/              # sound, procedural textures, PRNG, analytics
  hooks/            # SEO, media queries, typewriter, keyboard + city navigation
  components/
    city/           # the 3D scene
      buildings/    #   nine landmark districts + shared parts
      props/        #   traffic, life (people/drones/birds/clouds), weather, static props
      CityCanvas · CityScene · CameraRig · Atmosphere · Ground · Skyline · Effects
      IsometricCity #   mobile fallback
    shell/          # loader, nav, minimap, command palette, dock, cursor, fireworks…
    ui/             # icons, primitives, content blocks, code + architecture renderers
  pages/            # one page per district (Home, Experience, Projects, …, Contact, 404)
  App.tsx main.tsx index.css
```

## 📝 Editing your content

All content lives in **`src/data/`** and is strongly typed. To update the site, edit those files —
no component changes needed.

**The placeholder system.** Anything not on the résumé is wrapped in `PH('…')` (see
`src/types/index.ts`) and renders as an amber, dashed "add this" chip. Search the codebase for
`PH(` to find every gap. Current known gaps to fill in:

- **`src/data/profile.ts`** — real **LinkedIn**, **GitHub** and **portfolio** URLs (the résumé links
  the words but the PDF text doesn't expose the URLs), plus availability, interests, career objective.
- **`src/data/projects.ts`** — the ESS Portal's **business problem, challenges, results, learnings**,
  **repo/demo links**, real **screenshots** (drop into `public/screenshots/` and update the paths),
  and real **code snippets** (the included ones are marked illustrative).
- **`src/data/growth.ts`** — **education** (the résumé PDF has no education section), **certifications**,
  and any **awards/badges**.
- **`src/data/skills.ts`** — the **Azure** vault is empty (not on the résumé); add real experience or
  remove it. Ditto a concrete usage example for **TypeScript**.

Replace the résumé PDF at `public/resume/shubham-dambale-resume.pdf` whenever you update it.

## 🎨 Design & controls

| Key | Action |
| --- | --- |
| `⌘K` / `/` | Search / command palette |
| `1`–`9` | Jump to a district |
| `←` `→` | Cycle building focus · `Enter` to open |
| `H` | Back to city overview |
| `N` · `W` · `T` · `M` | Day/night · weather · theme · mute |
| `?` | Keyboard shortcuts |

Audio is **muted by default** and only starts after a user gesture. Everything respects
`prefers-reduced-motion` and `prefers-color-scheme`.

## ⚡ Performance

- The 3D engine is a **lazy chunk** — the shell and hero paint before it loads.
- Static props (skyline, trees, lamps, cars, lane markings) are **instanced**: thousands of objects
  in dozens of draw calls.
- Textures are **generated on a canvas at runtime** (zero image bytes for the scene).
- A `PerformanceMonitor` **auto-adjusts quality**; low-power devices get the isometric fallback.
- Assets are pre-compressed to **brotli + gzip** at build time.

## 🌍 Deployment

### GitHub Pages (included workflow)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Push this project to a GitHub repo.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main`. Done.

- **User site** (`https://<user>.github.io/`): no config needed.
- **Project page** (`https://<user>.github.io/<repo>/`): set `VITE_BASE=/<repo>/` — uncomment the
  `env` block in the workflow and set it in the `npm run build` step.

`public/404.html` handles hard refreshes on client routes.

### Anywhere else (Vercel / Netlify / Cloudflare Pages / static host)

Build command `npm run build`, output directory `dist`. For SPA routing, add a rewrite of all paths
to `/index.html` (Vercel/Netlify do this automatically for SPAs; the `404.html` shim covers Pages).

## 📈 Analytics (optional, off by default)

No tracker is bundled unless you opt in. Copy `.env.example` → `.env` and set `VITE_ANALYTICS`
(`plausible` | `umami` | `ga4`). The script is injected lazily on idle and never in dev.

## 🧩 Swapping in Blender models

The city is procedural, but `public/models/README.md` documents how to drop in Draco-compressed
`.glb` assets and load them lazily with `useGLTF`.

## 📄 License

Personal portfolio of Shubham Dambale. Code is yours to reuse for your own portfolio; please replace
all personal content and the résumé.

---

Built with Claude Code.
