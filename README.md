# GuitarTone AI — Frontend

Interfaz React + Vite + Tailwind. Se despliega en **Vercel**.

## Stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- tRPC client v11
- shadcn/ui
- wouter (routing)

---

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# → Editar .env con tus credenciales

# 3. Asegurarte que el backend está corriendo en localhost:3000
# → El proxy de Vite redirige /api → localhost:3000 automáticamente

# 4. Arrancar
npm run dev
# → http://localhost:5173
```

---

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend en Railway (ej: `https://guitartone-api.up.railway.app`) |
| `VITE_OAUTH_PORTAL_URL` | URL del servidor OAuth de Manus |
| `VITE_APP_ID` | App ID de Manus |

---

## Deploy en Vercel

1. Crear proyecto en [vercel.com](https://vercel.com)
2. **Import Git Repository** → seleccionar este repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Ir a **Environment Variables** y agregar las variables de la tabla
7. **IMPORTANTE**: actualizar `vercel.json` con la URL real de tu backend Railway:
   ```json
   "destination": "https://TU-BACKEND.up.railway.app/api/:path*"
   ```
8. Deploy

---

## Conectar tipos del backend

El frontend importa el tipo `AppRouter` del backend para que tRPC tenga
autocompletado y validación de tipos en el editor.

**Opción A — Dev en el mismo equipo (recomendada):**
Tener ambos repos en la misma carpeta y el `tsconfig.json` apunta al
backend con un path relativo. No requiere nada extra.

**Opción B — Repos en máquinas distintas:**
Copiar el archivo `backend/src/routers.ts` al frontend como
`src/lib/backendRouterType.ts` y actualizar el import en
`src/lib/routerType.ts`. Solo los tipos se usan (no hay código de runtime).

---

## Estructura

```
src/
├── _core/hooks/useAuth.ts     # Hook de autenticación
├── components/ui/             # Componentes shadcn/ui
├── contexts/ThemeContext.tsx  # Dark/light mode
├── lib/trpc.ts                # Cliente tRPC
├── pages/
│   ├── Home.tsx               # Landing page
│   ├── WizardApp.tsx          # Wizard de 4 pasos (app principal)
│   └── Profile.tsx            # Panel de usuario
├── shared/const.ts            # Constantes compartidas
└── types/api.ts               # Tipos del dominio
```
