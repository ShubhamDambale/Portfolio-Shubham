import { PH, type Profile } from '@/types'

/**
 * Straight from `shubham_dambale_resume.pdf`.
 * The only derived value is the WhatsApp link (phone + assumed +91 country code) — see note below.
 */
export const profile: Profile = {
  name: 'Shubham Dambale',
  initials: 'SD',
  title: 'Full Stack Developer',
  roles: [
    'Full Stack Developer',
    'Java & Spring Boot Engineer',
    'React.js Developer',
    'REST API & Microservices Builder',
  ],
  location: 'Pune, India',
  email: 'shubhamdambale123@gmail.com',
  phone: '8999949450',
  tagline: 'I build scalable backend services and the interfaces that make them feel effortless.',
  summary:
    'Full Stack Developer with 2+ years of experience in Java, Spring Boot, React.js, REST APIs, and SQL. Skilled in building scalable backend services, responsive frontend applications, microservices, and CI/CD pipelines. Experienced with Agile development, database management, and performance optimization.',
  resumeUrl: '/resume/shubham-dambale-resume.pdf',
  availability: PH('Availability / notice period — not on the resume. Add it here to help recruiters.'),
  links: [
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:shubhamdambale123@gmail.com',
      handle: 'shubhamdambale123@gmail.com',
      icon: 'mail',
      primary: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      href: 'tel:+918999949450',
      handle: '+91 89999 49450',
      icon: 'phone',
      primary: true,
    },
    {
      id: 'whatsapp',
      // Derived from the resume phone number, assuming the +91 (India) country code.
      href: 'https://wa.me/918999949450',
      label: 'WhatsApp',
      handle: '+91 89999 49450',
      icon: 'whatsapp',
      primary: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      // The resume links the word "LinkedIn" but the extracted text does not expose the URL.
      href: PH('https://linkedin.com/in/<your-handle> — paste your real LinkedIn URL here'),
      handle: PH('LinkedIn profile URL not readable from the resume PDF'),
      icon: 'linkedin',
      primary: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: PH('https://github.com/<your-handle> — add your GitHub profile URL'),
      handle: PH('GitHub username is not listed on the resume'),
      icon: 'github',
      primary: true,
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      href: PH('https://<your-domain> — add your live portfolio URL once deployed'),
      handle: PH('Deploy this site, then paste the URL here'),
      icon: 'globe',
    },
    {
      id: 'location',
      label: 'Based in',
      href: 'https://maps.google.com/?q=Pune,India',
      handle: 'Pune, India',
      icon: 'pin',
    },
  ],
}

/** Interests / hobbies for Central Park — the resume does not list any. */
export const interests = [
  PH('Interests are not on the resume — add 3–5 (e.g. open source, chess, cricket, sketching).'),
]

/** Career objective for Central Park. Resume has a professional summary, not an objective. */
export const careerObjective = PH(
  'A one-paragraph career objective is not on the resume. Add what you want to build next — e.g. "Grow into a backend-heavy full stack role owning distributed services at scale."',
)

/** Soft skills — these ARE on the resume. */
export const softSkills = [
  'Problem Solving',
  'Communication',
  'Team Collaboration',
  'Agile Development',
]
