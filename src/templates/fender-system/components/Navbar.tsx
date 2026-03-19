import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/_core/hooks/useAuth'
import AuthModal from './AuthModal'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  logo: string | React.ReactNode
  links: NavLink[]
  cta: { text: string; href: string }
}

export default function Navbar({ logo, links, cta }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>({
    open: false,
    tab: 'login',
  })
  const [, navigate] = useLocation()
  const { user, isAuthenticated, logout, loading } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const openAuth = (tab: 'login' | 'register') => {
    setMenuOpen(false)
    setAuthModal({ open: true, tab })
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    window.location.reload()
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-16 max-w-[1440px]">

          {/* Logo */}
          <a href="/" className="flex-shrink-0 cursor-pointer" aria-label="GuitarTone AI — inicio">
            {typeof logo === 'string' ? (
              <span className="text-white font-black text-xl tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                {logo}
              </span>
            ) : logo}
          </a>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-white/70 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors duration-200 group cursor-pointer"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#cc0000] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Auth desktop */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
            ) : isAuthenticated ? (
              <>
                {/* Avatar + nombre */}
                <div className="flex items-center gap-2 text-white/70 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  <div className="w-8 h-8 rounded-full bg-[#cc0000] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {userInitial}
                  </div>
                  <span className="hidden lg:block max-w-[120px] truncate">{user?.name}</span>
                </div>
                <button
                  onClick={() => navigate('/app')}
                  className="inline-flex items-center min-h-11 px-5 py-2 bg-[#cc0000] hover:bg-[#e60000] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Abrir GuitarTone
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center min-h-11 px-4 py-2 border border-white/20 hover:border-white/40 text-white/50 hover:text-white text-sm uppercase tracking-wider transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000]"
                  style={{ fontFamily: 'var(--font-body)' }}
                  aria-label="Cerrar sesión"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="inline-flex items-center min-h-11 px-5 py-2 border border-white/20 hover:border-white/50 text-white text-sm font-medium uppercase tracking-wider transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="inline-flex items-center min-h-11 px-5 py-2 bg-[#cc0000] hover:bg-[#e60000] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 cursor-pointer"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <div className={`fixed inset-0 z-[99] md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-[#0f0f0f] border-l border-white/10 flex flex-col pt-20 px-8 gap-6 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-label="Menú móvil"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/70 hover:text-white text-lg font-medium uppercase tracking-wider transition-colors duration-200 cursor-pointer border-b border-white/10 pb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {link.label}
            </a>
          ))}

          <div className="flex flex-col gap-3 mt-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 text-white/60 text-sm pb-2 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#cc0000] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {userInitial}
                  </div>
                  <span className="truncate">{user?.name}</span>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/app') }}
                  className="min-h-11 px-6 py-3 bg-[#cc0000] hover:bg-[#e60000] text-white font-bold uppercase tracking-wider text-sm transition-colors duration-200 cursor-pointer text-center"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Abrir GuitarTone
                </button>
                <button
                  onClick={handleLogout}
                  className="min-h-11 px-6 py-3 border border-white/20 text-white/50 hover:text-white uppercase tracking-wider text-sm transition-colors duration-200 cursor-pointer text-center"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="min-h-11 px-6 py-3 border border-white/20 text-white font-medium uppercase tracking-wider text-sm transition-colors duration-200 cursor-pointer text-center hover:border-white/50"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="min-h-11 px-6 py-3 bg-[#cc0000] hover:bg-[#e60000] text-white font-bold uppercase tracking-wider text-sm transition-colors duration-200 cursor-pointer text-center"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Registrarse gratis
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* AuthModal */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal((s) => ({ ...s, open: false }))}
        defaultTab={authModal.tab}
        onSuccess={() => setAuthModal((s) => ({ ...s, open: false }))}
      />
    </>
  )
}
