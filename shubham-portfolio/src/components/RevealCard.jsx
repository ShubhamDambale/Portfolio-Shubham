import { useInView } from '../hooks/useInView'

export default function RevealCard({ children, className = '', delay = 0 }) {
  const [ref, visible] = useInView(0.08)

  return (
    <div
      ref={ref}
      className={`card ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
