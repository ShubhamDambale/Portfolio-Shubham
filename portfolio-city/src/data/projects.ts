import { PH, type Project } from '@/types'

/**
 * The resume lists exactly ONE project (Employee Self-Service Portal), so exactly one office in
 * the Tech Park is occupied. Everything below that is not printed on the resume is wrapped in
 * `PH()` and rendered as an obvious "fill me in" card — nothing here is invented as fact.
 */
export const projects: Project[] = [
  {
    id: 'ess-portal',
    slug: 'ess-portal',
    name: 'Employee Self-Service (ESS) Portal',
    role: 'Lead Developer',
    period: 'Jul 2024 — Present',
    blurb: 'Enterprise HRMS + ESS platform with workflow automation.',
    accent: '#38e8ff',
    office: [-6, -4],
    overview:
      'Designed and developed an enterprise HRMS and Employee Self-Service platform with workflow automation features. The system pairs scalable Spring Boot services and REST APIs over PostgreSQL with modern React.js dashboards, and ships through containerised CI/CD pipelines.',
    businessProblem: PH(
      'The resume states what was built, not the business pain behind it. Add 2–3 sentences: which manual HR process was slow or error-prone, how many employees it touched, and what it cost the business.',
    ),
    solution:
      'A single self-service platform where employees and HR operate on the same data: Spring Boot services expose REST APIs backed by PostgreSQL, React.js + Tailwind CSS dashboards consume them, authentication and role-based access control gate every workflow, and Docker + CI/CD pipelines move changes to production automatically.',
    features: [
      'Enterprise HRMS and Employee Self-Service workflows with automation.',
      'Scalable backend services and REST APIs built on Spring Boot and PostgreSQL.',
      'Modern, responsive dashboards and UI components in React.js and Tailwind CSS.',
      'Authentication and role-based access control across enterprise workflows.',
      'Real-time enterprise workflow handling.',
      'Containerised services and CI/CD deployment pipelines using Docker.',
      'System integration plus performance optimisation for enterprise-scale operations.',
    ],
    architecture: {
      summary:
        'A layered service architecture: a React SPA talks REST to Spring Boot services that own their PostgreSQL schema, with auth/RBAC in front of every route and Docker-based CI/CD carrying builds to the runtime environment.',
      nodes: [
        { id: 'spa', label: 'React.js SPA', kind: 'client', detail: 'React.js, Redux, Hooks, Tailwind CSS dashboards and responsive UI components.' },
        { id: 'auth', label: 'Auth & RBAC', kind: 'gateway', detail: 'Authentication plus role-based access control guarding enterprise workflows.' },
        { id: 'api', label: 'REST API layer', kind: 'service', detail: 'Spring Boot REST endpoints for HRMS + ESS operations.' },
        { id: 'workflow', label: 'Workflow engine', kind: 'service', detail: 'Automation for approval and self-service flows, driven in real time.' },
        { id: 'db', label: 'PostgreSQL', kind: 'data', detail: 'Relational schema design for employee, org and workflow data.' },
        { id: 'ci', label: 'CI/CD + Docker', kind: 'infra', detail: 'Containerised services with automated build/test/deploy pipelines.' },
      ],
      edges: [
        { from: 'spa', to: 'auth', label: 'signed session' },
        { from: 'auth', to: 'api', label: 'authorised request' },
        { from: 'api', to: 'workflow', label: 'dispatch' },
        { from: 'api', to: 'db', label: 'JPA / SQL' },
        { from: 'workflow', to: 'db', label: 'state' },
        { from: 'ci', to: 'api', label: 'deploy' },
        { from: 'ci', to: 'spa', label: 'deploy' },
      ],
    },
    stack: [
      'React.js',
      'Tailwind CSS',
      'REST APIs',
      'Git',
      'Postman',
      'Spring Boot',
      'PostgreSQL',
      'Docker',
    ],
    screenshots: [
      {
        src: '/screenshots/placeholder.svg',
        alt: 'Placeholder for the ESS Portal employee dashboard',
        caption: PH('Employee dashboard — export a real screenshot (blur any private data) to /public/screenshots.'),
        placeholder: true,
      },
      {
        src: '/screenshots/placeholder.svg',
        alt: 'Placeholder for the ESS Portal approval workflow screen',
        caption: PH('Approval workflow view — replace with a real capture.'),
        placeholder: true,
      },
      {
        src: '/screenshots/placeholder.svg',
        alt: 'Placeholder for the ESS Portal admin / RBAC configuration screen',
        caption: PH('Admin & role configuration — replace with a real capture.'),
        placeholder: true,
      },
    ],
    snippets: [
      {
        title: 'Role-guarded REST endpoint (Spring Boot)',
        language: 'java',
        note: PH('Illustrative of the pattern described on the resume — swap in a real (sanitised) excerpt from the repo.'),
        code: `@RestController
@RequestMapping("/api/v1/leave-requests")
class LeaveRequestController {

  private final LeaveRequestService service;

  LeaveRequestController(LeaveRequestService service) {
    this.service = service;
  }

  @PostMapping
  @PreAuthorize("hasRole('EMPLOYEE')")
  ResponseEntity<LeaveRequestResponse> raise(
      @Valid @RequestBody LeaveRequestCommand command,
      @AuthenticationPrincipal EmployeePrincipal principal) {

    LeaveRequestResponse created = service.raise(principal.employeeId(), command);
    return ResponseEntity
        .created(URI.create("/api/v1/leave-requests/" + created.id()))
        .body(created);
  }

  @PatchMapping("/{id}/approval")
  @PreAuthorize("hasRole('MANAGER')")
  ResponseEntity<LeaveRequestResponse> decide(
      @PathVariable UUID id,
      @Valid @RequestBody ApprovalDecision decision) {

    return ResponseEntity.ok(service.decide(id, decision));
  }
}`,
      },
      {
        title: 'Typed API hook (React + Redux)',
        language: 'tsx',
        note: PH('Illustrative of the React/Redux/Hooks stack listed on the resume — replace with real code.'),
        code: `export function useLeaveRequests(status: LeaveStatus) {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.leave)

  useEffect(() => {
    const controller = new AbortController()
    dispatch(fetchLeaveRequests({ status, signal: controller.signal }))
    return () => controller.abort()
  }, [dispatch, status])

  return { items, loading, error } as const
}`,
      },
      {
        title: 'CI/CD workflow (GitHub Actions)',
        language: 'yaml',
        note: PH('Illustrative of the GitHub Actions pipelines described on the resume — paste the real workflow here.'),
        code: `name: build-and-deploy
on:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: temurin, cache: maven }
      - run: mvn -B verify

  ship:
    needs: verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t \${{ vars.REGISTRY }}/ess-api:\${{ github.sha }} .
      - run: docker push \${{ vars.REGISTRY }}/ess-api:\${{ github.sha }}`,
      },
    ],
    challenges: [
      PH('Add the hardest technical problem you hit — e.g. modelling approval hierarchies, keeping workflow state consistent, or an N+1 query you had to kill. One paragraph.'),
      PH('Add a second challenge, ideally about scale, integration or data migration.'),
    ],
    results: [
      PH('Add measurable outcomes — users served, hours saved per month, latency or deployment-frequency improvement. The resume does not carry numbers for this project.'),
    ],
    learnings: [
      PH('Add 2–3 takeaways — what you would design differently, and what owning a platform end to end taught you.'),
    ],
    links: {
      github: PH('Repository URL not on the resume — add it (or mark the project private).'),
      demo: PH('Live demo URL not on the resume — add one, or note that it is an internal enterprise product.'),
    },
  },
  {
    id: 'catnap',
    slug: 'catnap',
    name: 'CatNap',
    role: 'Creator & Developer',
    period: 'Personal project',
    blurb: 'A cat-themed Chrome extension that blocks distracting sites and tabs so you can focus.',
    accent: '#a78bfa',
    office: [8, -4],
    overview:
      'CatNap is a Manifest V3 Chrome extension that keeps you focused by gatekeeping distracting websites and tabs. You choose which sites to block, and CatNap intercepts navigation to them — a lightweight, cat-themed take on a focus gatekeeper, in the same spirit as CatGatekeeper.',
    businessProblem: PH(
      'Add why you built CatNap in 2–3 sentences: the specific distraction problem it solves, who it is for, and how it differs from CatGatekeeper.',
    ),
    solution:
      'A Manifest V3 extension built with plain JavaScript and the Chrome Extension APIs: a popup UI manages the blocklist, a background service worker tracks whether blocking is active, and the extension intercepts navigation to blocked sites and shows a focus screen instead. The blocklist and settings persist through the chrome.storage API so they survive browser restarts.',
    features: [
      'Blocks a user-defined list of distracting websites and tabs.',
      'Popup UI to add, remove and toggle blocked sites.',
      'Blocklist and settings persisted via the Chrome storage API.',
      'Blocked pages are intercepted and replaced with a focus screen.',
      'Built on Manifest V3 with a background service worker.',
    ],
    architecture: {
      summary:
        'A standard Manifest V3 extension: a popup UI drives a background service worker that applies blocking rules against the sites you choose, with the blocklist persisted in Chrome storage.',
      nodes: [
        { id: 'popup', label: 'Popup UI', kind: 'client', detail: 'HTML/CSS/JS popup to manage the blocklist and toggle focus mode.' },
        { id: 'sw', label: 'Service worker', kind: 'service', detail: 'Manifest V3 background service worker tracking the active blocking state.' },
        { id: 'block', label: 'Blocking rules', kind: 'gateway', detail: 'Intercepts navigation to blocked sites via the Chrome tabs / webNavigation APIs.' },
        { id: 'content', label: 'Content script', kind: 'client', detail: 'Renders the focus / blocked screen on gated pages.' },
        { id: 'storage', label: 'Chrome storage', kind: 'data', detail: 'Persists the blocklist and settings across browser restarts.' },
      ],
      edges: [
        { from: 'popup', to: 'storage', label: 'save blocklist' },
        { from: 'popup', to: 'sw', label: 'toggle focus' },
        { from: 'sw', to: 'block', label: 'enable rules' },
        { from: 'block', to: 'content', label: 'inject' },
        { from: 'sw', to: 'storage', label: 'read/write' },
      ],
    },
    stack: ['JavaScript', 'Chrome Extension APIs', 'Manifest V3', 'HTML', 'CSS'],
    screenshots: [
      {
        src: '/screenshots/placeholder.svg',
        alt: 'Placeholder for the CatNap popup / blocklist UI',
        caption: PH('Popup showing the blocklist — export a real screenshot to /public/screenshots and swap it in.'),
        placeholder: true,
      },
      {
        src: '/screenshots/placeholder.svg',
        alt: 'Placeholder for the CatNap focus / blocked screen',
        caption: PH('The blocked-page focus screen — replace with a real capture.'),
        placeholder: true,
      },
    ],
    snippets: [
      {
        title: 'Blocking navigation to gated sites (Manifest V3 service worker)',
        language: 'javascript',
        note: PH('Illustrative of the Chrome APIs used — swap in a real (sanitised) excerpt from the repo.'),
        code: `// background.js — Manifest V3 service worker
const FOCUS_PAGE = chrome.runtime.getURL('focus.html')

async function isBlocked(url) {
  const { blocklist = [], active = false } = await chrome.storage.sync.get(['blocklist', 'active'])
  if (!active) return false
  const host = new URL(url).hostname.replace(/^www\\./, '')
  return blocklist.some((site) => host === site || host.endsWith('.' + site))
}

chrome.webNavigation.onBeforeNavigate.addListener(async ({ tabId, url, frameId }) => {
  if (frameId !== 0) return // top-level navigations only
  if (await isBlocked(url)) {
    chrome.tabs.update(tabId, { url: FOCUS_PAGE })
  }
})`,
      },
    ],
    challenges: [
      PH('Add the hardest problem you hit — e.g. handling SPA route changes, service-worker lifecycle/idle, or matching subdomains reliably. One paragraph.'),
      PH('Add a second challenge, ideally about Manifest V3 constraints or storage sync.'),
    ],
    results: [
      PH('Add measurable outcomes — installs, active users, or the personal focus impact CatNap has had.'),
    ],
    learnings: [
      PH('Add 2–3 takeaways — what building a Chrome extension taught you, and what you would change.'),
    ],
    links: {
      github: PH('Add the CatNap repository URL (or mark it private).'),
      demo: PH('Add the Chrome Web Store listing URL, or note that it is unpublished.'),
    },
  },
]

/**
 * Empty plots rendered in the Tech Park. Left empty so only real, built projects show —
 * no "add your next project here" signposts.
 */
export const vacantOffices: { id: string; label: string; office: [number, number] }[] = []

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
