import { useState, useEffect, useRef } from 'react'
import { trpc } from '@/lib/trpc'
import { useLocation } from 'wouter'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab: 'login' | 'register'
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, defaultTab, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [, navigate] = useLocation()
  const utils = trpc.useUtils()
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar tab con defaultTab cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab)
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [isOpen, defaultTab])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ─── Login ────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate()
      onSuccess()
      navigate('/app')
    },
    onError: (err) => setLoginError(err.message),
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    await loginMutation.mutateAsync({ email: loginEmail, password: loginPassword })
  }

  // ─── Register ─────────────────────────────────────────────────
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regError, setRegError] = useState('')

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate()
      onSuccess()
      navigate('/app')
    },
    onError: (err) => setRegError(err.message),
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    await registerMutation.mutateAsync({ name: regName, email: regEmail, password: regPassword })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-md bg-[#0f0f0f] border border-white/10 transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex gap-0">
            <button
              onClick={() => setTab('login')}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer min-h-11 ${
                tab === 'login'
                  ? 'text-white border-b-2 border-[#cc0000]'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setTab('register')}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer min-h-11 ${
                tab === 'register'
                  ? 'text-white border-b-2 border-[#cc0000]'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Crear cuenta
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Login */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="px-6 py-6 flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                Email
              </label>
              <input
                ref={firstInputRef}
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="min-h-11 bg-white/5 border border-white/10 px-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#cc0000] transition-colors duration-200"
                placeholder="tu@email.com"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="min-h-11 bg-white/5 border border-white/10 px-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#cc0000] transition-colors duration-200"
                placeholder="••••••••"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {loginError && (
              <p className="text-[#cc0000] text-sm" role="alert" style={{ fontFamily: 'var(--font-body)' }}>
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="min-h-11 w-full bg-[#cc0000] hover:bg-[#e60000] disabled:bg-[#cc0000]/50 text-white font-bold uppercase tracking-wider text-sm transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white mt-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
            </button>

            <p className="text-center text-white/40 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-[#cc0000] hover:text-[#e60000] cursor-pointer focus:outline-none underline"
              >
                Registrarse
              </button>
            </p>
          </form>
        )}

        {/* Tab Register */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="px-6 py-6 flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-name" className="text-xs font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                Nombre
              </label>
              <input
                ref={firstInputRef}
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="min-h-11 bg-white/5 border border-white/10 px-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#cc0000] transition-colors duration-200"
                placeholder="Tu nombre"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="min-h-11 bg-white/5 border border-white/10 px-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#cc0000] transition-colors duration-200"
                placeholder="tu@email.com"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                Contraseña
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="min-h-11 bg-white/5 border border-white/10 px-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#cc0000] transition-colors duration-200"
                placeholder="Mínimo 6 caracteres"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {regError && (
              <p className="text-[#cc0000] text-sm" role="alert" style={{ fontFamily: 'var(--font-body)' }}>
                {regError}
              </p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="min-h-11 w-full bg-[#cc0000] hover:bg-[#e60000] disabled:bg-[#cc0000]/50 text-white font-bold uppercase tracking-wider text-sm transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white mt-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {registerMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

            <p className="text-center text-white/40 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-[#cc0000] hover:text-[#e60000] cursor-pointer focus:outline-none underline"
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
