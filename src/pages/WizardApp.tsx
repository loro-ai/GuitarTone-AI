import { useState, useEffect, type ReactNode } from "react";
import React from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Navbar from '../templates/fender-system/components/Navbar';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Music,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Trash2,
  Pencil,
  Guitar,
  Zap,
  Speaker,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { MusicBrainzResult, PresetConfig, GearConfig, IGear, IGearModule, ToneResearch, SongEstructuraSection, SongStructureSection, AmpReference } from "@/types/api";
import PresetLoader from "@/components/PresetLoader";
import { AMPS_REF, PEDALS_REF, PROCESSORS_REF } from "@/const/gear-library";

type Step = 1 | 2 | 3 | 4;

const WIZARD_NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Mis presets', href: '/profile' },
]

// ─── Librería de opciones de equipos ─────────────────────────────────────────

type GearType = "pedalera" | "amplificador" | "guitarra" | "procesador" | "otro";

interface LibraryOption { key: string; label: string; brand: string; model: string }

function getLibraryOptions(type: GearType): LibraryOption[] {
  if (type === 'amplificador')
    return AMPS_REF.map(a => ({ key: `${a.marca}||${a.modelo}`, label: `${a.modelo} — ${a.marca}`, brand: a.marca, model: a.modelo }));
  if (type === 'procesador')
    return PROCESSORS_REF.map(p => ({ key: `${p.marca}||${p.modelo}`, label: `${p.modelo} — ${p.marca}`, brand: p.marca, model: p.modelo }));
  if (type === 'pedalera' || type === 'otro')
    return PEDALS_REF.map(p => ({ key: `${p.marca}||${p.modelo}`, label: `${p.modelo} — ${p.marca}`, brand: p.marca, model: p.modelo }));
  return [];
}

// ─── Componente resumen de investigación de tono ──────────────────────────────

