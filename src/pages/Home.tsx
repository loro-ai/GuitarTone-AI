import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { Link } from "wouter";

// ─── Palette — warm mahogany + amber gold + parchment ─────────────────────────
const BG      = "#0B0907";   // rosewood dark
const BG2     = "#0F0D0A";   // slightly lighter warm black
const CARD    = "#161210";   // card surface
const GLASS   = "rgba(22,18,16,0.72)";
const TEXT    = "#EDE8DC";   // parchment cream
const MUTED   = "#7A7166";   // warm stone
const ACCENT  = "#C49B38";   // amber gold — fret wire, vintage hardware
const ACCENT2 = "#8FA68B";   // muted sage — secondary
const BORDER  = "rgba(255,245,220,0.07)";
const BORDER_A = "rgba(196,155,56,0.22)";

// ─── Hook: fade in on scroll ───────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

const appear = (visible: boolean, delay = 0): CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(32px)",
  transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
});

// ─── Guitar pick icon (amber) ──────────────────────────────────────────────────
function PickIcon({ size = 20, color = ACCENT }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M10 1.5 C4.8 1.5 1.2 5.8 1.2 11 C1.2 17.2 5.2 22.8 10 24 C14.8 22.8 18.8 17.2 18.8 11 C18.8 5.8 15.2 1.5 10 1.5 Z" fill={color} />
      <path d="M10 4 C6.5 4 4 7 4 11" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Large pick SVG for hero ───────────────────────────────────────────────────
function HeroPickSVG() {
  return (
    <svg viewBox="0 0 320 385" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: "320px", filter: "drop-shadow(0 24px 64px rgba(196,155,56,0.28))" }}>
      <defs>
        <radialGradient id="pg" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#D4AA44" />
          <stop offset="55%" stopColor="#B8902A" />
          <stop offset="100%" stopColor="#7A5C10" />
        </radialGradient>
        <radialGradient id="pg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,230,140,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <path d="M160 14 C82 14 18 72 18 148 C18 228 74 318 160 370 C246 318 302 228 302 148 C302 72 238 14 160 14 Z"
        fill="url(#pg)" />
      {/* Tortoise inner ring */}
      <path d="M160 46 C98 46 50 92 50 148 C50 216 100 298 160 340 C220 298 270 216 270 148 C270 92 222 46 160 46 Z"
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      {/* Center oval */}
      <ellipse cx="160" cy="156" rx="36" ry="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
      <ellipse cx="160" cy="156" rx="20" ry="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {/* .73 text — warm amber pick (Dunlop Tortex Standard) */}
      <text x="160" y="170" textAnchor="middle" fill="rgba(255,255,255,0.55)"
        fontSize="30" fontFamily="'Courier New', monospace" fontWeight="bold" letterSpacing="-1">.73</text>
      <text x="160" y="206" textAnchor="middle" fill="rgba(255,255,255,0.18)"
        fontSize="11" fontFamily="sans-serif" letterSpacing="3.5">TORTEX</text>
      {/* Highlight sweep */}
      <path d="M104 66 C84 86 72 112 72 138" fill="none" stroke="rgba(255,255,255,0.24)"
        strokeWidth="8" strokeLinecap="round" />
      {/* Sheen overlay */}
      <path d="M160 14 C82 14 18 72 18 148 C18 228 74 318 160 370 C246 318 302 228 302 148 C302 72 238 14 160 14 Z"
        fill="url(#pg2)" />
    </svg>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
function IconSearch() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>;
}
function IconSliders() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill={CARD} stroke={ACCENT} strokeWidth="1.8" />
    <circle cx="16" cy="12" r="2" fill={CARD} stroke={ACCENT} strokeWidth="1.8" />
    <circle cx="10" cy="18" r="2" fill={CARD} stroke={ACCENT} strokeWidth="1.8" />
  </svg>;
}
function IconDoc() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="16" x2="12.5" y2="16" />
    <circle cx="17" cy="16" r="2" fill={ACCENT} stroke="none" />
  </svg>;
}
function IconTime() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>;
}

