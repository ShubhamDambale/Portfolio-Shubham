import { useState } from 'react'
import RevealCard from './RevealCard'
import { profile } from '../data/portfolio'

const CONTACTS = [
  { icon: '📧', label: 'Email',    val: profile.email,               href: `mailto:${profile.email}`,    bg: '#fce8e6' },
  { icon: '📞', label: 'Phone',    val: profile.phone,               href: `tel:${profile.phone}`,       bg: '#e6f4ea' },
  { icon: '💼', label: 'LinkedIn', val: 'shubham-dambale',           href: profile.linkedin,             bg: '#e8f0fe' },
  { icon: '🐙', label: 'GitHub',   val: 'ShubhamDambale',            href: profile.github,               bg: '#f3f0ff' },
  { icon: '📍', label: 'Location', val: profile.location,            href: '#',                          bg: '#fff8e1' },
]

function ContactItem({ icon, label, val, href, bg }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="contact-card"
    >
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-base"
        style={{ background: bg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.7rem] text-gray-400">{label}</p>
        <p className="text-xs font-semibold truncate">{val}</p>
      </div>
    </a>
  )
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const update = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">Contact</h2>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CONTACTS.map(c => <ContactItem key={c.label} {...c} />)}
        </div>

        {/* Form */}
        <div className="mt-7">
          <p className="font-semibold text-sm mb-4 text-[#191919] dark:text-[#f0ede8]">Send a Message</p>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="form-input"
                placeholder="Your Name"
                value={form.name}
                onChange={update('name')}
              />
              <input
                className="form-input"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={update('email')}
              />
            </div>
            <input
              className="form-input"
              placeholder="Subject"
              value={form.subject}
              onChange={update('subject')}
            />
            <textarea
              className="form-input min-h-[100px] resize-y"
              placeholder="Your message..."
              value={form.message}
              onChange={update('message')}
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSent(true)}
                className="btn-primary"
              >
                Send Message ✉
              </button>
              {sent && (
                <span className="text-xs text-li-green">
                  ✅ Message sent! (Demo — connect via email above)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </RevealCard>
  )
}
