import profileImg from '/assets/profile.jpeg'

export const profile = {
  name: 'Shubham Dambale',
  initials: 'SD',
  profilePic: profileImg,
  headline: 'Associate Engineer · Full Stack Developer · Microsoft Dynamics 365 Business Central',
  location: 'Maharashtra, India',
  email: 'shubhamdambale123@gmail.com',
  phone: '+91 8999949450',
  linkedin: 'https://linkedin.com/in/shubham-dambale-115582202',
  github: 'https://github.com/ShubhamDambale',
  openToWork: true,
}

export const about = `Passionate Full Stack Developer and Associate Engineer with hands-on experience building enterprise-grade HR Management modules on Microsoft Dynamics 365 Business Central and creating dynamic web applications using React.js, .NET, and Spring Boot. I love bridging the gap between clean UI experiences and robust backend systems.

During my internship at Masai School, I built an AI-integrated Learning Management System that reduced mentor manual effort by 40% through automation and intelligent recommendation systems. I thrive in cross-functional teams and enjoy solving complex problems at scale.`

export const experience = [
  {
    id: 1,
    title: 'Associate Engineer',
    company: 'Alphavima Technologies',
    period: 'Jul 2024 – Present',
    location: 'Ahmedabad, India',
    gradientFrom: '#0a66c2',
    gradientTo: '#13a8e4',
    initials: 'AV',
    bullets: [
      'Developed and customized HR Management modules in Microsoft Dynamics 365 Business Central.',
      'Built frontend features for the ESS Portal using React.js, including dynamic dashboards and forms.',
      'Integrated RESTful APIs to support seamless communication between frontend and backend systems.',
      'Developed backend Web APIs using .NET and C# for the ESS Portal, including auth and scheduling.',
      'Implemented workflows using AL language for Business Central automation.',
      'Collaborated with cross-functional teams to ensure consistency across portals and ERP systems.',
    ],
    tags: ['React.js', '.NET', 'C#', 'Dynamics 365', 'AL Language', 'RESTful APIs'],
  },
  {
    id: 2,
    title: 'SDE Intern',
    company: 'Masai School',
    period: 'Oct 2023 – Mar 2024',
    location: 'Remote',
    gradientFrom: '#6a1b9a',
    gradientTo: '#ab47bc',
    initials: 'MS',
    bullets: [
      'Spearheaded the development of Smart LMS — an AI-integrated platform for adaptive learning.',
      'Built logic for personalized progress tracking and recommendation systems using Spring Boot.',
      'Integrated OpenAI and other APIs to support mentor feedback and real-time suggestions.',
      'Developed full-stack features: dashboards, schedules, and notification systems.',
      'Reduced mentor manual effort by 40% through automation and analytics.',
    ],
    tags: ['Spring Boot', 'Java', 'OpenAI API', 'MySQL', 'React.js'],
  },
]

export const skills = [
  { category: 'Languages',             items: ['Java', 'JavaScript', 'SQL', 'C#'] },
  { category: 'Frontend',              items: ['React.js', 'HTML5', 'CSS3', 'Responsive Design'] },
  { category: 'Backend & Architecture',items: ['Spring Boot', '.NET', 'Node.js', 'RESTful APIs', 'MVC Architecture', 'Microservices', 'JPA', 'Hibernate'] },
  { category: 'Databases',             items: ['MySQL', 'PostgreSQL', 'SQL Server'] },
  { category: 'Tools & DevOps',        items: ['Git', 'Docker', 'Maven', 'Postman', 'Visual Studio', 'IntelliJ'] },
  { category: 'ERP & Platforms',       items: ['Microsoft Dynamics 365 Business Central', 'AL Language'] },
  { category: 'Soft Skills',           items: ['Communication', 'Teamwork', 'Time Management', 'Problem Solving', 'Self-Learning'] },
]

export const projects = [
  {
    id: 1,
    emoji: '🧠',
    name: 'Smart LMS',
    desc: 'AI-integrated Learning Management System featuring adaptive learning paths, personalized progress tracking, and real-time mentor feedback using OpenAI APIs. Automated workflows reduced mentor manual effort by 40%.',
    tags: ['Spring Boot', 'React.js', 'OpenAI', 'MySQL'],
    github: 'https://github.com/ShubhamDambale',
    live: null,
  },
  {
    id: 2,
    emoji: '🏢',
    name: 'ESS Portal',
    desc: 'Employee Self-Service Portal with dynamic dashboards, leave management, and scheduling. Built with React.js frontend and .NET Web API backend, integrated with Dynamics 365 Business Central ERP.',
    tags: ['React.js', '.NET', 'C#', 'Dynamics 365'],
    github: 'https://github.com/ShubhamDambale',
    live: null,
  },
  {
    id: 3,
    emoji: '⚙️',
    name: 'HR Management Modules',
    desc: 'Custom HR automation modules for Microsoft Dynamics 365 Business Central using AL language, including attendance tracking, payroll workflows, and cross-portal data synchronization.',
    tags: ['AL Language', 'Dynamics 365', 'SQL Server'],
    github: 'https://github.com/ShubhamDambale',
    live: null,
  },
]

export const education = [
  {
    id: 1,
    emoji: '🎓',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Kurukshetra University, Haryana, India',
    year: 'Jul 2024 – Jul 2025',
  },
  {
    id: 2,
    emoji: '📘',
    degree: 'Post Graduate Diploma in Computer Applications (PGDCA)',
    institution: 'Kavi Kulguru Kalidas University, Nagpur, India',
    year: 'Jun 2023 – Jun 2024',
  },
]

export const certifications = [
  {
    id: 1,
    emoji: '🏆',
    title: '40% Efficiency Improvement',
    desc: 'Reduced mentor manual effort at Masai School through AI automation and analytics in Smart LMS',
    issuer: 'Masai School · 2024',
  },
  {
    id: 2,
    emoji: '⚡',
    title: 'Microsoft Dynamics 365 Business Central – AL Development',
    desc: 'Practical experience building custom ERP modules and automation workflows using AL Language',
    issuer: 'Alphavima Technologies · 2024',
  },
  {
    id: 3,
    emoji: '🤖',
    title: 'AI-Integrated Platform Development',
    desc: 'Led full-stack development of an AI-powered LMS integrating OpenAI APIs for adaptive learning',
    issuer: 'Masai School · 2023–2024',
  },
]
