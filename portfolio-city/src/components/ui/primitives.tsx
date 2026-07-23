import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { playCue } from '@/lib/sound'
import { Icon, type IconName } from './Icon'

/* --------------------------------------------------------------- Button */

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-400 to-violet-500 text-[#05070d] shadow-[0_10px_30px_-10px_rgba(56,232,255,0.7)] hover:shadow-[0_14px_40px_-8px_rgba(124,92,255,0.7)]',
  secondary: 'glass text-[var(--text)] hover:border-cyan-400/40',
  ghost: 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5',
  accent: 'bg-white/8 text-cyan-300 hover:bg-white/12 border border-cyan-400/20',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: IconName
  iconRight?: IconName
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', icon, iconRight, children, className = '', onClick, onMouseEnter, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      onMouseEnter={(e) => {
        playCue('hover')
        onMouseEnter?.(e)
      }}
      onClick={(e) => {
        playCue('click')
        onClick?.(e)
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none active:scale-[0.97] ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={17} />}
    </button>
  )
})

/* ------------------------------------------------------------- LinkButton */

export function LinkButton({
  to,
  variant = 'primary',
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}: LinkProps & { variant?: Variant; icon?: IconName; iconRight?: IconName; children: ReactNode }) {
  return (
    <Link
      to={to}
      onMouseEnter={() => playCue('hover')}
      onClick={() => playCue('click')}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none active:scale-[0.97] ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={17} />}
    </Link>
  )
}

/* --------------------------------------------------------------- Chip / Pill */

export function Chip({ children, accent, className = '' }: { children: ReactNode; accent?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text-muted)] ${className}`}
      style={accent ? { borderColor: `${accent}44`, color: accent } : undefined}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------- SectionTag */

export function SectionTag({ children, accent = 'var(--color-cyan)' }: { children: ReactNode; accent?: string }) {
  return (
    <span className="mono-label inline-flex items-center gap-2">
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
      {children}
    </span>
  )
}

/* --------------------------------------------------------------- Panel */

export function Panel({
  children,
  className = '',
  ...rest
}: HTMLMotionProps<'div'> & { children: ReactNode; className?: string }) {
  return (
    <motion.div className={`panel ${className}`} {...rest}>
      {children}
    </motion.div>
  )
}

/* ----------------------------------------------------------- ExternalLink */

export function ExternalLink({
  href,
  icon,
  children,
  className = '',
}: {
  href: string
  icon?: IconName
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => playCue('hover')}
      className={`inline-flex items-center gap-1.5 text-cyan-300 underline-offset-4 transition hover:underline ${className}`}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </a>
  )
}
