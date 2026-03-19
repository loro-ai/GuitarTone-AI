import { useState } from 'react'

interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

interface FooterProps {
  logo: string | React.ReactNode
  columns: FooterColumn[]
  copyright: string
  socialLinks?: { label: string; href: string; icon: React.ReactNode }[]
  newsletterPlaceholder?: string
  onNewsletterSubmit?: (email: string) => void
}

export default function Footer({
  logo,
  columns,
  copyright,
  socialLinks = [],
  newsletterPlaceholder = 'Tu email',
  onNewsletterSubmit,
}: FooterProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    onNewsletterSubmit?.(email)
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5" role="contentinfo">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 py-16 sm:py-20">

        {/* Top: logo + newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-14 pb-14 border-b border-white/10">
          <div className="flex-shrink-0">
            {typeof logo === 'string' ? (
              <span className="text-white font-black text-2xl tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                {logo}
              </span>
            ) : logo}
          </div>

          {/* Newsletter */}
          <div className="max-w-sm w-full">
            <p className="text-white font-bold text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Newsletter
            </p>
            <p className="text-white/40 text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              Novedades, lanzamientos y ofertas exclusivas.
            </p>
            {submitted ? (
              <p className="text-[#cc0000] text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                ¡Suscripción confirmada!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-0" role="search" aria-label="Newsletter">
                <label htmlFor="footer-email" className="sr-only">Email</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletterPlaceholder}
                  className="flex-1 min-h-11 bg-white/5 border border-white/10 border-r-0 px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#cc0000] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                <button
                  type="submit"
                  className="min-h-11 px-5 bg-[#cc0000] hover:bg-[#e60000] text-white text-sm font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  OK
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
          {columns.map((col, i) => (
            <div key={i}>
              <p
                className="text-white font-bold text-xs uppercase tracking-widest mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: copyright + social */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            {copyright}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
