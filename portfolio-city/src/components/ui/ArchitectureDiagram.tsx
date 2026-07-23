import { useMemo } from 'react'
import type { ArchitectureEdge, ArchitectureNode } from '@/types'

/**
 * A lightweight, dependency-free architecture diagram.
 *
 * Nodes are laid out in columns by their `kind` (client → gateway → service → data/infra), and
 * edges are drawn as curved connectors. It renders as inline SVG so it stays crisp, themeable
 * and accessible (each node is real text).
 */

const COLUMN_ORDER: ArchitectureNode['kind'][] = ['client', 'gateway', 'service', 'data', 'infra', 'external']

const KIND_COLOR: Record<ArchitectureNode['kind'], string> = {
  client: '#38e8ff',
  gateway: '#f5a524',
  service: '#7c5cff',
  data: '#34d399',
  infra: '#60a5fa',
  external: '#f472b6',
}

export function ArchitectureDiagram({
  nodes,
  edges,
  accent = '#38e8ff',
}: {
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
  accent?: string
}) {
  const layout = useMemo(() => {
    const columns = COLUMN_ORDER.map((kind) => nodes.filter((n) => n.kind === kind)).filter((c) => c.length > 0)
    const colW = 200
    const rowH = 92
    const width = columns.length * colW
    const maxRows = Math.max(...columns.map((c) => c.length), 1)
    const height = maxRows * rowH + 20

    const positions = new Map<string, { x: number; y: number }>()
    columns.forEach((col, ci) => {
      const offset = (maxRows - col.length) / 2
      col.forEach((node, ri) => {
        positions.set(node.id, { x: ci * colW + 20, y: (ri + offset) * rowH + 30 })
      })
    })
    return { positions, width, height }
  }, [nodes])

  const nodeW = 150
  const nodeH = 54

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8 bg-[#070c16] p-4">
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="min-w-[560px]"
        role="img"
        aria-label="Architecture diagram"
      >
        <defs>
          <marker id="arch-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill={`${accent}aa`} />
          </marker>
        </defs>

        {edges.map((edge, i) => {
          const from = layout.positions.get(edge.from)
          const to = layout.positions.get(edge.to)
          if (!from || !to) return null
          const x1 = from.x + nodeW
          const y1 = from.y + nodeH / 2
          const x2 = to.x
          const y2 = to.y + nodeH / 2
          const midX = (x1 + x2) / 2
          const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`
          return (
            <g key={i}>
              <path d={path} fill="none" stroke={`${accent}55`} strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
              <text x={midX} y={(y1 + y2) / 2 - 6} textAnchor="middle" className="fill-[#8ea3c4]" fontSize="10">
                {edge.label}
              </text>
            </g>
          )
        })}

        {nodes.map((node) => {
          const pos = layout.positions.get(node.id)
          if (!pos) return null
          const color = KIND_COLOR[node.kind]
          return (
            <g key={node.id}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeW}
                height={nodeH}
                rx={10}
                fill="#0d1524"
                stroke={color}
                strokeWidth={1.2}
              />
              <rect x={pos.x} y={pos.y} width={4} height={nodeH} rx={2} fill={color} />
              <text x={pos.x + 14} y={pos.y + 22} className="fill-white" fontSize="12" fontWeight="600">
                {node.label}
              </text>
              <text x={pos.x + 14} y={pos.y + 38} className="fill-[#8ea3c4]" fontSize="9">
                {truncate(node.detail, 26)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)