function ToneResearchSummary({ data }: { data: ToneResearch }) {
  const distortionLabel = data.nivelDistorsion
    ? data.nivelDistorsion.charAt(0).toUpperCase() + data.nivelDistorsion.slice(1)
    : null;

  const distortionColor =
    data.esTocadoLimpio
      ? "text-green-500"
      : data.nivelDistorsion?.includes("heavy") || data.nivelDistorsion?.includes("high")
        ? "text-red-400"
        : "text-yellow-500";

  return (
    <div className="p-4 bg-card/70 border border-accent/20 rounded-lg space-y-3 text-sm text-left">
      <p className="font-semibold text-foreground flex items-center gap-2">
        <Guitar className="w-4 h-4 text-accent" />
        Investigación del tono original
      </p>

      {/* Descripción del tono */}
      {data.descripcion_tono && (
        <p className="text-foreground/90 leading-relaxed">{data.descripcion_tono}</p>
      )}

      {/* Nivel de distorsión */}
      {distortionLabel && (
        <div className="flex items-center gap-2">
          <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${distortionColor}`} />
          <span className="text-muted-foreground">Ganancia:</span>
          <span className={`font-medium ${distortionColor}`}>{distortionLabel}</span>
          {data.esTocadoLimpio && (
            <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">limpio</span>
          )}
        </div>
      )}

      {/* Guitarra */}
      {data.guitarra?.marca && (
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">Guitarra</p>
          <p className="text-muted-foreground">
            {data.guitarra.marca} {data.guitarra.modelo}
            {data.guitarra.pastillas && (
              <span className="text-xs ml-1">— {data.guitarra.pastillas}</span>
            )}
          </p>
        </div>
      )}

      {/* Amplificador */}
      {data.amplificador?.marca && (
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">Amplificador</p>
          <p className="text-muted-foreground">
            {data.amplificador.marca} {data.amplificador.modelo}
            {data.amplificador.configuracion && (
              <span className="text-xs ml-1">— {data.amplificador.configuracion}</span>
            )}
          </p>
        </div>
      )}

      {/* Cadena de señal */}
      {data.cadenaSenal && data.cadenaSenal.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">Cadena de señal</p>
          <div className="flex flex-wrap gap-1.5">
            {data.cadenaSenal.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full">{item}</span>
                {i < data.cadenaSenal!.length - 1 && (
                  <span className="text-muted-foreground text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Técnica */}
      {(data.tecnica || data.techniques.length > 0) && (
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">Técnica</p>
          <p className="text-muted-foreground">{data.tecnica || data.techniques.join(", ")}</p>
        </div>
      )}

      {/* Notas */}
      {data.notes && (
        <p className="text-xs text-muted-foreground italic border-t border-border/40 pt-2">{data.notes}</p>
      )}
    </div>
  );
}

// ─── Colores por tipo de equipo ───────────────────────────────────────────────
const GEAR_PALETTE: Record<string, { bg: string; accent: string; icon: ReactNode }> = {
  pedalera:     { bg: "from-violet-900/40 to-violet-800/20",   accent: "text-violet-400", icon: <SlidersHorizontal className="w-5 h-5" /> },
  procesador:   { bg: "from-blue-900/40 to-blue-800/20",       accent: "text-blue-400",   icon: <SlidersHorizontal className="w-5 h-5" /> },
  amplificador: { bg: "from-orange-900/40 to-orange-800/20",   accent: "text-orange-400", icon: <Speaker className="w-5 h-5" /> },
  guitarra:     { bg: "from-emerald-900/40 to-emerald-800/20", accent: "text-emerald-400",icon: <Guitar className="w-5 h-5" /> },
  otro:         { bg: "from-zinc-800/40 to-zinc-700/20",       accent: "text-zinc-400",   icon: <Music className="w-5 h-5" /> },
};

// ─── Tarjeta de especificaciones técnicas del equipo ─────────────────────────
function GearSpecCard({ gear }: { gear: IGear }) {
  const [expanded, setExpanded] = useState(false);
  const palette = GEAR_PALETTE[gear.type] ?? GEAR_PALETTE.otro;
  const md = gear.manualData;
  const isMulti = md?.esMultiEfectos;
  const totalEffects = md?.modules?.reduce((sum, m) => sum + m.efectos.length, 0) ?? 0;

  const specsQuery = trpc.gear.getSpecs.useQuery(
    { gearId: String(gear._id), brand: gear.brand ?? '', model: gear.model ?? '', type: gear.type },
    { enabled: !!gear.brand && !!gear.model }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specs = specsQuery.data?.specs as any;
  if (specs) console.log('[GearSpecs result]', String(gear._id), specs);

  return (
    <div className={`rounded-xl border border-border/50 overflow-hidden bg-gradient-to-br ${palette.bg}`}>
      {/* Cabecera */}
      <div className="px-4 pt-4 pb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className={palette.accent}>{palette.icon}</span>
          <span className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>{gear.type}</span>
        </div>
        <p className="font-bold text-foreground leading-tight">{gear.name}</p>
        {(gear.brand || gear.model) && (
          <p className="text-xs text-muted-foreground">{[gear.brand, gear.model].filter(Boolean).join(" · ")}</p>
        )}
      </div>

      {/* Imagen del equipo */}
      {md?.imageUrl && (
        <div className="relative h-36 overflow-hidden bg-black/20">
          <img
            src={md.imageUrl}
            alt={gear.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Resumen rápido */}
      {md && (
        <div className="px-4 pb-3 space-y-2 text-xs">
          <p className="text-muted-foreground line-clamp-2">{md.description}</p>
          {isMulti ? (
            <div className="flex flex-wrap gap-1.5">
              {(md.modules ?? []).map((mod: IGearModule) => (
                <span key={mod.nombre}
                  className={`px-2 py-0.5 rounded-full border border-border/50 text-[10px] font-semibold ${palette.accent}`}>
                  {mod.nombre}
                  {mod.efectos.length > 0 && <span className="ml-1 opacity-60">×{mod.efectos.length}</span>}
                </span>
              ))}
            </div>
          ) : (
            <p className={`font-medium ${palette.accent}`}>
              {md.parameters.length} parámetros configurables
            </p>
          )}
        </div>
      )}

      {!md && (
        <div className="px-4 pb-3 text-xs space-y-1">
          {specsQuery.isLoading && (
            <p className="text-muted-foreground italic">Cargando especificaciones...</p>
          )}
          {!specsQuery.isLoading && specs && (
            <>
              {/* Procesador — detectado dinámicamente por presencia de procId */}
              {specs.procId != null && (
                <div className="space-y-0.5">
                  <p className={`font-semibold ${palette.accent}`}>{specs.procId as string}{specs.arquitectura ? ` · ${specs.arquitectura as string}` : ''}</p>
                  {specs.totalAlgoritmos != null && (
                    <p className="text-foreground/80">{specs.totalAlgoritmos as number} algoritmos disponibles</p>
                  )}
                  {specs.slotsSummary && (
                    <p className="text-muted-foreground">{specs.slotsSummary as string}</p>
                  )}
                </div>
              )}
              {/* Amplificador */}
              {specs.procId == null && gear.type === 'amplificador' && (
                <div className="space-y-0.5">
                  {specs.controles && <p className="text-foreground/80">{specs.controles as string}</p>}
                  {specs.rango && <p className="text-muted-foreground">Rango: {specs.rango as string}</p>}
                  {specs.notas && <p className="text-muted-foreground">{(specs.notas as string).slice(0, 80)}{(specs.notas as string).length > 80 ? '…' : ''}</p>}
                </div>
              )}
              {/* Pedal / Otro */}
              {specs.procId == null && gear.type !== 'amplificador' && (
                <div className="space-y-0.5">
                  {specs.tipo && <p className={`font-semibold ${palette.accent}`}>{specs.tipo as string}</p>}
                  {specs.controles && <p className="text-foreground/80">{specs.controles as string}</p>}
                  {specs.notas && <p className="text-muted-foreground">{(specs.notas as string).slice(0, 80)}{(specs.notas as string).length > 80 ? '…' : ''}</p>}
                </div>
              )}
            </>
          )}
          {!specsQuery.isLoading && !specs && (
            <p className="text-muted-foreground italic">Especificaciones no disponibles</p>
          )}
        </div>
      )}

      {/* Toggle de detalles */}
      {md && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between px-4 py-2 border-t border-border/40 text-xs text-muted-foreground hover:bg-white/5 transition-colors"
        >
          <span>{expanded ? "Ocultar capacidades" : "Ver capacidades completas"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Detalles expandidos */}
      {md && expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/30">
          {/* Módulos con sus efectos */}
          {isMulti && md.modules && md.modules.length > 0 && (
            <div className="space-y-2 pt-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Módulos disponibles</p>
              {md.modules.map((mod: IGearModule) => (
                <div key={mod.nombre} className="rounded-lg border border-border/40 overflow-hidden text-xs">
                  <div className={`flex items-center gap-2 px-3 py-1.5 bg-background/50`}>
                    <span className={`font-bold uppercase ${palette.accent}`}>{mod.nombre}</span>
                    <span className="text-muted-foreground">{mod.label}</span>
                    {mod.puedeApagarse && <span className="ml-auto text-[10px] text-muted-foreground">ON/OFF</span>}
                  </div>
                  {mod.efectos.length > 0 && (
                    <div className="px-3 py-2 space-y-1 bg-background/30">
                      {mod.efectos.map(ef => (
                        <div key={ef.tipo} className="flex items-start gap-2">
                          <span className="text-foreground/80 font-medium shrink-0">{ef.tipo}</span>
                          <span className="text-muted-foreground">
                            {ef.parametros.map(p => `${p.nombre} [${p.rango}]`).join(", ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {totalEffects > 0 && (
                <p className={`text-xs font-semibold ${palette.accent}`}>
                  {totalEffects} efectos disponibles en total
                </p>
              )}
            </div>
          )}

          {/* Parámetros planos */}
          {!isMulti && md.parameters.length > 0 && (
            <div className="space-y-1.5 pt-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Parámetros</p>
              <div className="grid grid-cols-1 gap-1">
                {md.parameters.map(p => (
                  <div key={p.name} className="flex items-center gap-2 text-xs">
                    <span className={`font-semibold ${palette.accent} w-28 shrink-0`}>{p.name}</span>
                    <span className="text-muted-foreground">[{p.range}]</span>
                    <span className="text-foreground/70 truncate">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learnings / lo que NO puede hacer */}
          {md.learnings && md.learnings.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-semibold text-amber-400 flex items-center gap-1 uppercase tracking-wide">
                <AlertTriangle className="w-3 h-3" /> Reglas críticas
              </p>
              <ul className="space-y-1">
                {md.learnings.map((l, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-amber-400 shrink-0">•</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notas del manual */}
          {md.notes && (
            <p className="text-xs text-muted-foreground italic border-t border-border/30 pt-2">{md.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Specs inline para tarjeta de configuración base (paso 4) ────────────────
function BaseGearSpecCard({ gc, allGear }: { gc: GearConfig; allGear: IGear[] }) {
  const matched = allGear.find(g => String(g._id) === gc.gearId);
  const specsQuery = trpc.gear.getSpecs.useQuery(
    {
      gearId: gc.gearId,
      brand: matched?.brand ?? gc.gearNombre,
      model: matched?.model ?? '',
      type: gc.gearTipo,
    },
    { enabled: !!(matched?.brand && matched?.model) }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specs = specsQuery.data?.specs as any;
  if (!specs && !specsQuery.isLoading) return null;

  return (
    <div className="px-3 pb-2 text-xs space-y-0.5">
      {specsQuery.isLoading && <p className="text-muted-foreground italic">Cargando especificaciones...</p>}
      {specs && (
        <>
          {specs.procId != null && (
            <>
              <p className="text-blue-400 font-semibold">{specs.procId}{specs.arquitectura ? ` · ${specs.arquitectura}` : ''}</p>
              {specs.totalAlgoritmos != null && <p className="text-foreground/80">{specs.totalAlgoritmos} algoritmos</p>}
              {specs.slotsSummary && <p className="text-muted-foreground">{specs.slotsSummary}</p>}
            </>
          )}
          {specs.procId == null && gc.gearTipo === 'amplificador' && (
            <>
              {specs.controles && <p className="text-foreground/80">{specs.controles}</p>}
              {specs.rango && <p className="text-muted-foreground">Rango: {specs.rango}</p>}
              {specs.notas && <p className="text-muted-foreground">{String(specs.notas).slice(0, 100)}{String(specs.notas).length > 100 ? '…' : ''}</p>}
            </>
          )}
          {specs.procId == null && gc.gearTipo !== 'amplificador' && (
            <>
              {specs.tipo && <p className="text-emerald-400 font-semibold">{specs.tipo}</p>}
              {specs.controles && <p className="text-foreground/80">{specs.controles}</p>}
              {specs.notas && <p className="text-muted-foreground">{String(specs.notas).slice(0, 100)}{String(specs.notas).length > 100 ? '…' : ''}</p>}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── Gradientes por nivel de distorsión (calidez → oscuridad) ────────────────
const DISTORTION_THEME: Record<string, { gradient: string; border: string; text: string; badge: string; glow: string }> = {
  clean:         { gradient: 'from-emerald-950/60 via-emerald-900/30 to-transparent', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300', glow: 'shadow-emerald-500/10' },
  'light-crunch': { gradient: 'from-lime-950/60 via-yellow-900/25 to-transparent', border: 'border-lime-500/30', text: 'text-lime-300', badge: 'bg-lime-500/20 text-lime-300', glow: 'shadow-lime-500/10' },
  crunch:        { gradient: 'from-amber-950/60 via-orange-900/30 to-transparent', border: 'border-amber-500/30', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300', glow: 'shadow-amber-500/10' },
  'high-gain':   { gradient: 'from-red-950/70 via-red-900/35 to-transparent', border: 'border-red-500/35', text: 'text-red-300', badge: 'bg-red-500/20 text-red-300', glow: 'shadow-red-500/15' },
  heavy:         { gradient: 'from-rose-950/80 via-rose-900/40 to-transparent', border: 'border-rose-500/40', text: 'text-rose-300', badge: 'bg-rose-500/25 text-rose-300', glow: 'shadow-rose-500/20' },
};
const DEFAULT_DISTORTION_THEME = { gradient: 'from-zinc-900/50 via-zinc-800/25 to-transparent', border: 'border-zinc-500/30', text: 'text-zinc-300', badge: 'bg-zinc-500/20 text-zinc-300', glow: 'shadow-zinc-500/10' };

function getDistortionTheme(level?: string) {
  return DISTORTION_THEME[level ?? ''] ?? DEFAULT_DISTORTION_THEME;
}

// ─── Dinámica a barra visual ─────────────────────────────────────────────────
const DINAMICA_LEVELS: Record<string, number> = { pp: 1, p: 2, mp: 3, mf: 4, f: 5, ff: 6 };

function DinamicaBar({ dinamica, color }: { dinamica?: string; color?: string }) {
  if (!dinamica) return null;
  const level = DINAMICA_LEVELS[dinamica] ?? 3;
  const barColor = color ?? 'bg-accent';
  return (
    <div className="flex items-center gap-0.5" title={`Dinámica: ${dinamica}`}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${i <= level ? barColor : 'bg-white/10'}`}
          style={{ height: `${3 + i * 2}px` }}
        />
      ))}
      <span className="text-[10px] text-muted-foreground ml-1 tabular-nums">{dinamica}</span>
    </div>
  );
}

