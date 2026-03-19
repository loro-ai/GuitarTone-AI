import { useEffect, useRef, ReactNode } from 'react'

interface Feature {
  icon: ReactNode
  title: string
  description: string
}

interface FeatureSectionProps {
  title: string
  subtitle?: string
  features: Feature[]
  layout?: 'grid-3' | 'grid-2' | 'alternating'
  dark?: boolean
}

function useRevealOnScroll(ref: React.RefObject<Element>) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15 }
    )
    const items = ref.current.querySelectorAll('[data-reveal]')
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

export default function FeatureSection({
  title,
  subtitle,
  features,
  layout = 'grid-3',
  dark = true,
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useRevealOnScroll(sectionRef as React.RefObject<Element>)

  const bg = dark ? 'bg-[#0f0f0f]' : 'bg-[#242833]'

  if (layout === 'alternating') {
    return (
      <section ref={sectionRef} className={`${bg} py-[clamp(4rem,10vw,8rem)] overflow-hidden`}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
          <div
            data-reveal
            className="reveal-item mb-16 max-w-2xl"
          >
            <h2
              className="text-white font-black uppercase leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '-0.02em' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-white/60 text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-16 lg:gap-24">
            {features.map((feature, i) => (
              <div
                key={i}
                data-reveal
                className={`reveal-item flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex-1 flex items-center justify-center w-full lg:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-[#cc0000]/40 bg-[#cc0000]/10 text-[#cc0000]">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-white font-bold uppercase mb-3"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.125rem,2vw,1.5rem)', letterSpacing: '0.05em' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .reveal-item { opacity:0; transform:translateY(28px); transition: opacity 0.6s var(--easing-curve), transform 0.6s var(--easing-curve); }
          .reveal-item.is-visible { opacity:1; transform:translateY(0); }
        `}</style>
      </section>
    )
  }

  const gridClass = layout === 'grid-2'
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section ref={sectionRef} className={`${bg} py-[clamp(4rem,10vw,8rem)] overflow-hidden`}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">

        <div data-reveal className="reveal-item text-center mb-12 sm:mb-16">
          <h2
            className="text-white font-black uppercase leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${gridClass} gap-px bg-white/5`}>
          {features.map((feature, i) => (
            <div
              key={i}
              data-reveal
              className="reveal-item bg-[#0f0f0f] p-6 sm:p-8 lg:p-10 flex flex-col gap-4 group hover:bg-[#1a1d26] transition-colors duration-300 cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 flex items-center justify-center border border-[#cc0000]/30 bg-[#cc0000]/10 text-[#cc0000] transition-all duration-300 group-hover:border-[#cc0000]/60 group-hover:bg-[#cc0000]/20">
                {feature.icon}
              </div>
              <h3
                className="text-white font-bold uppercase text-sm tracking-wider"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}
              >
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reveal-item { opacity:0; transform:translateY(28px); transition: opacity 0.6s var(--easing-curve), transform 0.6s var(--easing-curve); }
        .reveal-item.is-visible { opacity:1; transform:translateY(0); }
      `}</style>
    </section>
  )
}
