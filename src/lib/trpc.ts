import { createTRPCReact } from "@trpc/react-query";

// Importamos el tipo AppRouter del backend.
// En el repo separado esto se puede copiar el tipo manualmente
// o usar un package compartido. Por ahora importamos el tipo solo.
import type { AppRouter } from "./routerType";

export const trpc = createTRPCReact<AppRouter>();

/**
 * Devuelve la URL base del API.
 * - En producción (Vercel): usa VITE_API_URL (Railway)
 * - En desarrollo: usa el proxy de Vite configurado en vite.config.ts
 */
export function getApiUrl(): string {
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${baseUrl}/api/trpc`;
}
