// DTO de request para POST (crear grupo de opciones)
export interface GrupoOpcionRequestDTO {
  productoId: number;
  nombre: string;
  obligatorio?: boolean;
  minimoSelecciones?: number;
  maximoSelecciones?: number;
  incluidosEnPrecio?: number;
  cobrarAdicionales?: boolean;
  orden?: number;
}

// DTO de respuesta de la BD
export interface GrupoOpcionDTO {
  grupo_opcion_id: number;
  cliente_id: number;
  producto_id: number;
  nombre: string;
  obligatorio: boolean;
  minimo_selecciones: number;
  maximo_selecciones: number;
  incluidos_en_precio: number;
  cobrar_adicionales: boolean;
  orden: number;
  activo: boolean;
  created_at: Date;
}

// DTO para actualización (PUT)
export interface UpdateGrupoOpcionRequestDTO {
  nombre: string;
  obligatorio?: boolean;
  minimoSelecciones?: number;
  maximoSelecciones?: number;
  incluidosEnPrecio?: number;
  cobrarAdicionales?: boolean;
  orden?: number;
}
