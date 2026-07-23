import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery'

interface Options {
  typeSpeed?: number
  deleteSpeed?: number
  holdMs?: number
}

/**
 * Rotating typewriter for the hero. Falls back to plain, static text when the visitor has
 * asked for reduced motion.
 */
export function useTypewriter(words: string[], { typeSpeed = 62, deleteSpeed = 28, holdMs = 1500 }: Options = {}) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(reduced ? (words[0] ?? '') : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced || words.length === 0) return
    const word = words[index % words.length]

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), holdMs)
      return () => clearTimeout(t)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => clearTimeout(t)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdMs, reduced])

  return { text: reduced ? (words[0] ?? '') : text, isTyping: !reduced }
}
