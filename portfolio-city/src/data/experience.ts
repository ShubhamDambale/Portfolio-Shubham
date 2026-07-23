import { PH, type Experience } from '@/types'

/** Verbatim from the WORK EXPERIENCE section of the resume. */
export const experiences: Experience[] = [
  {
    id: 'alphavima',
    company: 'Alphavima Technologies',
    role: 'Associate Engineer',
    employmentType: 'Full-time',
    start: 'Jul 2024',
    end: 'Present',
    period: 'Jul 2024 — Present',
    locationType: 'On-site',
    location: 'Ahmedabad',
    current: true,
    responsibilities: [
      'Developed scalable enterprise applications using Java and Spring Boot following modern software engineering practices.',
      'Built and maintained RESTful APIs and backend services for HRMS and ESS platforms.',
      'Developed responsive frontend interfaces using React.js, Redux, Hooks, and Tailwind CSS.',
      'Contributed to microservices-based architecture and database schema design using PostgreSQL.',
      'Optimized application performance and improved system reliability through debugging and code enhancements.',
      'Implemented CI/CD workflows using GitHub Actions for automated deployment and testing.',
      'Collaborated with product teams, designers, and developers in Agile sprint cycles.',
      'Participated in peer code reviews ensuring clean, maintainable, and production-quality code.',
    ],
    achievements: [
      'Shipped and maintained the REST API layer behind production HRMS and ESS platforms.',
      'Introduced GitHub Actions CI/CD workflows for automated deployment and testing.',
      'Improved application performance and system reliability through debugging and code enhancements.',
      PH('Add a metric to one of these — e.g. "cut p95 API latency from X ms to Y ms" or "reduced release time from X to Y". Recruiters scan for numbers.'),
    ],
    technologies: ['React', 'Tailwind CSS', 'Redux', 'Dotnet', 'C#', 'JavaScript'],
  },
  {
    id: 'masai',
    company: 'Masai School',
    role: 'Software Engineer',
    employmentType: 'Full-time',
    start: 'Oct 2023',
    end: 'Mar 2024',
    period: 'Oct 2023 — Mar 2024',
    locationType: 'Remote',
    location: 'Bangalore',
    responsibilities: [
      'Developed backend modules and APIs using Java, Spring Boot, Hibernate, and JDBC.',
      'Built frontend features using React.js and integrated APIs for seamless user experiences.',
      'Designed relational database operations and optimized SQL queries for application performance.',
      'Automated workflows reducing manual effort by 40% through process optimization.',
      'Worked in Agile development environments with active participation in sprint planning and reviews.',
      'Contributed to testing, debugging, and maintaining scalable application components.',
    ],
    achievements: [
      'Automated workflows that reduced manual effort by 40% through process optimization.',
      'Optimized SQL queries and relational database operations for application performance.',
    ],
    technologies: ['Java', 'Spring Boot', 'Hibernate', 'JDBC', 'React.js', 'Node.js', 'SQL'],
  },
]

/** Total professional span as stated in the resume summary. */
export const experienceHeadline = '2+ years'
