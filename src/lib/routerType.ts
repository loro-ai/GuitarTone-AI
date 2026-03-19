/**
 * AppRouter stub — tipos estáticos independientes del backend.
 * Permite desplegar en Vercel sin necesitar el repo guitartone-backend.
 *
 * Para type safety completo en dev local, reemplazar todo por:
 *   export type { AppRouter } from "../../../guitartone-backend/src/routers";
 *
 * Actualizar manualmente cuando cambien los routers del backend.
 */

import { initTRPC } from '@trpc/server';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';

// ─── Tipos del dominio (espejo del backend) ────────────────────────────────────

interface IGearModule {
  nombre: string; label: string; puedeApagarse: boolean;
  efectos: Array<{ tipo: string; parametros: Array<{ nombre: string; rango: string; descripcion?: string }> }>;
}

interface IGear {
  _id?: string; userId: string; name: string;
  type: 'pedalera' | 'amplificador' | 'guitarra' | 'procesador' | 'otro';
  brand?: string; model?: string; specs?: Record<string, unknown>;
  manualData?: {
    description: string; esMultiEfectos: boolean; modules?: IGearModule[];
    parameters: Array<{ name: string; range: string; defaultValue?: string; description: string }>;
    learnings?: string[]; imageUrl?: string; presetSlots?: number; notes: string; researchedAt: Date;
  };
  isDefault: boolean; createdAt: Date; updatedAt: Date;
}

interface GearConfig { gearId: string; gearNombre: string; gearTipo: string; parametros: Record<string, unknown> }
interface PresetConfig {
  nombre: string; momento_cancion: string; descripcion: string;
  configuracion: GearConfig[]; nota_tecnica?: string; consejos?: string[];
}

interface IPreset {
  _id?: string; userId: string; songId: string; songTitle?: string; songArtist?: string;
  gearIds: string[]; configuracion_base?: GearConfig[]; presetsData: PresetConfig[];
  advertencia?: string; isFavorite?: boolean; rating?: number; userNotes?: string;
  createdAt: Date; updatedAt: Date;
}

interface IUser {
  _id?: string; openId: string; name?: string; email?: string;
  loginMethod?: string; lastSignedIn?: Date; createdAt: Date; updatedAt: Date;
}

interface ISongResult { id: string; title: string; artist: string; coverUrl?: string }
interface IHistoryItem {
  _id?: string; userId: string; musicBrainzId: string; title: string;
  artist: string; coverUrl?: string; searchedAt: Date;
}

// ─── Stub Router ───────────────────────────────────────────────────────────────

const t = initTRPC.create({ transformer: superjson });
const router = t.router;
const p = t.procedure;

const appRouter = router({
  system: router({
    health: p.input(z.object({ timestamp: z.number() })).query(() => ({ ok: true })),
    notifyOwner: p.input(z.object({ title: z.string(), content: z.string() })).mutation(() => ({ success: true } as const)),
  }),

  auth: router({
    me: p.query((): IUser | null => null),
    register: p.input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
      .mutation(() => ({ success: true, user: null as IUser | null })),
    login: p.input(z.object({ email: z.string(), password: z.string() }))
      .mutation(() => ({ success: true, user: null as IUser | null })),
    logout: p.mutation(() => ({ success: true } as const)),
  }),

  songs: router({
    search: p.input(z.object({ title: z.string(), artist: z.string() }))
      .query((): ISongResult[] => []),
    getById: p.input(z.object({ id: z.string() }))
      .query((): ISongResult | null => null),
    researchTone: p.input(z.object({ musicBrainzId: z.string(), title: z.string(), artist: z.string(), coverUrl: z.string().optional() }))
      .mutation(() => ({ success: true, data: null as unknown, songDbId: '' })),
    generatePreset: p.input(z.object({ musicBrainzId: z.string(), title: z.string(), artist: z.string(), coverUrl: z.string().optional(), gearIds: z.array(z.string()) }))
      .mutation(() => ({ success: true, preset: null as IPreset | null, toneResearch: null as unknown, songDbId: '' })),
  }),

  gear: router({
    list: p.query((): IGear[] => []),
    getById: p.input(z.object({ id: z.string() })).query((): IGear | null => null),
    create: p.input(z.object({ name: z.string(), type: z.enum(['pedalera', 'amplificador', 'guitarra', 'procesador', 'otro']), brand: z.string().optional(), model: z.string().optional(), specs: z.record(z.string(), z.unknown()).optional() }))
      .mutation((): IGear => ({ _id: '', userId: '', name: '', type: 'otro', isDefault: false, createdAt: new Date(), updatedAt: new Date() })),
    update: p.input(z.object({ id: z.string(), data: z.object({ name: z.string().optional(), type: z.enum(['pedalera', 'amplificador', 'guitarra', 'procesador', 'outro']).optional(), brand: z.string().optional(), model: z.string().optional() }) }))
      .mutation((): IGear | null => null),
    delete: p.input(z.object({ id: z.string() })).mutation((): IGear | null => null),
    setDefault: p.input(z.object({ id: z.string() })).mutation((): IGear | null => null),
    getSpecs: p.input(z.object({ gearId: z.string(), brand: z.string(), model: z.string(), type: z.string() }))
      .query(() => ({ success: true, specs: null as Record<string, unknown> | null })),
  }),

  presets: router({
    list: p.query((): IPreset[] => []),
    favorites: p.query((): IPreset[] => []),
    getById: p.input(z.object({ id: z.string() })).query((): IPreset | null => null),
    generate: p.input(z.object({ songId: z.string(), gearIds: z.array(z.string()) }))
      .mutation(() => ({ success: true, preset: null as IPreset | null, toneResearch: null as unknown })),
    update: p.input(z.object({ id: z.string(), data: z.object({ rating: z.number().optional(), userNotes: z.string().optional(), isFavorite: z.boolean().optional() }).partial() }))
      .mutation((): IPreset | null => null),
    delete: p.input(z.object({ id: z.string() })).mutation((): IPreset | null => null),
  }),

  history: router({
    list: p.query((): IHistoryItem[] => []),
    clear: p.mutation(() => ({ success: true })),
  }),
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