// ─── Estructura de la canción (desde toneResearch.estructura) ────────────────
function SongStructure({ estructura }: { estructura: SongEstructuraSection[] }) {
  if (!estructura || estructura.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
        <Music className="w-3.5 h-3.5 text-accent" /> Estructura de la canción
      </p>
      {/* Timeline visual */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {estructura.map((sec, i) => {
          const theme = getDistortionTheme(sec.nivel_distorsion);
          return (
            <div key={i} className="flex items-center shrink-0">
              <div className={`px-3 py-2.5 rounded-lg border text-xs text-center min-w-[80px] bg-gradient-to-b ${theme.gradient} ${theme.border} shadow-lg ${theme.glow}`}>
                <p className={`font-bold leading-tight uppercase tracking-wide ${theme.text}`}>{sec.seccion}</p>
                {sec.dinamica && (
                  <div className="mt-1 flex justify-center">
                    <DinamicaBar dinamica={sec.dinamica} color={theme.badge.split(' ')[0]} />
                  </div>
                )}
              </div>
              {i < estructura.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 mx-0.5" />
              )}
            </div>
          );
        })}
      </div>
      {/* Detalle por sección */}
      <div className="grid grid-cols-1 gap-2">
        {estructura.map((sec, i) => {
          const theme = getDistortionTheme(sec.nivel_distorsion);
          return (
            <div key={i} className={`rounded-xl border overflow-hidden ${theme.border} shadow-md ${theme.glow}`}>
              <div className={`bg-gradient-to-r ${theme.gradient} px-4 py-2.5`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold uppercase tracking-widest text-xs ${theme.text}`}>{sec.seccion}</span>
                    {sec.nivel_distorsion && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badge} ${theme.border}`}>
                        {sec.nivel_distorsion}
                      </span>
                    )}
                  </div>
                  <DinamicaBar dinamica={sec.dinamica} color={theme.badge.split(' ')[0]} />
                </div>
              </div>
              <div className="px-4 py-2 space-y-1.5 bg-black/20">
                {sec.tecnica && (
                  <p className="text-xs text-foreground/80">{sec.tecnica}</p>
                )}
                {sec.efectos_clave && sec.efectos_clave.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {sec.efectos_clave.map((fx, j) => (
                      <span key={j} className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badge} ${theme.border}`}>
                        {fx}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Song Structure v2 (songStructure con intensidad y EQ) ──────────────────
const TEXTURE_THEME: Record<string, { gradient: string; border: string; text: string; badge: string }> = {
  clean:  { gradient: 'from-emerald-950/60 via-emerald-900/20 to-transparent', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  crunch: { gradient: 'from-amber-950/60 via-amber-900/20 to-transparent',   border: 'border-amber-500/30',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  heavy:  { gradient: 'from-red-950/60 via-red-900/20 to-transparent',       border: 'border-red-500/30',     text: 'text-red-400',     badge: 'bg-red-500/20 text-red-300 border-red-500/30' },
};
const DEFAULT_TEXTURE_THEME = TEXTURE_THEME.crunch;

function SongStructureV2({ sections }: { sections: SongStructureSection[] }) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
        <Music className="w-3.5 h-3.5 text-accent" /> Estructura de la canción
      </p>
      {/* Timeline */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {sections.map((sec, i) => {
          const theme = TEXTURE_THEME[sec.texture] ?? DEFAULT_TEXTURE_THEME;
          const barW = Math.max(sec.intensity * 10, 20);
          return (
            <div key={i} className="flex items-center shrink-0">
              <div className={`px-3 py-2.5 rounded-lg border text-xs text-center min-w-[80px] bg-gradient-to-b ${theme.gradient} ${theme.border} shadow-lg`}>
                <p className={`font-bold leading-tight uppercase tracking-wide ${theme.text}`}>{sec.section}</p>
                <div className="mt-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sec.texture === 'clean' ? 'bg-emerald-400' : sec.texture === 'heavy' ? 'bg-red-400' : 'bg-amber-400'}`} style={{ width: `${barW}%` }} />
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">{sec.intensity}/10</p>
              </div>
              {i < sections.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 mx-0.5" />
              )}
            </div>
          );
        })}
      </div>
      {/* Detail cards */}
      <div className="grid grid-cols-1 gap-2">
        {sections.map((sec, i) => {
          const theme = TEXTURE_THEME[sec.texture] ?? DEFAULT_TEXTURE_THEME;
          return (
            <div key={i} className={`rounded-xl border overflow-hidden ${theme.border} shadow-md`}>
              <div className={`bg-gradient-to-r ${theme.gradient} px-4 py-2.5`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold uppercase tracking-widest text-xs ${theme.text}`}>{sec.section}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badge}`}>{sec.texture}</span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{sec.intensity}/10</span>
                </div>
              </div>
              <div className="px-4 py-2 space-y-1.5 bg-black/20">
                {/* EQ adjust */}
                {sec.eqAdjust && (
                  <div className="flex gap-3 text-[10px]">
                    <span className="text-muted-foreground">EQ:</span>
                    <span className="text-foreground font-bold tabular-nums">B {sec.eqAdjust.bass}</span>
                    <span className="text-foreground font-bold tabular-nums">M {sec.eqAdjust.mid}</span>
                    <span className="text-foreground font-bold tabular-nums">T {sec.eqAdjust.treble}</span>
                  </div>
                )}
                {sec.technique && (
                  <p className="text-xs text-foreground/80">{sec.technique}</p>
                )}
                {sec.keyEffects && sec.keyEffects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {sec.keyEffects.map((fx, j) => (
                      <span key={j} className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badge}`}>
                        {fx}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Timeline de presets (fallback sin estructura) ───────────────────────────
function SongTimeline({ presets }: { presets: PresetConfig[] }) {
  if (presets.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
        <SlidersHorizontal className="w-3.5 h-3.5 text-accent" /> Presets generados
      </p>
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {presets.map((p, i) => {
          const tag = (p.tag ?? '').toUpperCase();
          const tagStyle = TAG_STYLES[tag] ?? DEFAULT_TAG_STYLE;
          return (
            <div key={i} className="flex items-center shrink-0">
              <div className={`px-3 py-2 rounded-lg border text-xs text-center min-w-[80px] ${tagStyle.badge}`}>
                <p className="font-bold leading-tight">{tag || p.nombre}</p>
                {p.momento_cancion && (
                  <p className="text-[10px] opacity-70 mt-0.5">{p.momento_cancion}</p>
                )}
              </div>
              {i < presets.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mx-0.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Nombres amigables para parámetros técnicos ──────────────────────────────
function friendlyParam(key: string): string {
  const k = key.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/^(LO|LOW|BASS|BAS|50HZ|80HZ|100HZ|200HZ|LOWS|LOWEND)$/.test(k)) return "Bajos";
  if (/^(MID|MIDDLE|MIDRANGE|MIDS|500HZ|800HZ|1KHZ|15KHZ|2KHZ|MEDIUM)$/.test(k)) return "Medios";
  if (/^(HI|HIGH|TREBLE|TRE|HIGHS|5KHZ|8KHZ|10KHZ|12KHZ|16KHZ|PRESENCE|BRILLIANCE)$/.test(k)) return "Agudos";
  if (/^(GAIN|PREGAIN|DRIVE|OD|OVERDRIVE|DISTORTION|DIST)$/.test(k)) return "Ganancia";
  if (/^(VOL|VOLUME|LEVEL|LVL|MASTER|POSTGAIN|OUTPUT)$/.test(k)) return "Volumen";
  if (/^(REV|REVERB|RVBLVL)$/.test(k)) return "Reverb";
  if (/^(DLY|DELAY|DLYTIME|ECHO)$/.test(k)) return "Delay";
  if (/^(CHORUS|CHO)$/.test(k)) return "Chorus";
  if (/^(COMP|COMPRESSOR|COMPRESS)$/.test(k)) return "Compresor";
  if (/^(ZNR|NOISERED|NR|NOISE)$/.test(k)) return "Reducción ruido";
  if (/^(PATCHLEVEL|PATCH_LEVEL|PATCHVOL)$/.test(k)) return "Nivel patch";
  if (/^(MIX|DRYWET|BLEND)$/.test(k)) return "Mezcla";
  if (/^(TONE|TONEKNOB)$/.test(k)) return "Tono";
  if (/^(SPEED|RATE)$/.test(k)) return "Velocidad";
  if (/^(DEPTH|DEP)$/.test(k)) return "Profundidad";
  if (/^(SUSTAIN|SUS)$/.test(k)) return "Sustain";
  if (/^(ATTACK|ATK)$/.test(k)) return "Ataque";
  if (/^(RELEASE|REL)$/.test(k)) return "Release";
  return key; // fallback: nombre original
}

// ─── Helpers para el formato display del Zoom B1 ─────────────────────────────
const ZOOM_DISPLAY_LABELS: Record<string, string> = {
  C: 'Compressor', L: 'Limiter',
  A: 'Auto Wah', F: 'Resonance Filter', O: 'Octave', T: 'Tremolo',
  P: 'Phaser', R: 'Ring Mod', D: 'Defret', S: 'Slow Attack', V: 'Pedal Vox',
  E: 'Ensemble', M: 'Mono Pitch', H: 'HPS / Hall Reverb',
  B: 'Pitch Bend', N: 'Detune',
  AG: 'Ampeg SVT', SB: 'Super Bass', SW: 'SWR SM-900', AC: 'Acoustic 360',
  BM: 'Bassman', HA: 'Hartke HA3500', TE: 'Trace Elliot', TU: 'Tube Pre',
  SA: 'SansAmp', TS: 'TS9 Tube Screamer', OD: 'ODB-3',
  DS: 'MXR Bass D.I.+', FF: 'Fuzz Face', MS: 'Mono Syn',
};

function parseDisplay(display: string): { nombre: string; nivel: string } {
  if (!display) return { nombre: display, nivel: '' };
  const two = display.slice(0, 2).toUpperCase();
  if (ZOOM_DISPLAY_LABELS[two]) return { nombre: ZOOM_DISPLAY_LABELS[two], nivel: display.slice(2) };
  const one = display.slice(0, 1).toUpperCase();
  return { nombre: ZOOM_DISPLAY_LABELS[one] ?? display, nivel: display.slice(1) };
}

function eqValue(v: number): string {
  const diff = v - 13;
  if (diff === 0) return '0';
  return diff > 0 ? `+${diff}` : String(diff);
}

const ZOOM_SLOT_LABELS: Record<string, string> = {
  COMP_LIMIT: 'COMP/LIMIT', EFX: 'EFX', DRIVE: 'DRIVE',
  MOD_DELAY: 'MOD/DELAY', REV_DELAY: 'REV/DELAY',
};

// ─── Renderizado de módulos del Zoom B1 (formato display v6) ─────────────────
function ZoomModuleBlock({ modKey, value }: { modKey: string; value: unknown }) {
  // ZNR y PATCH_LVL: números directos
  if (typeof value === 'number') {
    const label = modKey === 'ZNR' ? 'Reducción de ruido' : modKey === 'PATCH_LVL' ? 'Nivel patch' : modKey;
    return (
      <div className="text-xs px-3 py-2 flex justify-between items-center gap-2 border-b border-border/20 last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold tabular-nums">{value}</span>
      </div>
    );
  }
  // EQ: { LO, MID, HI } en escala 8-18
  if (modKey === 'EQ' && value !== null && typeof value === 'object') {
    const eq = value as Record<string, number>;
    return (
      <div className="px-3 py-2 border-b border-border/20 last:border-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider w-24">EQ</span>
        </div>
        <div className="flex gap-4">
          {(['LO', 'MID', 'HI'] as const).map(band => {
            const raw = Number(eq[band] ?? 13);
            const diff = raw - 13;
            const color = diff > 0 ? 'text-amber-400' : diff < 0 ? 'text-blue-400' : 'text-muted-foreground';
            return (
              <div key={band} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-muted-foreground">{band}</span>
                <span className={`text-sm font-bold tabular-nums ${color}`}>{eqValue(raw)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  // Módulos con display/activo
  if (value !== null && typeof value === 'object') {
    const mod = value as Record<string, unknown>;
    const isOff = mod.activo === false;
    const display = mod.display as string | undefined;
    const algoritmo = mod.algoritmo as string | undefined;
    const parsed = display ? parseDisplay(display) : null;
    const efectoNombre = parsed?.nombre ?? algoritmo ?? '';
    const nivel = parsed?.nivel;
    const slotLabel = ZOOM_SLOT_LABELS[modKey] ?? modKey;
    return (
      <div className={isOff ? 'opacity-40' : ''}>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border-b border-border/20">
          <span className="font-bold text-foreground uppercase tracking-wider text-xs w-24 shrink-0">{slotLabel}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            isOff ? 'bg-muted text-muted-foreground' : 'bg-accent/20 text-accent'
          }`}>{isOff ? 'OFF' : 'ON'}</span>
          {!isOff && efectoNombre && <span className="text-xs text-muted-foreground italic">{efectoNombre}</span>}
        </div>
        {!isOff && (
          <div className="flex flex-wrap gap-px px-3 py-1.5">
            {display && (
              <div className="flex flex-col items-center px-3 py-1 min-w-[56px]">
                <span className="text-[10px] text-muted-foreground">Pantalla</span>
                <span className="text-base font-black tabular-nums font-mono tracking-widest text-accent">{display}</span>
              </div>
            )}
            {nivel && (
              <div className="flex flex-col items-center px-2 py-1 min-w-[40px]">
                <span className="text-[10px] text-muted-foreground">Nivel</span>
                <span className="text-sm font-bold tabular-nums">{nivel}</span>
              </div>
            )}
            {mod.P1 !== undefined && (
              <div className="flex flex-col items-center px-2 py-1 min-w-[48px]">
                <span className="text-[10px] text-muted-foreground">{modKey === 'DRIVE' ? 'Gain' : 'P1'}</span>
                <span className="text-sm font-bold tabular-nums">{String(mod.P1)}</span>
              </div>
            )}
            {mod.P2 !== undefined && (
              <div className="flex flex-col items-center px-2 py-1 min-w-[56px]">
                <span className="text-[10px] text-muted-foreground">
                  {modKey === 'DRIVE' ? 'Mix' : modKey === 'MOD_DELAY' ? 'Rate/Time' : 'Decay/Time'}
                </span>
                <span className="text-sm font-bold tabular-nums">{String(mod.P2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="text-xs px-3 py-2 flex justify-between items-center gap-2 border-b border-border/20 last:border-0">
      <span className="text-muted-foreground">{friendlyParam(modKey)}</span>
      <span className="font-bold tabular-nums">{String(value)}</span>
    </div>
  );
}

// ─── Renderizado legacy de parámetros (para equipos sin formato Zoom B1) ─────
function ModuleParamBlock({ modKey, value }: { modKey: string; value: unknown }) {
  const isModule = value !== null && typeof value === "object" && !Array.isArray(value);
  if (!isModule) {
    return (
      <div className="text-xs px-3 py-2 flex justify-between items-center gap-2 border-b border-border/20 last:border-0">
        <span className="text-muted-foreground">{friendlyParam(modKey)}</span>
        <span className="font-bold tabular-nums">{String(value)}</span>
      </div>
    );
  }
  const mod = value as Record<string, unknown>;
  const estado = mod.estado as string | undefined;
  const isOff = estado === "OFF";
  return (
    <div className={isOff ? "opacity-45" : ""}>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border-b border-border/20">
        <span className="font-bold text-foreground uppercase tracking-wider text-xs w-24 shrink-0">{modKey}</span>
        {estado && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            isOff ? "bg-muted text-muted-foreground" : "bg-accent/20 text-accent"
          }`}>{estado}</span>
        )}
        {mod.tipo != null && <span className="text-xs text-muted-foreground italic">{String(mod.tipo)}</span>}
      </div>
      {!isOff && (
        <div className="flex flex-wrap gap-px px-3 py-1.5">
          {Object.entries(mod || {})
            .filter(([k]) => k !== "estado" && k !== "tipo")
            .map(([k, v]) => (
              <div key={k} className="flex flex-col items-center px-2 py-1 min-w-[48px]">
                <span className="text-[10px] text-muted-foreground">{friendlyParam(k)}</span>
                <span className="text-xs font-bold tabular-nums">{String(v)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── TAG colors — unificados con estructura (distortion-based) ──────────────
const TAG_STYLES: Record<string, { badge: string; border: string; bg: string; gradient: string }> = {
  // BASE sections — amber (warm crunch)
  RIFF:   { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   border: 'border-amber-500/25',  bg: '', gradient: 'from-amber-950/50 via-amber-900/20 to-transparent'  },
  INTRO:  { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   border: 'border-amber-500/25',  bg: '', gradient: 'from-amber-950/50 via-amber-900/20 to-transparent'  },
  VERSO:  { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   border: 'border-amber-500/25',  bg: '', gradient: 'from-amber-950/50 via-amber-900/20 to-transparent'  },
  BASE:   { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   border: 'border-amber-500/25',  bg: '', gradient: 'from-amber-950/50 via-amber-900/20 to-transparent'  },
  // CORO sections — red (hot gain)
  CORO:   { badge: 'bg-red-500/20 text-red-300 border-red-500/30',         border: 'border-red-500/25',    bg: '', gradient: 'from-red-950/50 via-red-900/20 to-transparent'    },
  CHORUS: { badge: 'bg-red-500/20 text-red-300 border-red-500/30',         border: 'border-red-500/25',    bg: '', gradient: 'from-red-950/50 via-red-900/20 to-transparent'    },
  // SOLO sections — blue/violet (intense lead)
  SOLO:   { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',      border: 'border-blue-500/25',   bg: '', gradient: 'from-blue-950/50 via-blue-900/20 to-transparent'   },
  PUENTE: { badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30', border: 'border-violet-500/25', bg: '', gradient: 'from-violet-950/50 via-violet-900/20 to-transparent' },
  BRIDGE: { badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30', border: 'border-violet-500/25', bg: '', gradient: 'from-violet-950/50 via-violet-900/20 to-transparent' },
};
const DEFAULT_TAG_STYLE = { badge: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', border: 'border-zinc-500/25', bg: '', gradient: 'from-zinc-900/40 via-zinc-800/20 to-transparent' };

// ─── Serializar valor seguro (evitar [object Object]) ───────────────────────
function safeValueString(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(safeValueString).join(', ');
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    return Object.entries(obj)
      .filter(([, val]) => val !== null && val !== undefined)
      .map(([k, val]) => `${friendlyParam(k)} ${safeValueString(val)}`)
      .join(' · ');
  }
  return String(v);
}

// ─── EQ visual inline (LOW · MID · HIGH con barras) ─────────────────────────
function EQInline({ eq }: { eq: Record<string, number> }) {
  const bands = Object.entries(eq).map(([k, v]) => ({ key: k, val: Number(v ?? 0) }));
  const maxVal = Math.max(...bands.map(b => b.val), 1);
  return (
    <div className="flex items-end gap-2">
      {bands.map(b => {
        const pct = Math.round((b.val / Math.max(maxVal, 20)) * 100);
        return (
          <div key={b.key} className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-bold tabular-nums text-foreground">{b.val}</span>
            <div className="w-4 bg-white/5 rounded-sm overflow-hidden" style={{ height: '20px' }}>
              <div
                className="w-full bg-amber-400/70 rounded-sm transition-all"
                style={{ height: `${pct}%`, marginTop: 'auto', position: 'relative', top: `${100 - pct}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground uppercase">{b.key}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Configuración inline de un módulo (algoritmo · params) ─────────────────
function buildConfigString(obj: Record<string, unknown>): { algoName: string; paramStr: string } {
  const display = obj.display as string | undefined;
  const algoritmo = obj.algoritmo as string | undefined;
  const parsed = display ? parseDisplay(display) : null;
  const algoName = parsed?.nombre ?? algoritmo ?? '';

  const META_KEYS = ['estado', 'activo', 'display', 'algoritmo', 'tipo'];
  const params = Object.entries(obj)
    .filter(([k]) => !META_KEYS.includes(k))
    .filter(([, v]) => v !== null && v !== undefined && typeof v !== 'object');

  const paramStr = params
    .map(([k, v]) => `${friendlyParam(k).toUpperCase()} ${v}`)
    .join(' · ');

  return { algoName, paramStr };
}

// ─── Mapper dinámico de P1-P4 a nombres semánticos por algoritmo ─────────────
const PARAM_NAMES: Record<string, Record<string, string>> = {
  // COMP/FILTER
  "OptComp":     { P1: "SUSTAIN", P2: "ATTACK", P3: "LEVEL", P4: "TONE" },
  "M COMP":      { P1: "SUSTAIN", P2: "ATTACK", P3: "LEVEL", P4: "TONE" },
  "BlackOpt":    { P1: "SUSTAIN", P2: "ATTACK", P3: "LEVEL", P4: "TONE" },
  "Compressor":  { P1: "SENS" },
  "Limiter":     { P1: "LEVEL" },
  // DRIVE/AMP
  "TS Drive":    { P1: "GAIN", P2: "TONE", P3: "LEVEL", P4: "MIX" },
  "GoldDRV":     { P1: "GAIN", P2: "TONE", P3: "LEVEL", P4: "MIX" },
  "SQUEAK":      { P1: "GAIN", P2: "TONE", P3: "LEVEL", P4: "MIX" },
  "FD TWIN":     { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "UK 30A":      { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "MS 800":      { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "BG DRIVE":    { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "DZ DRV":      { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "RECT ORG":    { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "ORG GRPH":    { P1: "GAIN", P2: "BASS", P3: "MID", P4: "TREBLE" },
  "Fuzz Face":   { P1: "GAIN", P2: "TONE", P3: "LEVEL", P4: "MIX" },
  // MOD
  "CHORUS":      { P1: "RATE", P2: "DEPTH", P3: "MIX", P4: "TONE" },
  "CE-CHORUS":   { P1: "RATE", P2: "DEPTH", P3: "MIX", P4: "TONE" },
  "FLANGER":     { P1: "RATE", P2: "DEPTH", P3: "MIX", P4: "FB" },
  "PHASER":      { P1: "RATE", P2: "DEPTH", P3: "MIX", P4: "STAGE" },
  "THE VIBE":    { P1: "SPEED", P2: "DEPTH", P3: "MIX", P4: "TONE" },
  "TREMOLO":     { P1: "RATE", P2: "DEPTH", P3: "WAVE", P4: "MIX" },
  "VIBRATO":     { P1: "RATE", P2: "DEPTH", P3: "MIX", P4: "TONE" },
  // DELAY
  "DELAY":       { P1: "TIME", P2: "FB", P3: "MIX", P4: "TONE" },
  "ANALOGDELAY": { P1: "TIME", P2: "FB", P3: "MIX", P4: "TONE" },
  "TAPE ECHORUS":{ P1: "TIME", P2: "FB", P3: "MIX", P4: "TONE" },
  "REVERSE":     { P1: "TIME", P2: "FB", P3: "MIX", P4: "TONE" },
  "PITCHDELAY":  { P1: "TIME", P2: "FB", P3: "PITCH", P4: "MIX" },
  // REVERB
  "HALL":        { P1: "DECAY", P2: "TONE", P3: "MIX", P4: "PREDLY" },
  "ROOM":        { P1: "DECAY", P2: "TONE", P3: "MIX", P4: "PREDLY" },
  "SPRING":      { P1: "DECAY", P2: "TONE", P3: "MIX", P4: "PREDLY" },
  "PLATE":       { P1: "DECAY", P2: "TONE", P3: "MIX", P4: "PREDLY" },
  "MOD REVERB":  { P1: "DECAY", P2: "TONE", P3: "MIX", P4: "MOD" },
  // EQ (Graphic / Parametric)
  "6BandEQ":     { P1: "BASS", P2: "LO-MID", P3: "MID", P4: "TREBLE" },
  "ParaEQ":      { P1: "BASS", P2: "MID", P3: "TREBLE", P4: "MID FREQ" },
  "Graphic EQ":  { P1: "BASS", P2: "MID", P3: "TREBLE", P4: "PRESENCE" },
  "GraphicEQ":   { P1: "BASS", P2: "MID", P3: "TREBLE", P4: "PRESENCE" },
  "CondEQ":      { P1: "BASS", P2: "MID", P3: "TREBLE", P4: "PRESENCE" },
  "BossGE7":     { P1: "BASS", P2: "MID", P3: "TREBLE", P4: "LEVEL" },
  // NS
  "ZNR":         { P1: "THRESH", P2: "DECAY" },
  // Slow Attack
  "SlowAttack":  { P1: "TIME", P2: "CURVE" },
};

function getParamName(algoritmo: string, paramKey: string): string {
  const map = PARAM_NAMES[algoritmo];
  if (map && map[paramKey]) return map[paramKey];
  return paramKey;
}

// ─── Slot display names ──────────────────────────────────────────────────────
const SLOT_DISPLAY: Record<string, string> = {
  FX_COMP: 'COMP', DS_OD: 'DRIVE', AMP: 'AMP', CAB: 'CAB', NS: 'NOISE GATE',
  EQ: 'EQ', MOD: 'MOD', DELAY: 'DELAY', REVERB: 'REVERB',
  COMP_LIMIT: 'COMP', EFX: 'EFX', DRIVE: 'DRIVE', MOD_DELAY: 'MOD/DLY', REV_DELAY: 'REV/DLY',
};

function getSlotDisplay(slot: string): string {
  return SLOT_DISPLAY[slot] || slot.replace(/_/g, '/');
}

// ─── Friendly algo name (remove internal codes) ──────────────────────────────
const ALGO_FRIENDLY: Record<string, string> = {
  'ORG GRPH': 'Graphic EQ (Orange)', 'RECT ORG': 'Mesa Rectifier',
  'MS 800': 'Marshall JCM800', 'FD TWIN': 'Fender Twin',
  'UK 30A': 'Vox AC30', 'BG DRIVE': 'Bogner Drive',
  'DZ DRV': 'Diezel Drive', 'GoldDRV': 'Gold Drive (Klon)',
  'TS Drive': 'Tube Screamer', 'CE-CHORUS': 'Boss CE Chorus',
  'THE VIBE': 'Uni-Vibe',
};

function getAlgoDisplay(algo: string): string {
  return ALGO_FRIENDLY[algo] || algo;
}

// ─── Preset Card — bloques verticales por módulo (formato.png) ──────────────
function PresetCard({ preset, idx }: { preset: PresetConfig; idx: number }) {
  const tag = (preset.tag ?? '').toUpperCase();
  const tagStyle = TAG_STYLES[tag] ?? DEFAULT_TAG_STYLE;

  const gc = preset.configuracion?.[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gcAny = gc as any;
  // Soporte array de módulos (nuevo formato n8n) y objeto (legacy)
  const modulosArray: Array<{ slot: string; algoritmo: string; estado: string; parametros: Record<string, unknown> }> =
    Array.isArray(gcAny?.modulos)
      ? gcAny.modulos
      : gcAny?.modulos && typeof gcAny.modulos === 'object'
        ? Object.entries(gcAny.modulos).map(([slot, val]) => {
            if (typeof val !== 'object' || val === null) return { slot, algoritmo: '—', estado: '—', parametros: { value: val } };
            const obj = val as Record<string, unknown>;
            return { slot, algoritmo: String(obj.algoritmo ?? obj.tipo ?? ''), estado: String(obj.estado ?? 'on'), parametros: obj };
          })
        : gcAny?.parametros
          ? Object.entries(gcAny.parametros as Record<string, unknown>).map(([slot, val]) => {
              if (typeof val !== 'object' || val === null) return { slot, algoritmo: '—', estado: '—', parametros: { value: val } };
              const obj = val as Record<string, unknown>;
              return { slot, algoritmo: String(obj.algoritmo ?? obj.tipo ?? ''), estado: String(obj.estado ?? 'on'), parametros: obj };
            })
          : [];

  return (
    <div className={`rounded-xl border overflow-hidden ${tagStyle.border} bg-gradient-to-b ${tagStyle.gradient}`}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border ${tagStyle.badge}`}>
              {tag || `Preset ${idx + 1}`}
            </span>
            <p className="font-bold text-foreground text-sm leading-tight mt-1.5">
              {preset.etiqueta ?? preset.nombre}
            </p>
          </div>
        </div>
        {preset.descripcion_corta && (
          <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{preset.descripcion_corta}</p>
        )}
      </div>

      {/* Módulos */}
      {modulosArray.length > 0 && (
        <div className="divide-y divide-white/[0.04]">
          {modulosArray.map((mod, i) => {
            const isOff = mod.estado?.toLowerCase() === 'off' || mod.algoritmo?.toLowerCase() === 'off';
            const algoRaw = mod.algoritmo || '';
            const algoDisplay = isOff ? '' : getAlgoDisplay(algoRaw);
            const slotDisplay = getSlotDisplay(mod.slot);
            const META = new Set(['estado', 'activo', 'algoritmo', 'tipo', 'display', 'value']);
            const params = Object.entries(mod.parametros || {})
              .filter(([k]) => !META.has(k))
              .filter(([, v]) => v !== null && v !== undefined && v !== 0 && v !== '');

            // Scalar value (PATCH_LVL, ZNR as number)
            if (mod.algoritmo === '—' && 'value' in mod.parametros) {
              return (
                <div key={i} className="flex items-center justify-between px-4 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{slotDisplay}</span>
                  <span className="text-sm font-bold tabular-nums text-foreground">{safeValueString(mod.parametros.value)}</span>
                </div>
              );
            }

            return (
              <div key={i} className={isOff ? 'opacity-35' : ''}>
                {/* Slot header */}
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.02]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-20 shrink-0">
                    {slotDisplay}
                  </span>
                  {algoDisplay && (
                    <span className="text-xs font-semibold text-foreground">{algoDisplay}</span>
                  )}
                  <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    isOff ? 'bg-red-500/15 text-red-400/80' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>{isOff ? 'OFF' : 'ON'}</span>
                </div>
                {/* Parámetros */}
                {!isOff && params.length > 0 && (
                  <div className="px-4 py-1.5 space-y-0.5">
                    {params.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground uppercase tracking-wide text-[10px]">
                          {getParamName(algoRaw, k)}
                        </span>
                        <span className="font-bold tabular-nums text-foreground">{safeValueString(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* System params */}
      {preset.system_params && Object.keys(preset.system_params).length > 0 && (
        <div className="px-4 py-2.5 border-t border-cyan-500/15 bg-cyan-950/15">
          <p className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest mb-1.5">Sistema</p>
          <div className="space-y-0.5">
            {Object.entries(preset.system_params).filter(([, v]) => v != null).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase tracking-wide text-[10px]">{k.replace(/_/g, ' ')}</span>
                <span className="font-bold tabular-nums text-foreground">{safeValueString(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explicación */}
      {(preset.explicacion ?? preset.descripcion ?? preset.notas) && (
        <div className="px-4 py-2.5 border-t border-white/[0.04] bg-black/20">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {preset.explicacion ?? preset.descripcion ?? preset.notas}
          </p>
        </div>
      )}

      {/* Consejos */}
      {preset.consejos && preset.consejos.length > 0 && (
        <div className="px-4 py-2 border-t border-white/[0.04] space-y-0.5">
          {preset.consejos.map((c, i) => (
            <p key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
              <span className="text-amber-400 shrink-0">›</span>{c}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AMP BASE Card — amp real del usuario O simulación global ─────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AmpBaseCard({ ampGlobal }: { ampGlobal: Record<string, any> }) {
  if (!ampGlobal || Object.keys(ampGlobal).length === 0) return null;

  // ── Modo AMP REAL (source: USER_REAL_AMP) ──
  const isRealAmp = ampGlobal.source === 'USER_REAL_AMP';

  if (isRealAmp) {
    const eq = ampGlobal.eq || {};
    return (
      <div className="rounded-xl border overflow-hidden border-orange-500/25 bg-gradient-to-b from-orange-950/50 via-orange-900/20 to-transparent">
        <div className="px-4 pt-3 pb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Speaker className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border bg-orange-500/20 text-orange-300 border-orange-500/30">
              TU AMP
            </span>
            <span className="text-xs font-semibold text-foreground">{ampGlobal.amp_name || 'Amplificador'}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Configuración sugerida para tu amp real</p>
        </div>
        <div className="px-4 py-3 space-y-2">
          {/* EQ */}
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-orange-400/80 uppercase tracking-widest">Ecualización</p>
            <div className="grid grid-cols-3 gap-2">
              {[['BASS', eq.bass], ['MID', eq.mid], ['TREBLE', eq.treble]].map(([label, val]) => (
                <div key={label as string} className="text-center">
                  <span className="text-[10px] text-muted-foreground uppercase">{label as string}</span>
                  <p className="text-lg font-bold tabular-nums text-foreground">{val ?? '—'}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Gain */}
          {ampGlobal.gain !== undefined && (
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">GAIN</span>
              <span className="text-lg font-bold tabular-nums text-foreground">{ampGlobal.gain}</span>
            </div>
          )}
          {/* Notas */}
          {ampGlobal.notes && (
            <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-white/[0.06] pt-2">
              {ampGlobal.notes}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Modo SIMULADO (AMP + CAB + NS del procesador) ──
  const slots = Object.entries(ampGlobal);

  return (
    <div className="rounded-xl border overflow-hidden border-orange-500/25 bg-gradient-to-b from-orange-950/50 via-orange-900/20 to-transparent">
      <div className="px-4 pt-3 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Speaker className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border bg-orange-500/20 text-orange-300 border-orange-500/30">
            AMP SIM
          </span>
          <span className="text-[11px] text-muted-foreground ml-auto">Simulación · Todos los presets</span>
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {slots.map(([slotKey, slotData]) => {
          if (typeof slotData !== 'object' || slotData === null) return null;
          const algo = slotData.algoritmo || '—';
          const META = new Set(['algoritmo', 'estado']);
          const params = Object.entries(slotData)
            .filter(([k]) => !META.has(k))
            .filter(([, v]) => v !== null && v !== undefined && v !== 0);

          return (
            <div key={slotKey}>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-20 shrink-0">
                  {slotKey}
                </span>
                <span className="text-xs font-semibold text-foreground">{algo}</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400">ON</span>
              </div>
              {params.length > 0 && (
                <div className="px-4 py-1.5 space-y-0.5">
                  {params.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground uppercase tracking-wide text-[10px]">
                        {getParamName(algo, k)}
                      </span>
                      <span className="font-bold tabular-nums text-foreground">{safeValueString(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WizardApp() {
  const { user, logout } = useAuth({ redirectOnUnauthenticated: true, redirectPath: '/' });
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const [step, setStep] = useState<Step>(1);

  // Paso 1 — canción
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [searchParams, setSearchParams] = useState<{
    title: string;
    artist: string;
  } | null>(null);
  const [selectedSong, setSelectedSong] = useState<MusicBrainzResult | null>(
    null
  );
  // FIX: songDbId es el ObjectId de MongoDB (_id), no el MusicBrainz ID numérico
  const [songDbId, setSongDbId] = useState<string>("");

  // Paso 2 — equipo
  const [gearName, setGearName] = useState("");
  const [gearType, setGearType] = useState<GearType>("pedalera");
  const [gearBrand, setGearBrand] = useState("");
  const [gearModel, setGearModel] = useState("");
  const [selectedModelKey, setSelectedModelKey] = useState<string>("");
  const [editingGearId, setEditingGearId] = useState<string | null>(null);
  // FIX: gearIds son strings (ObjectIds de MongoDB)
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>([]);

  // Paso 3 — datos de investigación de tono
  const [toneResearchData, setToneResearchData] = useState<ToneResearch | null>(null);

  // Paso 2 — formulario de nuevo equipo
  const [showAddForm, setShowAddForm] = useState(false);

  // Paso 4 — presets generados
  const [generatedPresets, setGeneratedPresets] = useState<{
    configuracion_base: GearConfig[];
    presetsData: PresetConfig[];
    advertencia?: string;
  } | null>(null);

  // AMP preset global (AMP + CAB + NS compartidos entre todos los presets)
  const [ampPresetGlobal, setAmpPresetGlobal] = useState<Record<string, { algoritmo: string; P1?: number; P2?: number; P3?: number; P4?: number }> | null>(null);

  // ─── Queries y mutations ──────────────────────────────────────────────────

  const searchResults = trpc.songs.search.useQuery(searchParams!, {
    enabled: !!searchParams,
  });

  const researchTone = trpc.songs.researchTone.useMutation();
  const generatePresets = trpc.presets.generate.useMutation();
  const generatePreset = trpc.songs.generatePreset.useMutation();
  const createGear = trpc.gear.create.useMutation();
  const updateGear = trpc.gear.update.useMutation();
  const deleteGear = trpc.gear.delete.useMutation();
  // FIX: la query de equipo se habilita solo si el usuario está autenticado
  const userGear = trpc.gear.list.useQuery(undefined, { enabled: !!user });

  // ─── Sync: selectedModelKey → brand/model/name ────────────────────────────

  useEffect(() => {
    if (!selectedModelKey) return;
    const [marca, modelo] = selectedModelKey.split('||', 2);
    setGearBrand(marca ?? '');
    setGearModel(modelo ?? '');
    setGearName(prev => prev || (modelo ?? ''));
  }, [selectedModelKey]);

  // ─── Helpers de formulario de equipo ──────────────────────────────────────

  const resetGearForm = () => {
    setGearName('');
    setGearBrand('');
    setGearModel('');
    setSelectedModelKey('');
    setEditingGearId(null);
  };

  const handleGearTypeChange = (v: GearType) => {
    setGearType(v);
    setSelectedModelKey('');
    setGearBrand('');
    setGearModel('');
    setGearName('');
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchSong = () => {
    if (!songTitle || !songArtist) {
      toast.error("Ingresa título y artista");
      return;
    }
    setSelectedSong(null);
    setSongDbId("");
    setSearchParams({ title: songTitle, artist: songArtist });
  };

  useEffect(() => {
    if (!searchResults.data) return;
    if (searchResults.data.length > 0) {
      toast.success(`${searchResults.data.length} resultado${searchResults.data.length !== 1 ? "s" : ""} encontrado${searchResults.data.length !== 1 ? "s" : ""}`);
    } else {
      toast.error("No se encontraron canciones. Intenta con otro nombre.");
    }
  }, [searchResults.data]);

  const handleAddGear = async () => {
    if (!gearName || !gearType) {
      toast.error("Completa el nombre y tipo del equipo");
      return;
    }
    try {
      if (editingGearId) {
        await updateGear.mutateAsync({
          id: editingGearId,
          data: { name: gearName, type: gearType, brand: gearBrand || undefined, model: gearModel || undefined },
        });
        await utils.gear.list.invalidate();
        toast.success(`${gearName} actualizado`);
      } else {
        const newGear = await createGear.mutateAsync({
          name: gearName,
          type: gearType,
          brand: gearBrand || undefined,
          model: gearModel || undefined,
        });
        await utils.gear.list.invalidate();
        setSelectedGearIds((prev) => [...prev, String(newGear._id)]);
        toast.success(`${gearName} agregado`);
      }
      resetGearForm();
      setShowAddForm(false);
    } catch {
      toast.error(editingGearId ? "Error al actualizar equipo" : "Error al agregar equipo");
    }
  };

  const handleDeleteGear = async (id: string, name: string) => {
    try {
      await deleteGear.mutateAsync({ id });
      await utils.gear.list.invalidate();
      setSelectedGearIds(prev => prev.filter(gid => gid !== id));
      toast.success(`${name} eliminado`);
    } catch {
      toast.error("Error al eliminar equipo");
    }
  };

  const handleEditGear = (g: IGear) => {
    setEditingGearId(String(g._id));
    setGearType(g.type as GearType);
    setGearBrand(g.brand ?? '');
    setGearModel(g.model ?? '');
    setGearName(g.name);
    if (g.brand && g.model) setSelectedModelKey(`${g.brand}||${g.model}`);
    setShowAddForm(true);
  };

  const handleSalir = async () => {
    await logout();
    navigate('/');
  };

  const handleGeneratePresets = async () => {
    if (!selectedSong) {
      toast.error("Primero busca y selecciona una canción");
      return;
    }
    if (selectedGearIds.length === 0) {
      toast.error("Agrega al menos un equipo antes de generar");
      return;
    }

    setLoaderVisible(true);
    try {
      const result = await generatePreset.mutateAsync({
        musicBrainzId: selectedSong.id,
        title: selectedSong.title,
        artist: selectedSong.artist,
        coverUrl: selectedSong.coverUrl,
        gearIds: selectedGearIds,
      });

      if (!result.success || !result.preset) {
        throw new Error("La generación falló sin error explícito");
      }

      if (result.toneResearch) {
        setToneResearchData(result.toneResearch as ToneResearch);
      }

      setSongDbId(result.songDbId);

      setGeneratedPresets({
        configuracion_base: result.preset.configuracion_base ?? [],
        presetsData: result.preset.presetsData,
        advertencia: result.preset.advertencia,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultAny = result as any;
      if (resultAny.ampPresetGlobal) {
        setAmpPresetGlobal(resultAny.ampPresetGlobal as Record<string, { algoritmo: string; P1?: number; P2?: number; P3?: number; P4?: number }>);
      }

      setStep(4);
      toast.success("¡Presets generados exitosamente!");

    } catch (err) {
      console.error(err);
      toast.error("Error al generar presets. Intenta de nuevo.");
    } finally {
      setLoaderVisible(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSongTitle("");
    setSongArtist("");
    setSearchParams(null);
    setSelectedSong(null);
    setSongDbId("");
    setSelectedGearIds([]);
    setGeneratedPresets(null);
    setAmpPresetGlobal(null);
    setToneResearchData(null);
  };

  const isGenerating = generatePreset.isPending;

  const [loaderVisible, setLoaderVisible] = useState(false);

  const selectedGear = ((userGear.data ?? []) as IGear[]).filter(
    (g) => selectedGearIds.includes(String(g._id))
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar logo="GuitarTone AI" links={WIZARD_NAV_LINKS} cta={{ text: 'Inicio', href: '/' }} />

      {/* Fondo portada — portal directo al body */}
      {selectedSong?.coverUrl && createPortal(
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}
          aria-hidden="true"
        >
          <img
            src={selectedSong.coverUrl}
            alt=""
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", filter: "blur(80px)", opacity: 0.25, transform: "scale(1.15)"
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(11,9,7,0.75)" }} />
        </div>,
        document.body
      )}
      <div className="min-h-screen px-4 pt-24 pb-8" style={{ position: "relative", zIndex: 2 }}>
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Step indicator */}
        <div className="flex items-center justify-center" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
          {([1, 2, 3, 4] as Step[]).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 flex-shrink-0"
                style={{
                  background: s <= step ? 'var(--color-accent)' : 'transparent',
                  border: s <= step ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  color: s <= step ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {s < step ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{s}</span>
                )}
              </div>
              {s < 4 && (
                <div
                  className="w-14 h-px transition-all duration-300"
                  style={{ background: s < step ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── PASO 1: Buscar canción ─────────────────────────────────────── */}
        {step === 1 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>Busca tu canción</CardTitle>
              <CardDescription style={{ fontFamily: 'var(--font-body)' }}>
                Encontrá la canción cuyo tono querés replicar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título de la canción</Label>
                  <Input
                    id="title"
                    placeholder="ej: Can't Stop"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSong()}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="artist">Artista</Label>
                  <Input
                    id="artist"
                    placeholder="ej: Red Hot Chili Peppers"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSong()}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={handleSearchSong}
                  disabled={searchResults.isLoading}
                  className="w-full"
                >
                  {searchResults.isLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Buscar canción
                </Button>
              </div>

              {/* Lista de resultados de búsqueda */}
              {searchResults.data && searchResults.data.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Resultados — elige una canción
                  </p>
                  <div className="space-y-2">
                    {searchResults.data.slice(0, 5).map((song) => {
                      const isSelected = selectedSong?.id === song.id;
                      return (
                        <button
                          key={song.id}
                          type="button"
                          onClick={() => setSelectedSong(song)}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-accent bg-accent/10 shadow-sm"
                              : "border-border/50 bg-card/40 hover:border-border hover:bg-card/60"
                          }`}
                        >
                          {/* Carátula pequeña */}
                          {song.coverUrl ? (
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-card/60 flex items-center justify-center flex-shrink-0">
                              <Music className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}

                          {/* Info de la canción */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{song.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                          </div>

                          {/* Indicador de selección */}
                          <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                            isSelected ? "border-accent bg-accent" : "border-border/60"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-accent-foreground" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Carátula grande de la canción seleccionada */}
              {selectedSong && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-accent/50 bg-accent/5">
                  {selectedSong.coverUrl && (
                    <img
                      src={selectedSong.coverUrl}
                      alt={selectedSong.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <p className="text-xs font-semibold text-accent uppercase tracking-wide">Seleccionada</p>
                    </div>
                    <p className="font-bold text-foreground leading-tight truncate">{selectedSong.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{selectedSong.artist}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!selectedSong}
                className="w-full"
                size="lg"
              >
                Siguiente <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Pantalla de carga de canción */}
              {searchResults.isLoading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center gap-6" style={{ zIndex: 50, background: "rgba(11,9,7,0.92)" }}>
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-accent/50 border-b-accent/20 border-l-transparent animate-spin" />
                    <div className="absolute inset-4 rounded-full bg-accent/20 flex items-center justify-center">
                      <Music className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-foreground text-lg">Buscando canción...</p>
                    <p className="text-sm text-muted-foreground">{songTitle} — {songArtist}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── PASO 2: Configurar equipo ──────────────────────────────────── */}
        {step === 2 && (() => {
          const allGear = (userGear.data as IGear[] | undefined) ?? [];
          return (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>Seleccioná tu equipo</CardTitle>
                <CardDescription style={{ fontFamily: 'var(--font-body)' }}>
                  Elegí el equipo que vas a usar para esta canción
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">

                {/* ── Equipo guardado ── */}
                {allGear.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Tu equipo guardado
                    </p>
                    <div className="space-y-2">
                      {allGear.map((g) => {
                        const gId = String(g._id);
                        const isSelected = selectedGearIds.includes(gId);
                        const palette = GEAR_PALETTE[g.type] ?? GEAR_PALETTE.otro;
                        return (
                          <div key={gId} className={`rounded-lg border transition-all flex items-center gap-2 pr-2 ${
                            isSelected ? "border-accent bg-accent/10 shadow-sm" : "border-border/50 bg-card/40"
                          }`}>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedGearIds((prev) =>
                                  isSelected ? prev.filter((id) => id !== gId) : [...prev, gId]
                                )
                              }
                              className="flex-1 text-left p-3 flex items-center gap-3"
                            >
                              <span className={`shrink-0 ${palette.accent}`}>{palette.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{g.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {[g.brand, g.model].filter(Boolean).join(" ")} · {g.type}
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                                isSelected ? "border-accent bg-accent" : "border-border/60"
                              }`}>
                                {isSelected && <CheckCircle2 className="w-3 h-3 text-accent-foreground" />}
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditGear(g)}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGear(gId, g.name)}
                              disabled={deleteGear.isPending}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aún no tienes equipo guardado. Agrega tu primer equipo abajo.
                  </p>
                )}

                {/* ── Agregar / Editar equipo ── */}
                <div className="border border-border/40 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      if (showAddForm && editingGearId) { resetGearForm(); }
                      setShowAddForm((v) => !v);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-card/50 transition-colors"
                  >
                    <span>{editingGearId ? `Editando: ${gearName}` : '+ Agregar nuevo equipo'}</span>
                    {showAddForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showAddForm && (
                    <div className="space-y-4 p-4 border-t border-border/40 bg-card/30">
                      {/* Tipo */}
                      <div>
                        <Label>Tipo</Label>
                        <Select value={gearType} onValueChange={(v) => handleGearTypeChange(v as GearType)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amplificador">Amplificador</SelectItem>
                            <SelectItem value="procesador">Procesador multi-efectos</SelectItem>
                            <SelectItem value="pedalera">Pedal individual</SelectItem>
                            <SelectItem value="otro">Otro pedal / efecto</SelectItem>
                            <SelectItem value="guitarra">Guitarra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Select de modelo (para tipos con librería) */}
                      {gearType !== 'guitarra' && (
                        <div>
                          <Label>Modelo</Label>
                          <Select value={selectedModelKey} onValueChange={setSelectedModelKey}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Seleccionar modelo..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {getLibraryOptions(gearType).map(opt => (
                                <SelectItem key={opt.key} value={opt.key}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Inputs manuales para guitarra */}
                      {gearType === 'guitarra' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Marca</Label>
                            <Input value={gearBrand} onChange={e => setGearBrand(e.target.value)} placeholder="ej: Gibson" className="mt-2" />
                          </div>
                          <div>
                            <Label>Modelo</Label>
                            <Input value={gearModel} onChange={e => setGearModel(e.target.value)} placeholder="ej: Les Paul" className="mt-2" />
                          </div>
                        </div>
                      )}

                      {/* Nombre (auto-completado, editable) */}
                      {(selectedModelKey || gearType === 'guitarra') && (
                        <div>
                          <Label>Nombre en tu setup</Label>
                          <Input
                            placeholder="ej: Mi pedalera principal"
                            value={gearName}
                            onChange={(e) => setGearName(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddGear}
                          disabled={createGear.isPending || updateGear.isPending || (!selectedModelKey && gearType !== 'guitarra') || !gearName}
                          className="flex-1"
                        >
                          {(createGear.isPending || updateGear.isPending) ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
                          ) : (
                            editingGearId ? "Actualizar equipo" : "Guardar equipo"
                          )}
                        </Button>
                        {editingGearId && (
                          <Button variant="outline" onClick={() => { resetGearForm(); setShowAddForm(false); }}>
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Resumen selección ── */}
                {selectedGearIds.length > 0 && (
                  <p className="text-sm text-center text-accent font-medium">
                    {selectedGearIds.length} equipo{selectedGearIds.length !== 1 ? "s" : ""} seleccionado{selectedGearIds.length !== 1 ? "s" : ""}
                  </p>
                )}

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={selectedGearIds.length === 0}
                    className="flex-1"
                  >
                    Siguiente <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <Button onClick={handleSalir} variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                  Salir de la app
                </Button>
              </CardContent>
            </Card>
          );
        })()}

        {/* ── PASO 3: Investigación y generación ────────────────────────── */}
        {step === 3 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>Generación de presets</CardTitle>
              <CardDescription style={{ fontFamily: 'var(--font-body)' }}>
                La IA investigará el tono de{" "}
                <span className="text-accent font-medium">
                  {selectedSong?.title}
                </span>{" "}
                y generará presets exactos para tu equipo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Spinner mientras carga */}
              {isGenerating && (
                <div className="text-center space-y-6 py-8">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: 'var(--color-accent)' }} />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                    />
                    <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                      <Music className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                      Analizando el tono...
                    </p>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                      Investigando el gear del artista y calculando valores para tu equipo
                    </p>
                  </div>
                </div>
              )}

              {!isGenerating && (
                <div className="space-y-3 p-4 bg-card/50 rounded-lg border border-border/50 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Resumen:</p>
                  <p>
                    🎵 Canción:{" "}
                    <span className="text-foreground">
                      {selectedSong?.title} — {selectedSong?.artist}
                    </span>
                  </p>
                  <p>
                    🎛️ Equipo:{" "}
                    <span className="text-foreground">
                      {selectedGearIds.length} elemento
                      {selectedGearIds.length !== 1 ? "s" : ""} seleccionado
                      {selectedGearIds.length !== 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              )}

              <Button
                onClick={handleGeneratePresets}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  "Generar presets con IA"
                )}
              </Button>

              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="w-full"
                disabled={isGenerating}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── PASO 4: Presets generados ──────────────────────────────────── */}
        {step === 4 && generatedPresets && (() => {
          return (
            <div className="space-y-6">
              {/* ── Cabecera ── */}
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <div>
                  <h2 className="font-black uppercase leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', letterSpacing: '-0.01em' }}>
                    Presets para{" "}
                    <span style={{ color: 'var(--color-accent)' }}>{selectedSong?.title}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{selectedSong?.artist}</p>
                </div>
              </div>

              {/* ── 1. Spec cards del equipo ── */}
              {selectedGear.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Tu equipamiento
                  </h3>
                  <div className="space-y-3">
                    {selectedGear.map((g: IGear) => (
                      <GearSpecCard key={String(g._id)} gear={g} />
                    ))}
                  </div>
                </section>
              )}

              {/* ── 2. Investigación del tono original ── */}
              {toneResearchData && (
                <section>
                  <ToneResearchSummary data={toneResearchData} />
                </section>
              )}

              {/* ── 3. Configuración base del amplificador (fija toda la canción) ── */}
              {generatedPresets.configuracion_base.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Speaker className="w-3.5 h-3.5" /> Configuración del amplificador
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full ml-1 normal-case font-normal tracking-normal">
                      fija para toda la canción
                    </span>
                  </h3>
                  {generatedPresets.configuracion_base.map((gc: GearConfig, i: number) => (
                    <div key={i} className="rounded-xl border border-orange-500/30 overflow-hidden bg-orange-900/10">
                      <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border-b border-orange-500/20">
                        <Speaker className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">{gc.gearTipo}</span>
                        <span className="text-xs font-semibold text-foreground">{gc.gearNombre}</span>
                      </div>
                      <BaseGearSpecCard gc={gc} allGear={selectedGear} />
                      <div className="divide-y divide-border/30">
                        {Object.entries(gc.parametros || {}).map(([k, v]) => (
                          <ModuleParamBlock key={k} modKey={k} value={v} />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* ── 4. Estructura de la canción (v2 songStructure o legacy) ── */}
              {toneResearchData?.songStructure && toneResearchData.songStructure.length > 0 ? (
                <section className="p-4 bg-card/50 border border-border/50 rounded-xl">
                  <SongStructureV2 sections={toneResearchData.songStructure} />
                </section>
              ) : toneResearchData?.estructura && toneResearchData.estructura.length > 0 ? (
                <section className="p-4 bg-card/50 border border-border/50 rounded-xl">
                  <SongStructure estructura={toneResearchData.estructura} />
                </section>
              ) : null}

              {/* ── 4b. Timeline de presets (fallback si no hay estructura) ── */}
              {(!toneResearchData?.estructura || toneResearchData.estructura.length === 0) && generatedPresets.presetsData.length > 0 && (
                <section className="p-4 bg-card/50 border border-border/50 rounded-xl">
                  <SongTimeline presets={generatedPresets.presetsData} />
                </section>
              )}

              {/* ── 5a. AMP BASE (global) ── */}
              {ampPresetGlobal && (
                <section className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Speaker className="w-3.5 h-3.5" /> Configuración AMP Base
                  </h3>
                  <AmpBaseCard ampGlobal={ampPresetGlobal} />
                </section>
              )}

              {/* ── 5b. Presets por sección ── */}
              {generatedPresets.presetsData.length > 0 ? (
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Presets por sección
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {generatedPresets.presetsData.map((preset: PresetConfig, idx: number) => (
                      <PresetCard key={idx} preset={preset} idx={idx} />
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No se generaron presets</p>
              )}

              {/* ── 6. Advertencia ── */}
              {generatedPresets.advertencia && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{generatedPresets.advertencia}</p>
                </div>
              )}

              {/* ── Acciones ── */}
              <div className="flex gap-3">
                <Button onClick={resetWizard} variant="outline" className="flex-1">
                  Nueva búsqueda
                </Button>
                <Button onClick={() => navigate('/profile')} className="flex-1">
                  Ver mis presets
                </Button>
              </div>
              <Button onClick={handleSalir} variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                Salir de la app
              </Button>
            </div>
          );
        })()}
      </div>
      </div>

      <PresetLoader
        isVisible={loaderVisible}
        songTitle={selectedSong?.title ?? ""}
        songArtist={selectedSong?.artist ?? ""}
        gearNames={selectedGear.map((g) => g.name)}
      />
    </>
  );
}
