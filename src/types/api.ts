// Tipos que replican los del backend sin importar directamente del servidor.
// Mantenerlos sincronizados si se cambia el schema de MongoDB.

export interface IGearModuleEffect {
  tipo: string;
  parametros: Array<{ nombre: string; rango: string; descripcion?: string }>;
}

export interface IGearModule {
  nombre: string;
  label: string;
  puedeApagarse: boolean;
  efectos: IGearModuleEffect[];
}

export interface IGearManualData {
  description: string;
  esMultiEfectos: boolean;
  modules?: IGearModule[];
  parameters: Array<{
    name: string;
    range: string;
    defaultValue?: string;
    description: string;
  }>;
  learnings?: string[];
  imageUrl?: string;
  presetSlots?: number;
  notes: string;
  researchedAt: Date;
}

export interface IGear {
  _id?: string;
  userId: string;
  name: string;
  type: "pedalera" | "amplificador" | "guitarra" | "procesador" | "otro";
  brand?: string;
  model?: string;
  specs?: Record<string, unknown>;
  manualData?: IGearManualData;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GearConfig {
  gearId: string;
  gearNombre: string;
  gearTipo: string;
  parametros: Record<string, unknown>;
}

// Módulo del Zoom B1 con formato de pantalla (v6)
export interface ZoomB1Module {
  activo: boolean;
  display?: string;        // código de pantalla: "A7", "FF", "C5", etc.
  P1?: number;             // solo DRIVE: Gain 0-30
  P2?: number | string;    // DRIVE: Mix 0-10 | MOD_DELAY: Rate/Time/Key
  algoritmo?: string;      // legacy — mantener por compatibilidad
  [key: string]: unknown;
}

export interface ZoomB1Modulos {
  COMP_LIMIT: ZoomB1Module;
  EFX:        ZoomB1Module;
  DRIVE:      ZoomB1Module;
  EQ:         { LO: number; MID: number; HI: number };
  ZNR:        number;
  MOD_DELAY:  ZoomB1Module;
  REV_DELAY:  ZoomB1Module;
  PATCH_LVL:  number;
  [key: string]: unknown;
}

export interface GearConfigProcessador {
  gearId: string;
  gearNombre: string;
  gearTipo: 'procesador' | 'pedalera';
  modulos: ZoomB1Modulos;
}

export interface PresetConfig {
  nombre: string;
  tag?: string;
  etiqueta?: string;
  descripcion_corta?: string;
  momento_cancion: string;
  efecto_principal?: string;
  descripcion: string;
  explicacion?: string;
  /** Configuración por dispositivo — un bloque por cada equipo del usuario */
  configuracion: Array<GearConfig | GearConfigProcessador>;
  nota_tecnica?: string;
  consejos?: string[];
}

export interface IPreset {
  _id?: string;
  userId: string;
  songId: string;
  songTitle?: string;
  songArtist?: string;
  gearIds: string[];
  configuracion_base?: GearConfig[];
  presetsData: PresetConfig[];
  advertencia?: string;
  isFavorite: boolean;
  rating?: number;
  userNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISong {
  _id?: string;
  musicBrainzId: string;
  title: string;
  artist: string;
  releaseDate?: string;
  coverUrl?: string;
}

export interface ISearchHistory {
  _id?: string;
  userId: string;
  musicBrainzId?: string;
  title: string;
  artist: string;
  releaseDate?: string;
  coverUrl?: string;
  createdAt: Date;
}

export interface MusicBrainzResult {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
}
