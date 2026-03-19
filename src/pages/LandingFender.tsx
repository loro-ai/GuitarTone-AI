import { useState } from 'react'
import { useLocation } from 'wouter'
import Navbar from '../templates/fender-system/components/Navbar'
import Hero from '../templates/fender-system/components/Hero'
import FeatureSection from '../templates/fender-system/components/FeatureSection'
import ProductGrid from '../templates/fender-system/components/ProductGrid'
import Footer from '../templates/fender-system/components/Footer'
import AuthModal from '../templates/fender-system/components/AuthModal'
import { useAuth } from '@/_core/hooks/useAuth'

/* ── Iconos SVG inline ── */
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)
const IconGear = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IconBrain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
  </svg>
)
const IconPreset = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
  </svg>
)
const IconSearch2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
)
const IconLib = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
)
const IconFlash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
)
const IconSocial = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

/* ── Datos del sistema ── */

const NAV_LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Procesadores', href: '#procesadores' },
  { label: 'Presets', href: '#presets' },
]

const PROCESSORS = [
  {
    name: 'Zoom G1/B1 Four',
    category: 'Multi-efectos',
    href: '#',
    image: '/g1.jpg',
  },
  {
    name: 'Line 6 HX Stomp',
    category: 'Procesadores',
    href: '#',
    image: '/line6.png',
  },
  {
    name: 'Boss GT-1000',
    category: 'Floor Processor',
    href: '#',
    image: '/gt-1000.png',
  },
  {
    name: 'Mooer GE-200',
    category: 'Multi-efectos',
    href: '#',
    image: '/moer200.png',
  },
  {
    name: 'Orange 20',
    category: 'Amplificadores',
    href: '#',
    image: '/orange20.png',
  },
  {
    name: 'Peavey Decade',
    category: 'Amplificadores',
    href: '#',
    image: '/peavey20.png',
  },
  {
    name: 'Vox V847 Wah',
    category: 'Pedales',
    href: '#',
    image: '/voxv847.png',
  },
  {
    name: 'Dunlop Fuzz Face (Silicon)',
    category: 'Pedales',
    href: '#',
    image: '/dunlopfuzz.png',
  },
]

const WIZARD_STEPS = [
  {
    icon: <IconSearch />,
    title: '1. Buscás la canción',
    description: 'Escribís título y artista. GuitarTone la identifica y busca los equipos que utilizo el artista: amplificadores, pedales, cadena de señal y técnica de toque.',
  },
  {
    icon: <IconGear />,
    title: '2. Seleccionás tu equipo',
    description: 'Elegís los dispositivos que tenés: procesador multiefectos, amplificador, pedalera. El sistema reconoce las capacidades exactas de tu hardware y las tiene en cuenta al generar.',
  },
  {
    icon: <IconBrain />,
    title: '3. GuitarTone arma los presets',
    description: 'GuitarTone cruza el tono del artista con las capacidades reales de tu equipo. Cada parámetro se calcula para que suene como debe sonar, no como aproximación.',
  },
  {
    icon: <IconPreset />,
    title: '4. Recibís presets listos',
    description: 'Obtenés la configuración de tu amplificador y presets específicos por sección de la canción: intro, verso, coro, solo. Valores exactos para cargar directamente en tu equipo.',
  },
]

const TECH_FEATURES = [
  {
    icon: <IconSearch2 />,
    title: 'Base de datos musical',
    description: 'Millones de canciones disponibles. Búsqueda por título y artista con carátula del álbum incluida para identificar la versión exacta.',
  },
  {
    icon: <IconBrain />,
    title: 'Investigación profunda del tono',
    description: 'Analiza Rig Rundowns, Guitar World, Equipboard y foros especializados para conocer el gear real del artista antes de generar cualquier preset.',
  },
  {
    icon: <IconLib />,
    title: '300 dispositivos documentados',
    description: '100 procesadores, 100 amplificadores y 100 pedales con sus parámetros, rangos y configuraciones documentados desde los manuales oficiales.',
  },
  {
    icon: <IconFlash />,
    title: 'Resultados al instante',
    description: 'La investigación del tono de cada canción se guarda automáticamente. La próxima búsqueda de esa canción devuelve los presets en segundos.',
  },
]

