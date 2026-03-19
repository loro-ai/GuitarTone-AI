import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Trash2, Star, Music, Settings, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<"gear" | "presets" | "history">("gear");
  const [newGearName, setNewGearName] = useState("");
  const [newGearType, setNewGearType] = useState<"pedalera" | "amplificador" | "guitarra">("pedalera");
  const [newGearBrand, setNewGearBrand] = useState("");
  const [newGearModel, setNewGearModel] = useState("");
  const [expandedPresets, setExpandedPresets] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedPresets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Queries
  const userGear = trpc.gear.list.useQuery();
  const userPresets = trpc.presets.list.useQuery();
  const favoritePresets = trpc.presets.favorites.useQuery();
  const searchHistory = trpc.history.list.useQuery();

  // Mutations
  const createGear = trpc.gear.create.useMutation({
    onSuccess: () => {
      userGear.refetch();
      setNewGearName("");
      setNewGearBrand("");
      setNewGearModel("");
      toast.success("Equipo agregado");
    },
    onError: () => toast.error("Error al agregar equipo"),
  });

  const deleteGear = trpc.gear.delete.useMutation({
    onSuccess: () => {
      userGear.refetch();
      toast.success("Equipo eliminado");
    },
    onError: () => toast.error("Error al eliminar equipo"),
  });

  const deletePreset = trpc.presets.delete.useMutation({
    onSuccess: () => {
      userPresets.refetch();
      favoritePresets.refetch();
      toast.success("Preset eliminado");
    },
    onError: () => toast.error("Error al eliminar preset"),
  });

  const toggleFavorite = trpc.presets.update.useMutation({
    onSuccess: () => {
      userPresets.refetch();
      favoritePresets.refetch();
    },
  });

  const handleAddGear = async () => {
    if (!newGearName || !newGearType) {
      toast.error("Completa los campos requeridos");
      return;
    }
    await createGear.mutateAsync({
      name: newGearName,
      type: newGearType,
      brand: newGearBrand || undefined,
      model: newGearModel || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user?.name || "Mi Perfil"}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/app">Nuevo Preset</Link>
            </Button>
            <Button variant="outline" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("gear")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              tab === "gear" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Mi Equipo
          </button>
          <button
            onClick={() => setTab("presets")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              tab === "presets" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Music className="w-4 h-4 inline mr-2" />
            Presets
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              tab === "history" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Historial
          </button>
        </div>

        {/* Tab Content */}
        {tab === "gear" && (
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Agregar Nuevo Equipo</CardTitle>
                <CardDescription>Agrega tu pedalera, amplificador o guitarra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gear-name">Nombre</Label>
                    <Input
                      id="gear-name"
                      placeholder="Mi Setup Principal"
                      value={newGearName}
                      onChange={(e) => setNewGearName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gear-type">Tipo</Label>
                    <Select value={newGearType} onValueChange={(v: any) => setNewGearType(v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pedalera">Pedalera</SelectItem>
                        <SelectItem value="amplificador">Amplificador</SelectItem>
                        <SelectItem value="guitarra">Guitarra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      placeholder="ZOOM"
                      value={newGearBrand}
                      onChange={(e) => setNewGearBrand(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      placeholder="B1"
                      value={newGearModel}
                      onChange={(e) => setNewGearModel(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button onClick={handleAddGear} disabled={createGear.isPending} className="w-full">
                  Agregar Equipo
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tu Equipo Guardado</h3>
              {userGear.data && userGear.data.length > 0 ? (
                <div className="grid gap-4">
                  {userGear.data.map((gear) => (
                    <Card key={String(gear._id)} className="border-border/50">
                      <CardContent className="pt-6 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{gear.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {gear.brand} {gear.model} • {gear.type}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGear.mutate({ id: String(gear._id) })}
                          disabled={deleteGear.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay equipo guardado aún</p>
              )}
            </div>
          </div>
        )}

        {tab === "presets" && (
          <div className="space-y-6">
            {/* Presets Favoritos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Presets Favoritos</h3>
              {favoritePresets.data && favoritePresets.data.length > 0 ? (
                <div className="grid gap-4">
                  {favoritePresets.data.map((preset) => {
                    const id = String(preset._id);
                    const isExpanded = expandedPresets.has(id);
                    return (
                      <Card key={id} className="border-accent/50 bg-card/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {/* Título y artista */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Music className="w-4 h-4 text-accent shrink-0" />
                                <p className="font-semibold text-foreground truncate">
                                  {preset.songTitle || "Sin título"}
                                </p>
                                {preset.songArtist && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    — {preset.songArtist}
                                  </p>
                                )}
                              </div>

                              {/* Badges de slots */}
                              {preset.presetsData && preset.presetsData.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {preset.presetsData.map((slot) => (
                                    <span
                                      key={slot.nombre}
                                      className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-medium"
                                    >
                                      {slot.nombre}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Fecha de creación */}
                              {preset.createdAt && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDate(preset.createdAt)}
                                </p>
                              )}

                              {/* Rating */}
                              {preset.rating && (
                                <p className="text-xs text-accent mt-1">{"⭐".repeat(preset.rating)}</p>
                              )}

                              {/* Notas del usuario */}
                              {preset.userNotes && (
                                <p className="text-sm text-muted-foreground mt-1 italic">
                                  "{preset.userNotes}"
                                </p>
                              )}

                              {/* Advertencia */}
                              {preset.advertencia && (
                                <div className="flex items-start gap-1.5 mt-2 text-yellow-500">
                                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <p className="text-xs">{preset.advertencia}</p>
                                </div>
                              )}

                              {/* Detalle expandido: momento_cancion por slot */}
                              {isExpanded && preset.presetsData && preset.presetsData.length > 0 && (
                                <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                                  {preset.presetsData.map((slot) => (
                                    <div key={slot.nombre} className="text-sm">
                                      <span className="bg-accent/20 text-accent px-1.5 py-0.5 rounded text-xs font-medium mr-2">
                                        {slot.nombre}
                                      </span>
                                      <span className="text-muted-foreground">{slot.momento_cancion}</span>
                                      {slot.descripcion && (
                                        <p className="text-xs text-muted-foreground/70 mt-0.5 ml-1">
                                          {slot.descripcion}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePreset.mutate({ id })}
                                disabled={deletePreset.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              {preset.presetsData && preset.presetsData.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpanded(id)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay presets favoritos</p>
              )}
            </div>

            {/* Todos los Presets */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Todos los Presets</h3>
              {userPresets.data && userPresets.data.length > 0 ? (
                <div className="grid gap-4">
                  {userPresets.data.map((preset) => {
                    const id = String(preset._id);
                    const isExpanded = expandedPresets.has(id);
                    return (
                      <Card key={id} className="border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {/* Título y artista */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Music className="w-4 h-4 text-accent shrink-0" />
                                <p className="font-semibold text-foreground truncate">
                                  {preset.songTitle || "Sin título"}
                                </p>
                                {preset.songArtist && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    — {preset.songArtist}
                                  </p>
                                )}
                              </div>

                              {/* Badges de slots */}
                              {preset.presetsData && preset.presetsData.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {preset.presetsData.map((slot) => (
                                    <span
                                      key={slot.nombre}
                                      className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-medium"
                                    >
                                      {slot.nombre}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Fecha de creación */}
                              {preset.createdAt && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDate(preset.createdAt)}
                                </p>
                              )}

                              {/* Notas del usuario */}
                              {preset.userNotes && (
                                <p className="text-sm text-muted-foreground mt-1 italic">
                                  "{preset.userNotes}"
                                </p>
                              )}

                              {/* Advertencia */}
                              {preset.advertencia && (
                                <div className="flex items-start gap-1.5 mt-2 text-yellow-500">
                                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <p className="text-xs">{preset.advertencia}</p>
                                </div>
                              )}

                              {/* Detalle expandido: momento_cancion por slot */}
                              {isExpanded && preset.presetsData && preset.presetsData.length > 0 && (
                                <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                                  {preset.presetsData.map((slot) => (
                                    <div key={slot.nombre} className="text-sm">
                                      <span className="bg-accent/20 text-accent px-1.5 py-0.5 rounded text-xs font-medium mr-2">
                                        {slot.nombre}
                                      </span>
                                      <span className="text-muted-foreground">{slot.momento_cancion}</span>
                                      {slot.descripcion && (
                                        <p className="text-xs text-muted-foreground/70 mt-0.5 ml-1">
                                          {slot.descripcion}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleFavorite.mutate({
                                      id,
                                      data: { isFavorite: !preset.isFavorite },
                                    })
                                  }
                                >
                                  <Star
                                    className={`w-4 h-4 ${preset.isFavorite ? "fill-accent text-accent" : ""}`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deletePreset.mutate({ id })}
                                  disabled={deletePreset.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              {preset.presetsData && preset.presetsData.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpanded(id)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay presets guardados</p>
              )}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historial de Búsquedas</h3>
            {searchHistory.data && searchHistory.data.length > 0 ? (
              <div className="grid gap-4">
                {searchHistory.data.map((item) => (
                  <Card key={String(item._id)} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        {item.coverUrl && (
                          <img src={item.coverUrl || ""} alt={item.title || ""} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.artist}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay historial de búsquedas</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
