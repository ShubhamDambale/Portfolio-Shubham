import { useDarkMode } from './hooks/useDarkMode'
import Navbar from './components/Navbar'
import ProfileCard from './components/ProfileCard'
import AboutSection from './components/AboutSection'
import ExperienceSection from './components/ExperienceSection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'
import EducationSection from './components/EducationSection'
import CertificationsSection from './components/CertificationsSection'
import ContactSection from './components/ContactSection'
import { profile } from './data/portfolio'

export default function App() {
  const [dark, toggleDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#1b1f23] transition-colors duration-300">
      <Navbar dark={dark} toggleDark={toggleDark} />

      <main className="max-w-[900px] mx-auto px-4 py-6 flex flex-col gap-4">
        <section id="hero">
          <ProfileCard />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="experience">
          <ExperienceSection />
        </section>

        <section id="skills">
          <SkillsSection />
        </section>

        <section id="projects">
          <ProjectsSection />
        </section>

        <section id="education">
          <EducationSection />
        </section>

        <section id="certifications">
          <CertificationsSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        © 2025 {profile.name} ·{' '}
        <a href={`mailto:${profile.email}`} className="text-li-blue hover:underline">
          {profile.email}
        </a>
      </footer>
    </div>
  )
}
