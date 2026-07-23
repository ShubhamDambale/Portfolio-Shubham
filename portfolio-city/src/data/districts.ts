import type { District, DistrictId } from '@/types'

/**
 * The city map. One building per portfolio section.
 *
 * Coordinate system: +X east, +Z south, ground plane at y = 0. The city reads north (museum) to
 * south (airport), with Central Park at the heart. `cameraPosition` / `cameraTarget` are the
 * parking spots the cinematic camera tweens to when a district is focused.
 */
export const districts: District[] = [
  {
    id: 'hq',
    name: 'Company HQ',
    subtitle: 'Work experience',
    route: '/experience',
    position: [-38, 0, -34],
    cameraPosition: [-22, 24, -10],
    cameraTarget: [-38, 10, -34],
    accent: '#38e8ff',
    glyph: '🏢',
    keywords: ['experience', 'work', 'alphavima', 'masai', 'associate engineer', 'career', 'job', 'hq'],
    footprint: [16, 16],
    order: 1,
  },
  {
    id: 'tech-park',
    name: 'Tech Park',
    subtitle: 'Projects',
    route: '/projects',
    position: [34, 0, -36],
    cameraPosition: [20, 22, -14],
    cameraTarget: [34, 6, -36],
    accent: '#7c5cff',
    glyph: '🧩',
    keywords: ['projects', 'ess', 'portal', 'hrms', 'case study', 'work samples', 'tech park'],
    footprint: [26, 26],
    order: 2,
  },
  {
    id: 'skill-bank',
    name: 'Skill Bank',
    subtitle: 'Skills & tooling',
    route: '/skills',
    position: [-42, 0, 8],
    cameraPosition: [-26, 18, 24],
    cameraTarget: [-42, 7, 8],
    accent: '#34d399',
    glyph: '🏦',
    keywords: ['skills', 'java', 'spring boot', 'react', 'sql', 'devops', 'vault', 'stack', 'bank'],
    footprint: [20, 16],
    order: 3,
  },
  {
    id: 'university',
    name: 'University',
    subtitle: 'Education & certifications',
    route: '/education',
    position: [42, 0, 6],
    cameraPosition: [26, 18, 22],
    cameraTarget: [42, 7, 6],
    accent: '#f5a524',
    glyph: '🎓',
    keywords: ['education', 'degree', 'college', 'certification', 'learning', 'university'],
    footprint: [20, 16],
    order: 4,
  },
  {
    id: 'central-park',
    name: 'Central Park',
    subtitle: 'About me',
    route: '/about',
    position: [0, 0, 6],
    cameraPosition: [0, 15, 30],
    cameraTarget: [0, 3, 6],
    accent: '#4ade80',
    glyph: '🌳',
    keywords: ['about', 'bio', 'avatar', 'objective', 'interests', 'hobbies', 'me', 'park'],
    footprint: [30, 26],
    order: 5,
  },
  {
    id: 'airport',
    name: 'Airport',
    subtitle: 'Contact & resume',
    route: '/contact',
    position: [2, 0, 76],
    cameraPosition: [2, 20, 100],
    cameraTarget: [2, 3, 76],
    accent: '#60a5fa',
    glyph: '✈️',
    keywords: ['contact', 'email', 'resume', 'download', 'linkedin', 'github', 'whatsapp', 'hire', 'airport'],
    footprint: [34, 22],
    order: 6,
  },
]

export const districtById = (id: DistrictId) => districts.find((d) => d.id === id)!
export const districtByRoute = (route: string) =>
  districts.find((d) => route === d.route || route.startsWith(d.route + '/'))

/** World bounds used by the minimap and the camera clamp. */
export const cityBounds = { minX: -70, maxX: 70, minZ: -70, maxZ: 100 }

/** Where the cinematic camera starts and where it settles after the fly-in. */
export const cameraStart: [number, number, number] = [-14, 170, 210]
export const cameraHome: [number, number, number] = [0, 62, 108]
export const cameraHomeTarget: [number, number, number] = [0, 4, 6]
