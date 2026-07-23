import { PH, type Skill, type SkillCategory } from '@/types'

/**
 * The Skill Bank has 12 vaults. Instead of invented percentage bars, each vault shows
 * **evidence**: the exact resume lines where the skill appears, and which roles/projects used it.
 * A skill that is not on the resume is marked `onResume: false` and rendered as an empty vault.
 */
export const skills: Skill[] = [
  {
    id: 'java',
    name: 'Java',
    category: 'Languages',
    vault: 1,
    accent: '#f89820',
    onResume: true,
    since: 'Oct 2023',
    summary:
      'Primary backend language across both roles — used for enterprise application development and API/backend modules.',
    evidence: [
      'Listed under Programming Languages on the resume.',
      'Alphavima: "Developed scalable enterprise applications using Java and Spring Boot following modern software engineering practices."',
      'Masai School: "Developed backend modules and APIs using Java, Spring Boot, Hibernate, and JDBC."',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: [] },
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'Backend',
    vault: 2,
    accent: '#6db33f',
    onResume: true,
    since: 'Oct 2023',
    summary:
      'Backbone of every backend surface on the resume: enterprise applications, HRMS/ESS REST services, and the ESS Portal API layer.',
    evidence: [
      'Listed under Backend Development, alongside Spring MVC, Spring Security and Spring Data JPA.',
      'Alphavima: scalable enterprise applications + RESTful APIs for HRMS and ESS platforms.',
      'Masai School: backend modules and APIs with Spring Boot, Hibernate and JDBC.',
      'ESS Portal: "Built scalable backend services and REST APIs using Spring Boot and PostgreSQL."',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: ['ess-portal'] },
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend',
    vault: 3,
    accent: '#61dafb',
    onResume: true,
    since: 'Oct 2023',
    summary:
      'Frontend of choice in both roles — Redux, Context API and Hooks for state, Tailwind CSS for responsive UI.',
    evidence: [
      'Listed under Frontend Development with Redux, Context API, Hooks and Tailwind CSS.',
      'Alphavima: "Developed responsive frontend interfaces using React.js, Redux, Hooks, and Tailwind CSS."',
      'Masai School: "Built frontend features using React.js and integrated APIs for seamless user experiences."',
      'ESS Portal: modern frontend dashboards and responsive UI components.',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: ['ess-portal'] },
  },
  {
    id: 'dotnet',
    name: '.NET / C#',
    category: 'Backend',
    vault: 4,
    accent: '#8a5cf6',
    onResume: true,
    since: 'Jul 2024',
    summary: 'Part of the current Alphavima stack, alongside the Java services.',
    evidence: [
      'C# listed under Programming Languages.',
      'Alphavima "Technologies / Skills Used": React, Tailwind CSS, Redux, Dotnet, C#, JavaScript.',
    ],
    usedIn: { experienceIds: ['alphavima'], projectIds: [] },
  },
  {
    id: 'azure',
    name: 'Azure',
    category: 'Cloud',
    vault: 5,
    accent: '#0ea5e9',
    onResume: false,
    since: PH('Not on the resume — add the year you started using Azure, if you have.'),
    summary: PH(
      'Azure does not appear anywhere on the resume. Either add real Azure experience (services used, what you deployed, any certification) or remove this vault from src/data/skills.ts.',
    ),
    evidence: [],
    usedIn: { experienceIds: [], projectIds: [] },
  },
  {
    id: 'sql',
    name: 'SQL & Databases',
    category: 'Databases',
    vault: 6,
    accent: '#38bdf8',
    onResume: true,
    since: 'Oct 2023',
    summary:
      'Relational modelling and query optimisation across MySQL, PostgreSQL and MongoDB; PostgreSQL schema design on the current platform.',
    evidence: [
      'Databases on the resume: MySQL, PostgreSQL, MongoDB. SQL also listed under Programming Languages.',
      'Alphavima: "Contributed to microservices-based architecture and database schema design using PostgreSQL."',
      'Masai School: "Designed relational database operations and optimized SQL queries for application performance."',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: ['ess-portal'] },
  },
  {
    id: 'rest-api',
    name: 'REST APIs',
    category: 'Backend',
    vault: 7,
    accent: '#22d3ee',
    onResume: true,
    since: 'Oct 2023',
    summary:
      'Designed, built and maintained the API layer for production HRMS and ESS platforms, and integrated them from the client side.',
    evidence: [
      'Listed under Backend Development.',
      'Alphavima: "Built and maintained RESTful APIs and backend services for HRMS and ESS platforms."',
      'Masai School: built and integrated APIs for seamless user experiences.',
      'ESS Portal: REST APIs listed in the project technology stack.',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: ['ess-portal'] },
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'Backend',
    vault: 8,
    accent: '#a78bfa',
    onResume: true,
    since: 'Jul 2024',
    summary: 'Contributor to a microservices-based architecture with PostgreSQL-backed schema design.',
    evidence: [
      'Listed under Backend Development.',
      'Alphavima: "Contributed to microservices-based architecture and database schema design using PostgreSQL."',
      'Professional summary: "building scalable backend services… microservices, and CI/CD pipelines".',
    ],
    usedIn: { experienceIds: ['alphavima'], projectIds: [] },
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Languages',
    vault: 9,
    accent: '#f7df1e',
    onResume: true,
    since: 'Oct 2023',
    summary: 'The language under every frontend on the resume, plus Node.js work at Masai School.',
    evidence: [
      'First entry under Programming Languages.',
      'Alphavima "Technologies / Skills Used" includes JavaScript.',
      'Masai School "Technologies / Skills Used" includes React.js and Node.js.',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: ['ess-portal'] },
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Languages',
    vault: 10,
    accent: '#3178c6',
    onResume: true,
    since: PH('Listed as a language, but no role or project on the resume names it. Add where you used it.'),
    summary:
      'Listed under Programming Languages on the resume. No role or project bullet references it yet — worth backing up with a concrete example.',
    evidence: ['Listed under Programming Languages: JavaScript, Java, C#, TypeScript, SQL.'],
    usedIn: { experienceIds: [], projectIds: [] },
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'DevOps & Tools',
    vault: 11,
    accent: '#f05033',
    onResume: true,
    since: 'Oct 2023',
    summary:
      'Daily version control plus peer code review, and the trigger surface for the CI/CD pipelines.',
    evidence: [
      'Listed under DevOps & Tools: Git, GitHub, GitHub Actions.',
      'Alphavima: "Participated in peer code reviews ensuring clean, maintainable, and production-quality code."',
      'ESS Portal technology stack lists Git.',
    ],
    usedIn: { experienceIds: ['alphavima', 'masai'], projectIds: ['ess-portal'] },
  },
  {
    id: 'devops',
    name: 'DevOps & CI/CD',
    category: 'DevOps & Tools',
    vault: 12,
    accent: '#34d399',
    onResume: true,
    since: 'Jul 2024',
    summary:
      'GitHub Actions pipelines for automated deployment and testing, Docker containerisation, Maven/NPM builds on Linux/Unix.',
    evidence: [
      'DevOps & Tools: Git, GitHub, GitHub Actions, Docker, Maven, NPM, Linux/Unix, Postman.',
      'Alphavima: "Implemented CI/CD workflows using GitHub Actions for automated deployment and testing."',
      'ESS Portal: "Implemented CI/CD deployment pipelines and containerized application services using Docker."',
    ],
    usedIn: { experienceIds: ['alphavima'], projectIds: ['ess-portal'] },
  },
]

