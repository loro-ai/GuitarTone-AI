/**
 * Este archivo re-exporta el tipo AppRouter desde el backend.
 *
 * IMPORTANTE: En el monorepo separado (frontend / backend en repos distintos),
 * tienes dos opciones:
 *
 * Opción A (recomendada para equipos pequeños):
 *   Copiar el archivo backend/src/routers.ts aquí y mantenerlo sincronizado.
 *   Solo se usa el TIPO, no el código de runtime.
 *
 * Opción B (avanzada):
 *   Publicar un package `@guitartone/types` en npm o usar un workspace.
 *
 * Por defecto apunta al backend en el mismo repositorio (monorepo dev),
 * pero el build de Vite solo extrae los tipos, no ejecuta el servidor.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppRouter } from "../../guitartone-backend/src/routers";

export type { AppRouter };
