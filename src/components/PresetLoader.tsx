import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Music,
  Search,
  Cpu,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Phase = { label: string; duration: number; Icon: LucideIcon };

const PHASES: Phase[] = [
  { label: "Analizando canción",         duration: 4000, Icon: Music },
  { label: "Investigando tono original", duration: 6000, Icon: Search },
  { label: "Procesando con IA",          duration: 6000, Icon: Cpu },
  { label: "Configurando parámetros",    duration: 5000, Icon: SlidersHorizontal },
  { label: "Finalizando presets",        duration: 3000, Icon: CheckCircle2 },
];

const TOTAL_DURATION = PHASES.reduce((a, p) => a + p.duration, 0);

type Props = {
  isVisible: boolean;
  songTitle: string;
  songArtist: string;
  gearNames: string[];
};

export default function PresetLoader({ isVisible, songTitle, songArtist, gearNames }: Props) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Mount/unmount with fade animations
  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      setExiting(false);
      setCurrentPhase(0);
      setCompletedPhases(new Set());
    } else if (mounted) {
      setExiting(true);
      const t = setTimeout(() => {
        setMounted(false);
        setExiting(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Phase cycling while mounted
  useEffect(() => {
    if (!mounted || exiting || currentPhase >= PHASES.length - 1) return;
    const t = setTimeout(() => {
      setCompletedPhases((prev) => new Set([...prev, currentPhase]));
      setCurrentPhase((prev) => prev + 1);
    }, PHASES[currentPhase].duration);
    return () => clearTimeout(t);
  }, [currentPhase, mounted, exiting]);

  if (!mounted) return null;

  const progress = Math.round(
    (PHASES.slice(0, currentPhase).reduce((a, p) => a + p.duration, 0) / TOTAL_DURATION) * 100
  );

  const CurrentIcon = PHASES[currentPhase].Icon;

  return createPortal(
    <div
      className={exiting ? "preset-loader-exit" : "preset-loader-enter"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 10, 12, 0.97)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      role="status"
      aria-live="polite"
      aria-label={`Generando presets: ${PHASES[currentPhase].label}`}
    >
      {/* Audio bars visualizer */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "3px",
          height: "40px",
          marginBottom: "2rem",
        }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`audio-bar-${i + 1}`}
            style={{
              width: "6px",
              height: "40px",
              borderRadius: "3px",
              background: "var(--color-accent, #cc0000)",
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>

      {/* Song info */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 900,
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {songTitle}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.5)",
            marginTop: "0.25rem",
          }}
        >
          {songArtist}
        </p>
      </div>

      {/* Current phase indicator */}
      <div
        className="phase-pulse"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <CurrentIcon
          style={{
            width: "1rem",
            height: "1rem",
            color: "var(--color-accent, #cc0000)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {PHASES[currentPhase].label}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "2px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "1px",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--color-accent, #cc0000)",
            borderRadius: "1px",
            transition: "width 400ms ease",
          }}
        />
      </div>

      {/* Phase checklist */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "320px",
          width: "100%",
          marginBottom: "1.5rem",
        }}
      >
        {PHASES.map((phase, idx) => {
          const PhaseIcon = phase.Icon;
          const isCompleted = completedPhases.has(idx);
          const isActive = idx === currentPhase;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: isCompleted || isActive ? 1 : 0.3,
                transition: "opacity 300ms ease",
              }}
            >
              {isCompleted ? (
                <CheckCircle2
                  style={{
                    width: "0.875rem",
                    height: "0.875rem",
                    color: "var(--color-accent, #cc0000)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <PhaseIcon
                  style={{
                    width: "0.875rem",
                    height: "0.875rem",
                    color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-body)",
                  color: isCompleted
                    ? "rgba(255,255,255,0.9)"
                    : isActive
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.3)",
                  transition: "color 300ms ease",
                }}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gear badges */}
      {gearNames.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.375rem",
            justifyContent: "center",
            maxWidth: "360px",
          }}
        >
          {gearNames.map((name, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.6875rem",
                fontFamily: "var(--font-body)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.5)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