/** The complete SKILLS block of the resume, verbatim, grouped as printed. */
export const skillMatrix: { category: SkillCategory | 'Soft Skills'; items: string[] }[] = [
  { category: 'Languages', items: ['JavaScript', 'Java', 'C#', 'TypeScript', 'SQL'] },
  {
    category: 'Frontend',
    items: ['React.js', 'Redux', 'Context API', 'Hooks', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    items: [
      'Spring Boot',
      'Hibernate',
      'JDBC',
      'Spring MVC',
      'Spring Security',
      'Spring Data JPA',
      'Microservices',
      'REST APIs',
    ],
  },
  { category: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB'] },
  {
    category: 'DevOps & Tools',
    items: ['Git', 'GitHub', 'GitHub Actions', 'Docker', 'Maven', 'NPM', 'Linux/Unix', 'Postman'],
  },
  {
    category: 'Soft Skills',
    items: ['Problem Solving', 'Communication', 'Team Collaboration', 'Agile Development'],
  },
]

export const getSkill = (id: string) => skills.find((s) => s.id === id)

/** Evidence strength drives the vault's visual weight — derived, never invented. */
export const skillWeight = (skill: Skill) =>
  skill.evidence.length + skill.usedIn.experienceIds.length + skill.usedIn.projectIds.length
