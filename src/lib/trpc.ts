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
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (apiUrl) {
    const baseUrl = apiUrl.replace(/\/$/, '');
    return `${baseUrl}/api/trpc`;
  }
  // En dev, Vite hace proxy de /api → localhost:3000
  return "/api/trpc";
}
