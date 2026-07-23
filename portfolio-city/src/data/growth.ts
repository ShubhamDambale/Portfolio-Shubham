import { PH, type Achievement, type Certification, type EducationEntry, type RoadmapItem } from '@/types'

/* ------------------------------------------------------------- University */

/**
 * Note: Masai School appears on the resume as an *employer* (Software Engineer, Oct 2023 – Mar 2024),
 * not as education — so it is deliberately NOT listed here.
 */
export const education: EducationEntry[] = [
  {
    id: 'mca',
    institution: 'Kurukshetra University, Haryana',
    credential: 'Master of Computer Applications (MCA)',
    period: '2024 — 2026',
    detail: 'CGPA: 9.0 / 10',
  },
]

export const certifications: Certification[] = [
  {
    id: 'cert-1',
    name: PH('No certifications are listed on the resume. Add any you hold (e.g. Oracle Java, Azure Fundamentals, Spring Professional).'),
    issuer: PH('Issuing body'),
    year: PH('Year'),
    credentialUrl: PH('Verification URL'),
  },
]

/** Learning journey — the parts that ARE evidenced by the resume timeline. */
export const learningJourney = [
  {
    year: 'Oct 2023',
    title: 'Software Engineer at Masai School',
    detail: 'Backend modules and APIs in Java, Spring Boot, Hibernate and JDBC; React.js on the frontend.',
    source: 'resume' as const,
  },
  {
    year: 'Mar 2024',
    title: 'Automation and SQL optimisation',
    detail: 'Automated workflows reducing manual effort by 40%; optimised SQL queries for performance.',
    source: 'resume' as const,
  },
  {
    year: 'Jul 2024',
    title: 'Associate Engineer at Alphavima Technologies',
    detail: 'Enterprise Java/Spring Boot applications, microservices architecture, GitHub Actions CI/CD.',
    source: 'resume' as const,
  },
  {
    year: 'Present',
    title: 'Lead Developer on the ESS Portal',
    detail: 'Owning an enterprise HRMS/ESS platform end to end, from PostgreSQL schema to Dockerised delivery.',
    source: 'resume' as const,
  },
]

/* --------------------------------------------------------- Achievement Museum */

export const achievements: Achievement[] = [
  {
    id: 'automation-40',
    title: 'Cut manual effort by 40% through workflow automation',
    context: 'Masai School — automated workflows and optimised processes (Oct 2023 – Mar 2024).',
    year: '2024',
    kind: 'impact',
    source: 'resume',
  },
  {
    id: 'ess-lead',
    title: 'Lead Developer on an enterprise HRMS / ESS platform',
    context: 'Alphavima Technologies — owning backend services, REST APIs, dashboards and CI/CD.',
    year: '2024 – Present',
    kind: 'impact',
    source: 'resume',
  },
  {
    id: 'cicd',
    title: 'Introduced automated deployment and testing pipelines',
    context: 'Implemented CI/CD workflows using GitHub Actions at Alphavima Technologies.',
    year: '2024',
    kind: 'impact',
    source: 'resume',
  },
  {
    id: 'award-placeholder',
    title: PH('No awards are listed on the resume — add any hackathon wins, spot awards or recognitions.'),
    context: PH('Who gave it, and for what.'),
    year: PH('Year'),
    kind: 'award',
    source: 'placeholder',
  },
  {
    id: 'badge-placeholder',
    title: PH('No badges/certificates on the resume — add coding-platform ranks, open-source badges, etc.'),
    context: PH('Platform and rank/level.'),
    year: PH('Year'),
    kind: 'badge',
    source: 'placeholder',
  },
]

/* ------------------------------------------------------------------ AI Lab */

/**
 * Forward-looking, explicitly NOT resume-backed. Everything here is framed as intent, and the
 * items the resume does support (cloud-adjacent DevOps, system design via microservices) are
 * called out separately so nothing reads as a claim of experience.
 */
export const roadmap: RoadmapItem[] = [
  {
    id: 'system-design',
    title: 'Distributed system design',
    status: 'foundation',
    detail:
      'Resume-backed starting point: microservices architecture, PostgreSQL schema design, and performance/reliability work at Alphavima.',
    tags: ['Microservices', 'PostgreSQL', 'Performance'],
  },
  {
    id: 'cloud',
    title: 'Cloud platforms',
    status: 'building',
    detail: PH(
      'The resume shows Docker + GitHub Actions but no cloud provider. Add the platform you are learning (AWS/Azure/GCP) and one thing you deployed on it.',
    ),
    tags: ['Docker', 'CI/CD', 'Containers'],
  },
  {
    id: 'ai',
    title: 'AI & LLM engineering',
    status: 'next',
    detail: PH(
      'Not on the resume. If you are learning this, name the concrete thing — e.g. "RAG service in Spring AI over the ESS knowledge base".',
    ),
    tags: ['LLMs', 'RAG', 'Prompt engineering'],
  },
  {
    id: 'observability',
    title: 'Observability & scale',
    status: 'next',
    detail: PH(
      'Not on the resume. Metrics, tracing and SLOs are the natural next step after "optimized application performance and improved system reliability".',
    ),
    tags: ['Tracing', 'Metrics', 'SLOs'],
  },
]

export const aiLabNote =
  'This wing is a roadmap, not a résumé claim. Anything without resume evidence is marked as a placeholder.'
