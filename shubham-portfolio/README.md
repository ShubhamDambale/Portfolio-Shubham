# Shubham Dambale — Portfolio

LinkedIn-style personal portfolio built with **Vite + React + Tailwind CSS**.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
npm run preview   # preview the production build
```

## 🗂 Folder Structure

```
shubham-portfolio/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json
├── .gitignore
│
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component — assembles all sections
    ├── index.css               # Tailwind directives + global styles & component classes
    │
    ├── data/
    │   └── portfolio.js        # ✏️  ALL your content lives here — edit this to update the site
    │
    ├── hooks/
    │   ├── useDarkMode.js      # Dark mode toggle with localStorage persistence
    │   └── useInView.js        # Intersection Observer for scroll-reveal animations
    │
    └── components/
        ├── Navbar.jsx          # Sticky nav with mobile hamburger menu
        ├── RevealCard.jsx      # Reusable animated card wrapper
        ├── ProfileCard.jsx     # Hero section — avatar, banner, badges, buttons
        ├── AboutSection.jsx    # Professional summary
        ├── ExperienceSection.jsx  # Work history with bullets & tech tags
        ├── SkillsSection.jsx   # Grouped skill badges
        ├── ProjectsSection.jsx # Project cards with hover effects
        ├── EducationSection.jsx
        ├── CertificationsSection.jsx
        └── ContactSection.jsx  # Contact cards + message form
```

## ✏️ How to Update Your Content

Open **`src/data/portfolio.js`** and edit the exported objects:
- `profile` — name, headline, location, social links
- `about` — bio paragraph(s)
- `experience` — add/remove jobs
- `skills` — add/remove skill groups
- `projects` — add/remove projects
- `education` — add/remove degrees
- `certifications` — add/remove achievements

## 🎨 Tech Stack

| Tool | Purpose |
|------|---------|
| Vite | Lightning-fast dev server & build tool |
| React 18 | UI framework |
| Tailwind CSS 3 | Utility-first styling |
| DM Sans | Body font |
| Playfair Display | Display / heading font |

## 🌙 Features

- Dark mode (persisted in localStorage, respects OS preference)
- Scroll-reveal animations via `IntersectionObserver`
- Mobile-first responsive layout
- Hamburger menu on mobile
- Hover animations on skill badges & project cards
- Contact form (wire up to EmailJS or Formspree for real email delivery)
