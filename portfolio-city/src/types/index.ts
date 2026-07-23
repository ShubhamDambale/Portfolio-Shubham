/**
 * Domain types for the portfolio.
 *
 * Everything the site renders comes from `src/data/*`. The resume is the single source of truth,
 * so anything that is NOT on the resume is wrapped in `PH()` and rendered with an obvious
 * "needs your input" treatment instead of being silently invented.
 */

export interface Placeholder {
  readonly __placeholder: true
  /** What the visitor sees, plus a hint about what to supply. */
  text: string
}

/** A string straight from the resume, or an explicitly-marked placeholder. */
export type Fact = string | Placeholder

/** Mark a value as "not on the resume — fill this in". */
export const PH = (text: string): Placeholder => ({ __placeholder: true, text })

export const isPlaceholder = (f: Fact): f is Placeholder =>
  typeof f === 'object' && f !== null && '__placeholder' in f

export const factText = (f: Fact): string => (isPlaceholder(f) ? f.text : f)

/* ------------------------------------------------------------------ profile */

export interface ProfileLink {
  id: string
  label: string
  href: Fact
  handle: Fact
  /** lucide-ish icon key resolved in `components/ui/Icon.tsx` */
  icon: 'mail' | 'linkedin' | 'github' | 'phone' | 'whatsapp' | 'globe' | 'file' | 'pin'
  /** Primary links get the loud treatment in the Airport (contact) district. */
  primary?: boolean
}

export interface Profile {
  name: string
  initials: string
  title: string
  /** Rotating strings for the hero typewriter. */
  roles: string[]
  location: string
  email: string
  phone: string
  summary: string
  /** One-line hook under the name. */
  tagline: string
  resumeUrl: string
  links: ProfileLink[]
  availability: Fact
}

/* --------------------------------------------------------------- experience */

export interface Experience {
  id: string
  company: string
  role: string
  employmentType: string
  start: string
  end: string
  /** Human label, e.g. "Jul 2024 — Present" */
  period: string
  locationType: string
  location: string
  responsibilities: string[]
  /** Quantified or explicitly notable lines pulled out of the resume bullets. */
  achievements: Fact[]
  technologies: string[]
  current?: boolean
}

/* ----------------------------------------------------------------- projects */

export interface ArchitectureNode {
  id: string
  label: string
  kind: 'client' | 'gateway' | 'service' | 'data' | 'infra' | 'external'
  detail: string
}

export interface ArchitectureEdge {
  from: string
  to: string
  label: string
}

export interface CodeSnippet {
  title: string
  language: string
  code: string
  note: Fact
}

export interface Screenshot {
  src: string
  alt: string
  caption: Fact
  placeholder?: boolean
}

export interface Project {
  id: string
  slug: string
  name: string
  role: string
  period: string
  /** Short line used on cards and in the 3D label. */
  blurb: string
  overview: string
  businessProblem: Fact
  solution: string
  features: string[]
  architecture: {
    summary: Fact
    nodes: ArchitectureNode[]
    edges: ArchitectureEdge[]
  }
  stack: string[]
  screenshots: Screenshot[]
  snippets: CodeSnippet[]
  challenges: Fact[]
  results: Fact[]
  learnings: Fact[]
  links: { github: Fact; demo: Fact }
  /** Where the office sits inside the Tech Park district (local metres). */
  office: [number, number]
  accent: string
}

/* ------------------------------------------------------------------- skills */

export type SkillCategory =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Databases'
  | 'DevOps & Tools'
  | 'Cloud'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  /**
   * How the site visualises depth. Derived ONLY from resume evidence
   * (how many roles / projects list the skill) — never an invented percentage.
   */
  evidence: string[]
  usedIn: { experienceIds: string[]; projectIds: string[] }
  /** First year the resume shows this skill in professional use. */
  since: Fact
  summary: Fact
  accent: string
  /** Vault ordering inside the Skill Bank. */
  vault: number
  onResume: boolean
}

/* ---------------------------------------------------- education / museum / lab */

export interface EducationEntry {
  id: string
  institution: Fact
  credential: Fact
  period: Fact
  detail: Fact
  note?: string
}

export interface Certification {
  id: string
  name: Fact
  issuer: Fact
  year: Fact
  credentialUrl?: Fact
}

export interface Achievement {
  id: string
  title: Fact
  context: Fact
  year: Fact
  kind: 'impact' | 'award' | 'badge' | 'certificate'
  source: 'resume' | 'placeholder'
}

export interface RoadmapItem {
  id: string
  title: string
  status: 'foundation' | 'building' | 'next'
  detail: Fact
  tags: string[]
}

/* ---------------------------------------------------------------- districts */

export type DistrictId =
  | 'hq'
  | 'tech-park'
  | 'skill-bank'
  | 'university'
  | 'ai-lab'
  | 'data-center'
  | 'museum'
  | 'central-park'
  | 'airport'

export interface District {
  id: DistrictId
  /** Building name shown on the floating label. */
  name: string
  /** What it maps to in resume terms. */
  subtitle: string
  route: string
  /** World-space footprint centre on the ground plane. */
  position: [number, number, number]
  /** Camera parking spot when the building is focused. */
  cameraPosition: [number, number, number]
  /** Point the camera looks at while focused. */
  cameraTarget: [number, number, number]
  accent: string
  glyph: string
  /** Search keywords for the command palette. */
  keywords: string[]
  /** Rough footprint used by the minimap + collision-free filler placement. */
  footprint: [number, number]
  order: number
}