function ArrowRight({ color = ACCENT }: { color?: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M13 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

// ─── Problem illustration ──────────────────────────────────────────────────────
function SearchChaosIllustration() {
  const winStyle = { fill: CARD, stroke: BORDER, strokeWidth: "1" };
  const barStyle = { fill: "#1e1a16", rx: "3" };
  return (
    <svg viewBox="0 0 460 390" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
      {/* Window 1 — Video */}
      <rect x="8" y="8" width="208" height="152" rx="10" {...winStyle} />
      <rect x="8" y="8" width="208" height="35" rx="10" fill="#181410" />
      <rect x="8" y="28" width="208" height="15" fill="#181410" />
      <circle cx="30" cy="25.5" r="5.5" fill="#524438" /><circle cx="48" cy="25.5" r="5.5" fill="#524438" /><circle cx="66" cy="25.5" r="5.5" fill="#524438" />
      <rect x="82" y="19" width="120" height="13" {...barStyle} />
      <rect x="20" y="53" width="184" height="95" rx="5" fill="#0d0a07" />
      <polygon points="92,78 92,122 128,100" fill={ACCENT} opacity="0.85" />
      <rect x="20" y="144" width="95" height="8" {...barStyle} />
      <text x="112" y="153" fontSize="8" fill="#443B30" fontFamily="sans-serif">Rig Rundown #47...</text>

      {/* Window 2 — Forum */}
      <rect x="246" y="8" width="208" height="152" rx="10" {...winStyle} />
      <rect x="246" y="8" width="208" height="35" rx="10" fill="#181410" />
      <rect x="246" y="28" width="208" height="15" fill="#181410" />
      <circle cx="268" cy="25.5" r="5.5" fill="#524438" /><circle cx="286" cy="25.5" r="5.5" fill="#524438" /><circle cx="304" cy="25.5" r="5.5" fill="#524438" />
      <rect x="320" y="19" width="116" height="13" {...barStyle} />
      <text x="350" y="63" fontSize="9" fill="#554A3C" textAnchor="middle" fontFamily="sans-serif">r/guitarpedals</text>
      {[0,1,2,3].map(i => (
        <rect key={i} x="256" y={72 + i * 20} width={[170,130,155,115][i]} height="9" {...barStyle} />
      ))}
      <text x="350" y="150" fontSize="8" fill="#443B30" textAnchor="middle" fontFamily="sans-serif">147 respuestas, ninguna concreta...</text>

      {/* Window 3 — Another site */}
      <rect x="8" y="178" width="208" height="152" rx="10" {...winStyle} />
      <rect x="8" y="178" width="208" height="35" rx="10" fill="#181410" />
      <rect x="8" y="198" width="208" height="15" fill="#181410" />
      <rect x="38" y="184" width="160" height="13" {...barStyle} />
      {[0,1,2,3].map(i => (
        <g key={i}>
          <circle cx="27" cy={225 + i * 24} r="9" fill="#1a1510" />
          <rect x="42" y={219 + i * 24} width={[145,112,138,98][i]} height="8" {...barStyle} />
          <rect x="42" y={230 + i * 24} width={[105,82,95,72][i]} height="6" fill="#171310" rx="2" />
        </g>
      ))}
      <text x="112" y="324" fontSize="8.5" fill="#443B30" textAnchor="middle" fontFamily="sans-serif">"probablemente un overdrive..."</text>

      {/* Window 4 — Equipboard */}
      <rect x="246" y="178" width="208" height="152" rx="10" {...winStyle} />
      <rect x="246" y="178" width="208" height="35" rx="10" fill="#181410" />
      <rect x="246" y="198" width="208" height="15" fill="#181410" />
      <rect x="276" y="184" width="148" height="13" {...barStyle} />
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="256" y={222 + i * 38} width="44" height="30" rx="5" fill="#1a1510" stroke={BORDER} strokeWidth="1" />
          <rect x="310" y={226 + i * 38} width="125" height="9" {...barStyle} />
          <rect x="310" y={239 + i * 38} width="92" height="6" fill="#171310" rx="2" />
        </g>
      ))}

      {/* Converging dashed lines */}
      {[[112,158],[350,158],[112,330],[350,330]].map(([x,y],i) => (
        <line key={i} x1={x} y1={y} x2="230" y2="362"
          stroke={`rgba(196,155,56,0.18)`} strokeWidth="1.5" strokeDasharray="5,4" />
      ))}

      {/* Central question */}
      <circle cx="230" cy="362" r="20" fill="rgba(196,155,56,0.09)" stroke="rgba(196,155,56,0.32)" strokeWidth="1.5" />
      <text x="230" y="371" textAnchor="middle" fontSize="24" fill={ACCENT} fontFamily="sans-serif" fontWeight="900">?</text>
    </svg>
  );
}

