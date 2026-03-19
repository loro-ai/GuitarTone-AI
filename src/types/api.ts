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

export interface PresetConfig {
  nombre: string;
  momento_cancion: string;
  descripcion: string;
  /** Configuración por dispositivo — un bloque por cada equipo del usuario */
  configuracion: GearConfig[];
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
