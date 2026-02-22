import { useState } from 'react'

const NAV_ITEMS = ['about', 'experience', 'skills', 'projects', 'education', 'contact']

export default function Navbar({ dark, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#26292e] border-b border-gray-200 dark:border-[#3a3d42] shadow-sm">
        <div className="max-w-[900px] mx-auto flex items-center gap-3 px-4 h-14">

          {/* Logo */}
          <span className="font-display text-2xl font-bold text-li-blue flex-shrink-0">SD</span>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {NAV_ITEMS.map(item => (
              <a key={item} href={`#${item}`} className="nav-link">
                {item}
              </a>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="ml-2 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-[#3a3d42] rounded-full px-3 py-1.5 hover:border-li-blue hover:text-li-blue transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            <span>{dark ? '☀' : '🌙'}</span>
            <span>{dark ? 'Light' : 'Dark'}</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden flex flex-col gap-1.5 p-1.5 rounded"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-500 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-500 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-500 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 inset-x-0 bottom-0 bg-white dark:bg-[#26292e] z-40 px-6 py-4 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMenuOpen(false)}
              className="block py-3.5 border-b border-gray-200 dark:border-[#3a3d42] text-[#191919] dark:text-[#f0ede8] text-base font-medium capitalize"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