// ─── Solution flow ─────────────────────────────────────────────────────────────
function SolutionFlow({ isMobile }: { isMobile?: boolean }) {
  const nodes = [
    { icon: <IconSearch />, label: "Buscas la canción", sub: "título + artista" },
    { icon: <IconSliders />, label: "Registras tu equipo", sub: "pedalera, amp, guitarra" },
    { icon: <IconDoc />, label: "Recibes los presets", sub: "valores exactos, listos" },
  ];
  return (
    <div style={{ display: "flex", alignItems: isMobile ? "center" : "stretch", justifyContent: "center", gap: "0", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
      {nodes.map((n, i) => (
        <div key={n.label} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            textAlign: "center", padding: "42px 36px",
            backgroundColor: CARD, border: `1px solid ${BORDER}`,
            borderRadius: "16px", minWidth: "180px", maxWidth: "200px",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>{n.icon}</div>
            <p style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.3px", color: TEXT }}>{n.label}</p>
            <p style={{ fontSize: "12px", color: MUTED, marginTop: "6px", lineHeight: 1.5 }}>{n.sub}</p>
          </div>
          {i < nodes.length - 1 && (
            <div style={{ padding: "0 10px", flexShrink: 0 }}>
              <ArrowRight />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const problem  = useInView();
  const solution = useInView();
  const steps    = useInView();
  const features = useInView();
  const quote    = useInView();

  const ctaHref = isAuthenticated ? "/app" : "/login";
  const ctaLabel = isAuthenticated ? "Abrir mi app →" : "Empezar — es gratis →";

  return (
    <div style={{ backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "66px", padding: isMobile ? "0 20px" : "0 52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: scrolled ? "rgba(11,9,7,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "none",
        transition: "background-color 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <PickIcon size={20} />
          <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.6px" }}>
            Guitar<span style={{ color: ACCENT }}>Tone</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Link href="/app" style={{ color: MUTED, textDecoration: "none", fontSize: "14px", fontWeight: 500, display: isMobile ? "none" : "inline" }}>Mi App</Link>
              <Link href="/profile" style={{ color: MUTED, textDecoration: "none", fontSize: "14px", fontWeight: 500, display: isMobile ? "none" : "inline" }}>Perfil</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: MUTED, textDecoration: "none", fontSize: "14px", fontWeight: 500, display: isMobile ? "none" : "inline" }}>Ingresar</Link>
              <Link href="/login" style={{
                background: ACCENT, color: BG,
                padding: "10px 26px", borderRadius: "7px",
                textDecoration: "none", fontSize: "13px", fontWeight: 800,
                letterSpacing: "0.1px",
              }}>
                Empezar
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO with video background ──────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>

        {/* Video background */}
        <video
          autoPlay muted loop playsInline
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: 0.28,
            filter: "grayscale(40%) brightness(0.55) sepia(20%)",
          }}
        >
          {/* Coloca un video en /public/hero-video.mp4  */}
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — warm dark from bottom */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            linear-gradient(to bottom, rgba(11,9,7,0.35) 0%, rgba(11,9,7,0.0) 30%, rgba(11,9,7,0.0) 60%, rgba(11,9,7,0.95) 100%),
            linear-gradient(to right, rgba(11,9,7,0.8) 0%, rgba(11,9,7,0.1) 55%, rgba(11,9,7,0.0) 100%)
          `,
        }} />

        {/* Animated gradient fallback (shows when no video) */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1,
          background: `
            radial-gradient(ellipse 80% 70% at 70% 50%, rgba(196,155,56,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 20% 70%, rgba(143,166,139,0.04) 0%, transparent 60%)
          `,
        }} />

        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,245,220,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,245,220,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        {/* Content */}
        <div style={{
          maxWidth: "1240px", margin: "0 auto", width: "100%",
          padding: isMobile ? "90px 20px 60px" : "120px 52px 90px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
          gap: "60px", alignItems: "center", position: "relative", zIndex: 1,
        }}>

          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(196,155,56,0.1)", border: `1px solid ${BORDER_A}`,
              borderRadius: "100px", padding: "6px 16px", marginBottom: "40px",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: ACCENT }} />
              <span style={{ fontSize: "11px", color: ACCENT, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Para guitarristas</span>
            </div>

            <h1 style={{
              fontSize: "clamp(46px, 5.8vw, 84px)", fontWeight: 900,
              lineHeight: 1.0, letterSpacing: "-3px", marginBottom: "32px",
              color: TEXT,
            }}>
              De escucharlo<br />
              <span style={{ color: ACCENT }}>a tocarlo.</span>
            </h1>

            <p style={{
              fontSize: "clamp(16px, 1.6vw, 20px)", color: MUTED,
              lineHeight: 1.75, marginBottom: "48px", maxWidth: "500px",
            }}>
              Tienes la canción en la cabeza. Nosotros te decimos exactamente cómo configurar tu equipo para sonar así — valores concretos, para tu pedalera y amplificador específicos.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link href={ctaHref} style={{
                background: ACCENT, color: BG,
                padding: "17px 40px", borderRadius: "9px",
                textDecoration: "none", fontSize: "16px", fontWeight: 800,
                letterSpacing: "-0.2px",
                boxShadow: `0 0 52px rgba(196,155,56,0.24)`,
                display: "inline-block",
              }}>
                {ctaLabel}
              </Link>
              <a href="#como-funciona" style={{
                color: TEXT, padding: "17px 36px",
                borderRadius: "9px", border: `1px solid ${BORDER}`,
                textDecoration: "none", fontSize: "15px", fontWeight: 500,
                display: "inline-block",
              }}>
                Ver cómo funciona
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: isMobile ? "24px" : "48px", marginTop: "64px", flexWrap: "wrap" }}>
              {[
                { n: "3 pasos", label: "de la canción al preset" },
                { n: "0 horas", label: "de búsqueda manual" },
                { n: "100%", label: "adaptado a tu equipo" },
              ].map(s => (
                <div key={s.n}>
                  <p style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 900, letterSpacing: "-1px", color: TEXT }}>{s.n}</p>
                  <p style={{ fontSize: "12px", color: MUTED, marginTop: "4px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating pick */}
          <div style={{ display: isMobile ? "none" : "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div style={{ animation: "floatPick 8s ease-in-out infinite" }}>
              <HeroPickSVG />
            </div>
            <div style={{
              position: "absolute", width: "280px", height: "280px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(196,155,56,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          animation: "scrollBounce 2.8s ease-in-out infinite", zIndex: 1,
        }}>
          <span style={{ fontSize: "10px", color: MUTED, letterSpacing: "2.5px", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, ${MUTED}, transparent)` }} />
        </div>
      </section>

      {/* ── EL PROBLEMA ─────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "60px 20px" : "130px 52px", backgroundColor: BG2, position: "relative", overflow: "hidden" }}>
        <div ref={problem.ref} style={{ maxWidth: "1240px", margin: "0 auto", ...appear(problem.v) }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "90px", alignItems: "center" }}>
            <div><SearchChaosIllustration /></div>
            <div>
              <p style={{ fontSize: "11px", color: ACCENT, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "18px" }}>Lo que todo guitarrista conoce</p>
              <h2 style={{
                fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 900,
                lineHeight: 1.08, letterSpacing: "-2px", marginBottom: "40px",
              }}>
                Pasas horas<br />
                buscando un tono que<br />
                <span style={{ color: ACCENT }}>nunca termina<br />de sonar igual.</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {[
                  {
                    n: "01",
                    title: "Cinco pestañas abiertas. Cero respuestas concretas.",
                    desc: "Videos, foros, entrevistas. Todos dicen 'mucha reverb' o 'un poco de crunch'. Nada que puedas escribir en tu pedalera.",
                  },
                  {
                    n: "02",
                    title: "Tu equipo es diferente al del artista.",
                    desc: "Aunque encuentras el nombre del efecto, no sabes cómo replicarlo con lo que tienes en la mano. Los parámetros no coinciden.",
                  },
                  {
                    n: "03",
                    title: "Prueba y error sin fin.",
                    desc: "Ajustas knob por knob, grabas, comparas. Sin una referencia exacta, el tono que escuchas en tu cabeza nunca llega al ampli.",
                  },
                ].map(p => (
                  <div key={p.n} style={{ display: "flex", gap: "20px" }}>
                    <div style={{
                      width: "30px", height: "30px", flexShrink: 0, borderRadius: "50%",
                      border: `1px solid ${BORDER_A}`,
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px",
                    }}>
                      <span style={{ fontSize: "10px", color: ACCENT, fontWeight: 700 }}>{p.n}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: "15.5px", marginBottom: "6px", letterSpacing: "-0.3px" }}>{p.title}</p>
                      <p style={{ color: MUTED, fontSize: "14px", lineHeight: 1.72 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA SOLUCIÓN ─────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "60px 20px" : "130px 52px", backgroundColor: BG }}>
        <div ref={solution.ref} style={{ maxWidth: "1240px", margin: "0 auto", ...appear(solution.v) }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <p style={{ fontSize: "11px", color: ACCENT, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "18px" }}>Así funciona</p>
            <h2 style={{
              fontSize: "clamp(32px, 4.2vw, 60px)", fontWeight: 900,
              letterSpacing: "-2.5px", lineHeight: 1.04,
            }}>
              Tres pasos.<br />
              <span style={{ color: ACCENT }}>El preset es tuyo.</span>
            </h2>
            <p style={{ color: MUTED, fontSize: "17px", marginTop: "22px", maxWidth: "520px", margin: "22px auto 0", lineHeight: 1.75 }}>
              No necesitas saber qué usó el artista. Solo dinos qué canción y qué equipo tienes.
            </p>
          </div>
          <SolutionFlow isMobile={isMobile} />
        </div>
      </section>

      {/* ── CÓMO FUNCIONA detalle ────────────────────────────────────── */}
      <section id="como-funciona" style={{ padding: isMobile ? "60px 20px" : "130px 52px", backgroundColor: BG2 }}>
        <div ref={steps.ref} style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px", ...appear(steps.v) }}>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2px" }}>En detalle.</h2>
            <p style={{ color: MUTED, fontSize: "16px", marginTop: "14px" }}>Cada paso diseñado para que no tengas que pensar en nada más que tocar.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "18px" }}>
            {[
              {
                n: "01", icon: <IconSearch />, title: "Dinos la canción",
                desc: "Escribe título y artista. Confirmamos la versión exacta — con carátula del álbum — para que no haya confusiones.",
              },
              {
                n: "02", icon: <IconSliders />, title: "Agrega tu equipo",
                desc: "Tu pedalera, amplificador, guitarra. Una vez guardados, se reutilizan para todas tus búsquedas futuras. No los vuelves a ingresar.",
              },
              {
                n: "03", icon: <IconDoc />, title: "Recibe los presets",
                desc: "Valores numéricos reales — por sección de la canción — con la cadena de señal, el nivel de ganancia y consejos de ajuste fino.",
              },
            ].map((s, i) => (
              <div key={s.n} style={{
                backgroundColor: CARD, border: `1px solid ${BORDER}`,
                borderRadius: "18px", padding: "40px 32px",
                ...appear(steps.v, i * 0.1),
              }}>
                <div style={{
                  fontSize: "68px", fontWeight: 900, lineHeight: 1,
                  color: `rgba(196,155,56,0.12)`, letterSpacing: "-4px",
                  marginBottom: "14px", fontVariantNumeric: "tabular-nums",
                }}>
                  {s.n}
                </div>
                <div style={{ marginBottom: "22px" }}>{s.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.4px", marginBottom: "12px" }}>{s.title}</h3>
                <p style={{ color: MUTED, fontSize: "14px", lineHeight: 1.72 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "60px 20px" : "130px 52px", backgroundColor: BG }}>
        <div ref={features.ref} style={{ maxWidth: "1240px", margin: "0 auto", ...appear(features.v) }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? "40px" : "90px", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: "11px", color: ACCENT, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "18px" }}>Lo que te damos</p>
              <h2 style={{
                fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 900,
                letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "24px",
              }}>
                Todo lo que<br />
                necesitas para<br />
                sonar <span style={{ color: ACCENT }}>exacto.</span>
              </h2>
              <p style={{ color: MUTED, fontSize: "15px", lineHeight: 1.72 }}>
                Cada detalle pensado para cerrar la brecha entre lo que escuchas y lo que tocas.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px" }}>
              {[
                {
                  icon: <IconTime />,
                  title: "Sin investigación manual",
                  desc: "No más YouTube, foros ni entrevistas. La respuesta exacta aparece en minutos, no en horas.",
                },
                {
                  icon: <IconSliders />,
                  title: "Valores numéricos reales",
                  desc: "No 'bastante reverb'. Sino Reverb Time: 3.2 — Mix: 45 — Decay: 0.8. Números que puedes ingresar ahora mismo.",
                },
                {
                  icon: <IconDoc />,
                  title: "Presupuestos de ajuste fino",
                  desc: "Cada preset incluye tips específicos: 'Si suena sucio, baja Drive a 4'. Con el nombre exacto del parámetro.",
                },
                {
                  icon: <IconSearch />,
                  title: "Cadena de señal completa",
                  desc: "Qué efectos usó el artista en esa grabación, en qué orden, con qué amplificador. No estimaciones.",
                },
                {
                  icon: <PickIcon size={24} />,
                  title: "Tu equipo, siempre guardado",
                  desc: "Registras tu pedalera una vez. Todas las búsquedas futuras usan ese mismo setup sin volver a ingresarlo.",
                },
                {
                  icon: <IconTime />,
                  title: "Búsquedas que se recuerdan",
                  desc: "Una canción investigada queda en el sistema. La próxima vez que alguien la busca, el resultado es instantáneo.",
                },
              ].map(f => (
                <div key={f.title} style={{
                  backgroundColor: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: "14px", padding: "28px 24px",
                }}>
                  <div style={{ marginBottom: "16px", color: ACCENT }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: "14.5px", letterSpacing: "-0.2px", marginBottom: "8px" }}>{f.title}</h3>
                  <p style={{ color: MUTED, fontSize: "13px", lineHeight: 1.68 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "80px 20px" : "170px 52px", backgroundColor: BG2, position: "relative", overflow: "hidden" }}>
        {/* Watermark pick */}
        <div style={{
          position: "absolute", right: "-140px", top: "50%",
          transform: "translateY(-50%) rotate(10deg)",
          opacity: 0.022, pointerEvents: "none",
        }}>
          <svg viewBox="0 0 320 385" style={{ width: "560px" }} xmlns="http://www.w3.org/2000/svg">
            <path d="M160 14 C82 14 18 72 18 148 C18 228 74 318 160 370 C246 318 302 228 302 148 C302 72 238 14 160 14 Z" fill={ACCENT} />
          </svg>
        </div>

        <div ref={quote.ref} style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center", ...appear(quote.v) }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "44px" }}>
            <PickIcon size={42} />
          </div>
          <blockquote style={{
            fontSize: "clamp(26px, 4.5vw, 58px)", fontWeight: 900,
            lineHeight: 1.12, letterSpacing: "-2px", fontStyle: "italic",
          }}>
            "Escuchas el tono<br />
            que quieres tocar.<br />
            <span style={{ color: ACCENT }}>Ahora llégale.</span>"
          </blockquote>
          <p style={{ marginTop: "36px", color: MUTED, fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
            GuitarTone — Para guitarristas que tocan, no que buscan.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "60px 20px" : "130px 52px", backgroundColor: BG }}>
        <div style={{
          maxWidth: "760px", margin: "0 auto", textAlign: "center",
          backgroundColor: CARD, border: `1px solid ${BORDER_A}`,
          borderRadius: "24px", padding: isMobile ? "50px 28px" : "84px 60px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-70px", left: "50%", transform: "translateX(-50%)",
            width: "500px", height: "240px",
            background: "radial-gradient(ellipse, rgba(196,155,56,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
            <PickIcon size={38} />
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900,
            letterSpacing: "-2px", marginBottom: "22px", lineHeight: 1.1,
          }}>
            El tono que buscas<br />
            <span style={{ color: ACCENT }}>ya tiene tu nombre.</span>
          </h2>
          <p style={{ color: MUTED, fontSize: "16px", marginBottom: "44px", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto 44px" }}>
            Sin tarjeta de crédito. Sin instalaciones. Presets para tu equipo en minutos.
          </p>
          <Link href={ctaHref} style={{
            background: ACCENT, color: BG,
            padding: "19px 54px", borderRadius: "10px",
            textDecoration: "none", fontSize: "17px", fontWeight: 900,
            letterSpacing: "-0.3px",
            boxShadow: `0 0 80px rgba(196,155,56,0.3)`,
            display: "inline-block",
          }}>
            {ctaLabel}
          </Link>
          <p style={{ fontSize: "12px", color: MUTED, marginTop: "20px" }}>Cuenta gratuita. Sin tarjeta.</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${BORDER}`, padding: isMobile ? "28px 20px" : "36px 52px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <PickIcon size={15} />
          <span style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "-0.3px" }}>GuitarTone</span>
        </div>
        <p style={{ fontSize: "13px", color: MUTED }}>© 2026 — Hecho para guitarristas, por guitarristas.</p>
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/login" style={{ fontSize: "13px", color: MUTED, textDecoration: "none" }}>Ingresar</Link>
          <Link href="/app" style={{ fontSize: "13px", color: MUTED, textDecoration: "none" }}>App</Link>
        </div>
      </footer>

      {/* ── Keyframes ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes floatPick {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
