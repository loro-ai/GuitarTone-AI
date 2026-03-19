import { useEffect, useRef } from 'react'

interface Product {
  image: string
  name: string
  category: string
  price?: string
  href: string
}

interface ProductGridProps {
  title: string
  subtitle?: string
  products: Product[]
  columns?: 2 | 3 | 4
  id?: string
}

export default function ProductGrid({
  title,
  subtitle,
  products,
  columns = 3,
  id,
}: ProductGridProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const colClass: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section ref={sectionRef} id={id} className="bg-[#242833] py-[clamp(4rem,10vw,8rem)] overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">

        <div data-reveal className="reveal-item mb-10 sm:mb-14">
          <h2
            className="text-white font-black uppercase leading-tight mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/50 text-base sm:text-lg" style={{ fontFamily: 'var(--font-body)' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${colClass[columns]} gap-4 sm:gap-6`}>
          {products.map((product, i) => (
            <a
              key={i}
              href={product.href}
              data-reveal
              className="reveal-item group relative overflow-hidden bg-[#1a1d26] cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000]"
              style={{ transitionDelay: `${i * 60}ms` }}
              aria-label={`Ver ${product.name}`}
            >
              {/* Image wrapper */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#cc0000]/0 group-hover:bg-[#cc0000]/10 transition-colors duration-300 flex items-center justify-center">
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-[#cc0000] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 min-h-11 flex items-center"
                    style={{ fontFamily: 'var(--font-body)' }}
                    aria-hidden="true"
                  >
                    Ver producto
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5">
                <p
                  className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {product.category}
                </p>
                <h3
                  className="text-white font-bold uppercase text-sm sm:text-base mb-2 leading-tight"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
                >
                  {product.name}
                </h3>
                {product.price && (
                  <p
                    className="text-white/60 text-sm font-medium"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {product.price}
                  </p>
                )}
              </div>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#cc0000] transition-all duration-300 group-hover:w-full" />
            </a>
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