const USE_CASES = [
  {
    icon: <IconPreset />,
    title: 'Guitarrista de metal con Boss GT-1000',
    description: '"Enter Sandman" de Metallica → GuitarTone investiga el rig de James Hetfield y genera presets exactos para el GT-1000: ganancia, ecualización, reducción de ruido y delay configurados al detalle.',
  },
  {
    icon: <IconGear />,
    title: 'Guitarrista de funk con Zoom B1 Four',
    description: '"Dont Forget Me" de RHCP → El sistema detecta la atmosfera delay/reverb que crea  Frusciante y la compresión mínima. Genera 3 presets para el Zoom B1: verso limpio, coro con envelope filter y clímax con distorsión.',
  },
  {
    icon: <IconSearch />,
    title: 'Estudiante aprendiendo covers',
    description: 'Cualquier canción → presets listos para cargar. Cada preset incluye contexto musical y consejos de técnica. Ideal para sonar bien desde el primer día.',
  },
]

const FOOTER_COLUMNS = [
  {
    title: 'GuitarTone',
    links: [
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Procesadores', href: '#procesadores' },
      { label: 'Presets', href: '#presets' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Reportar problema', href: '#' },
      { label: 'Contacto', href: '#' },
    ],
  },
]

/* ── Sección guitarras ── */
function GuitarSection() {
  const pickups = [
    {
      name: 'Humbucker',
      desc: 'El tono grueso y cálido de las Les Paul y SG. Perfecto para rock, metal y blues con cuerpo.',
      example: 'Gibson, Epiphone, PRS',
      image: '/humbucker.jpg',
    },
    {
      name: 'Single Coil',
      desc: 'El brillo cristalino de las Stratocaster y Telecaster. Funky, limpio y expresivo en todos los géneros.',
      example: 'Fender, Squier, G&L',
      image: '/singlecoil.jpg',
    },
    {
      name: 'P90',
      desc: 'Cuerpo con claridad. Lo mejor de ambos mundos para indie, blues y rock alternativo.',
      example: 'Gibson ES, Epiphone Casino',
      image: '/p90.jpg',
    },
    {
      name: 'Pastillas Activas',
      desc: 'Ataque preciso y definición extrema. El estándar del metal moderno y el djent.',
      example: 'ESP, Jackson, Schecter',
      image: '/activas.jpg',
    },
  ]

  return (
    <section className="bg-[#0f0f0f] py-[clamp(4rem,10vw,8rem)] overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">

        <div className="mb-12 sm:mb-16">
          <p className="text-[#cc0000] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ fontFamily: 'var(--font-body)' }}>
            Compatible con todas las guitarras
          </p>
          <h2
            className="text-white font-black uppercase leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '-0.02em' }}
          >
            Funciona con cualquier guitarra
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            GuitarTone AI adapta los presets al tipo de pastillas y posición que uses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pickups.map((p) => (
            <div
              key={p.name}
              className="group bg-[#1a1d26] border border-white/5 overflow-hidden hover:border-[#cc0000]/40 transition-colors duration-300 cursor-default"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d26] via-[#1a1d26]/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3
                  className="text-white font-black uppercase mb-2"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2vw,1.25rem)', letterSpacing: '0.05em' }}
                >
                  {p.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  {p.desc}
                </p>
                <p className="text-[#cc0000] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                  {p.example}
                </p>
              </div>
              <div className="h-0.5 bg-[#cc0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 sm:p-6 bg-[#242833] border border-white/5">
          <p className="text-white/50 text-sm leading-relaxed text-center" style={{ fontFamily: 'var(--font-body)' }}>
            GuitarTone AI detecta automáticamente el tipo de pastillas de tu equipo y ajusta los presets para que suenen exactamente como deben sonar.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Lo que genera GuitarTone ── */
function PresetShowcase() {
  return (
    <section id="presets" className="bg-[#0f0f0f] py-[clamp(4rem,10vw,8rem)] overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">

        <div className="mb-12 sm:mb-16">
          <p className="text-[#cc0000] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ fontFamily: 'var(--font-body)' }}>
            Resultado real
          </p>
          <h2
            className="text-white font-black uppercase leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.5rem)', letterSpacing: '-0.02em' }}
          >
            Lo que recibís al generar
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            Dos bloques listos para cargar en tu equipo: la configuración de tu amplificador y los presets por sección de la canción.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Configuración del amplificador */}
          <div className="bg-[#1a1d26] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
              <span className="px-2 py-1 bg-[#cc0000]/20 text-[#cc0000] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                Amplificador
              </span>
              <span className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                Configuración fija para toda la canción
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'GAIN', value: '4', note: 'Crunch leve — vintage blues' },
                { label: 'BASS', value: '6', note: 'Compensación grave' },
                { label: 'MID', value: '7', note: 'Presencia vocal en midrange' },
                { label: 'TREBLE', value: '5', note: 'Brillante sin agresividad' },
                { label: 'REVERB', value: '2', note: 'Ambiente sutil de sala' },
              ].map((param) => (
                <div key={param.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-white/40 text-xs font-mono w-16 flex-shrink-0" style={{ fontFamily: 'var(--font-body)' }}>
                      {param.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[80px]">
                      <div
                        className="h-full bg-[#cc0000] rounded-full"
                        style={{ width: `${(parseInt(param.value) / 10) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>{param.value}</span>
                    <span className="text-white/30 text-xs hidden sm:block" style={{ fontFamily: 'var(--font-body)' }}>{param.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Presets por sección */}
          <div className="bg-[#1a1d26] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                Presets por sección
              </span>
              <span className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                Cambiás de preset en cada parte de la canción
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { nombre: 'A0 — Intro', momento: 'Intro / Arpegio limpio', descripcion: 'Tono clean con reverb larga. Sin drive.', modules: ['Sin distorsión', 'Reverb amplia', 'Chorus sutil'] },
                { nombre: 'A1 — Verso', momento: 'Verso / Riff principal', descripcion: 'Crunch leve. EQ brillante para corte.', modules: ['Crunch moderado', 'EQ brillante', 'Reducción ruido activa'] },
                { nombre: 'A2 — Coro', momento: 'Coro / Clímax', descripcion: 'High-gain con delay a tiempo. Más presencia.', modules: ['Ganancia alta', 'Delay sincronizado', 'Reverb de sala'] },
              ].map((preset) => (
                <div key={preset.nombre} className="border border-white/5 p-4 hover:border-white/15 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                      {preset.nombre}
                    </span>
                    <span className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>{preset.momento}</span>
                  </div>
                  <p className="text-white/50 text-xs mb-2" style={{ fontFamily: 'var(--font-body)' }}>{preset.descripcion}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {preset.modules.map((m) => (
                      <span key={m} className="text-[10px] px-2 py-0.5 bg-white/5 text-white/40 font-mono">{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investigación del tono */}
        <div className="mt-6 bg-[#242833] border border-white/5 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
              Investigación del tono
            </span>
            <span className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
              Análisis del gear del artista original, guardado para búsquedas futuras
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Nivel de ganancia', value: 'Crunch' },
              { label: 'Amplificador', value: 'Marshall DSL40' },
              { label: 'Guitarra', value: 'Les Paul — humbuckers' },
              { label: 'Fuente verificada', value: 'Rig Rundown — Premier Guitar' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>{item.label}</p>
                <p className="text-white text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Stats bar ── */
function StatsBar() {
  return (
    <section className="bg-[#cc0000] py-6 sm:py-8" aria-label="Estadísticas de la librería">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
          {[
            { value: '100', label: 'Procesadores' },
            { value: '100', label: 'Amplificadores' },
            { value: '99', label: 'Pedales' },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="text-white font-black leading-none mb-1"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </p>
              <p className="text-white/70 text-xs sm:text-sm font-medium uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA Section ── */
function CTASection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="bg-[#0f0f0f] py-20 sm:py-28 overflow-hidden relative border-t border-white/5">
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 flex flex-col items-center text-center gap-6">
        <p
          className="text-[#cc0000] text-xs sm:text-sm font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Gratis para empezar
        </p>
        <h2
          className="text-white font-black uppercase leading-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', letterSpacing: '-0.02em' }}
        >
          Buscá tu primera canción
        </h2>
        <p
          className="text-white/50 text-base sm:text-lg max-w-xl leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          300 dispositivos compatibles en la librería. Tu equipo ya está adentro. Solo falta la canción.R3
        </p>
        <button
          onClick={onCTA}
          className="inline-flex items-center justify-center min-h-11 px-10 py-3.5 bg-[#cc0000] hover:bg-[#e60000] text-white font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Crear cuenta gratis
        </button>
      </div>
    </section>
  )
}

/* ── LANDING PAGE ── */
export default function LandingFender() {
  const { isAuthenticated } = useAuth()
  const [, navigate] = useLocation()
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>({
    open: false,
    tab: 'register',
  })

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/app')
    } else {
      setAuthModal({ open: true, tab: 'register' })
    }
  }

  return (
    <div className="bg-[#0f0f0f] overflow-x-hidden">

      {/* 1. Navbar */}
      <Navbar
        logo="GuitarTone AI"
        links={NAV_LINKS}
        cta={{ text: isAuthenticated ? 'Abrir app' : 'Empezar gratis', href: '#' }}
      />

      {/* 2. Hero — imagen dramática de concierto con overlay dual */}
      <Hero
        eyebrow="De un guitarrista para guitarristas"
        headline={`El tono\nde tu artista\nEn tu equipo.`}
        subheadline="Buscás cualquier canción, ingresas tus equipos y recibís presets exactos con valores para cargar directamente en tu procesador."
        backgroundImage="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80"
        ctaPrimary={{ text: isAuthenticated ? 'Abrir GuitarTone' : 'Empezar gratis', href: '#' }}
        ctaSecondary={{ text: 'Cómo funciona', href: '#como-funciona' }}
        align="left"
      />

      {/* 3. Stats bar */}
      <StatsBar />

      {/* 4. Cómo funciona */}
      <section id="como-funciona">
        <FeatureSection
          title="Cómo funciona"
          subtitle="Cuatro pasos. Desde la canción hasta los valores exactos para tu equipo."
          features={WIZARD_STEPS}
          layout="grid-2"
          dark={true}
        />
      </section>

      {/* 5. Compatibilidad con guitarras */}
      <GuitarSection />

      {/* 6. Procesadores compatibles */}
      <ProductGrid
        id="procesadores"
        title="Equipos compatibles"
        subtitle="Zoom , Line 6 , Boss , Mooer, Marshall, Orange , Peavey , Vox , Dunlop y muchos más. Si está en tu rack, está en la librería."
        products={PROCESSORS}
        columns={4}
      />

      {/* 7. Lo que genera GuitarTone */}
      <PresetShowcase />

      {/* 8. Casos de uso */}
      <FeatureSection
        title="Para cualquier estilo y equipo"
        subtitle="Desde metal a funk, desde un Zoom de $100 hasta un Axe-Fx. Si tenés la canción y el equipo, GuitarTone hace el resto."
        features={USE_CASES}
        layout="alternating"
        dark={false}
      />

      {/* 9. Tecnología detrás del tono */}
      <FeatureSection
        title="Tecnología detrás del tono"
        subtitle="Cada componente cumple una función específica. Cero magia negra, todo verificable."
        features={TECH_FEATURES}
        layout="grid-2"
        dark={true}
      />

      {/* 10. CTA final */}
      <CTASection onCTA={handleCTA} />

      {/* 11. Footer */}
      <Footer
        logo="GuitarTone AI"
        columns={FOOTER_COLUMNS}
        copyright="© 2025 GuitarTone AI. Todos los derechos reservados."
        socialLinks={[
          { label: 'Instagram', href: '#', icon: <IconSocial /> },
          { label: 'YouTube', href: '#', icon: <IconSocial /> },
        ]}
      />

      {/* AuthModal global */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal((s) => ({ ...s, open: false }))}
        defaultTab={authModal.tab}
        onSuccess={() => setAuthModal((s) => ({ ...s, open: false }))}
      />
    </div>
  )
}
