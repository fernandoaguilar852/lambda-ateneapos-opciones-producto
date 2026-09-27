// DTO de request para POST (agregar insumo a receta)
export interface OpcionRecetaRequestDTO {
  opcionId: number;
  insumoId: number;
  cantidadBase: number;
  mermaPct?: number;
}

// DTO de respuesta de la BD
export interface OpcionRecetaDTO {
  opcion_receta_id: number;
  cliente_id: number;
  opcion_id: number;
  insumo_id: number;
  cantidad_base: number;
  merma_pct: number;
  activo: boolean;
  created_at: Date;
}

// DTO para actualización (PUT)
export interface UpdateOpcionRecetaRequestDTO {
  cantidadBase: number;
  mermaPct?: number;
}

// DTO extendido con nombre del insumo (para el GET que trae la receta completa)
export interface OpcionRecetaConInsumoDTO extends OpcionRecetaDTO {
  insumo_nombre?: string;
}
