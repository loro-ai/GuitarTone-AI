interface HeroProps {
  headline: string
  subheadline: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary?: { text: string; href: string }
  backgroundImage: string
  eyebrow?: string
  align?: 'left' | 'center'
}

export default function Hero({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  eyebrow,
  align = 'left',
}: HeroProps) {
  const alignClass = align === 'center'
    ? 'items-center text-center'
    : 'items-start text-left'

  return (
    <section
      className="relative w-full min-h-screen flex items-end overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <img
        src="john.jpg"
        alt=""
        role="presentation"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay — más oscuro abajo para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-sm:bottom-30 w-full mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 pb-16 sm:pb-24 lg:pb-10 md:bottom-0 lg:bottom-0">
        <div className={`flex flex-col ${alignClass} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>

          {eyebrow && (
            <span
              className="text-[#cc0000] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4"
              style={{ fontFamily: 'var(--font-body)', animation: 'fadeIn 0.6s ease forwards' }}
            >
              {eyebrow}
            </span>
          )}

          <h1
            className="text-white font-black uppercase leading-none mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              letterSpacing: '-0.02em',
              animation: 'fadeInUp 0.8s ease 0.1s both',
            }}
          >
            {headline}
          </h1>

          <p
            className="text-white/70 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-lg"
            style={{
              fontFamily: 'var(--font-body)',
              animation: 'fadeInUp 0.8s ease 0.25s both',
            }}
          >
            {subheadline}
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 ${align === 'center' ? 'justify-center' : ''}`}
            style={{ animation: 'fadeInUp 0.8s ease 0.4s both' }}
          >
            <a
              href={ctaPrimary.href}
              className="inline-flex items-center justify-center min-h-11 px-8 py-3.5 bg-[#cc0000] hover:bg-[#e60000] text-white font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(204,0,0,0.4)] cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {ctaPrimary.text}
            </a>
            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center min-h-11 px-8 py-3.5 border border-white/30 hover:border-white text-white font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:bg-white/10 cursor-pointer"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {ctaSecondary.text}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        style={{ animation: 'fadeIn 1s ease 1s both' }}
        aria-hidden="true"
      >
        <span className="text-white text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Scroll</span>
        <div className="w-px h-8 bg-white/50 animate-pulse" />
      </div>
    </section>
  )
}
