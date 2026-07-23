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
]

/**
 * Empty plots rendered in the Tech Park. Honest signposting: the city shows exactly as many
 * projects as the resume does, and invites the rest.
 */
export const vacantOffices: { id: string; label: string; office: [number, number] }[] = [
  { id: 'plot-2', label: 'Available plot — add your next project', office: [8, -4] },
  { id: 'plot-3', label: 'Available plot — add your next project', office: [-6, 8] },
  { id: 'plot-4', label: 'Available plot — add your next project', office: [8, 8] },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
