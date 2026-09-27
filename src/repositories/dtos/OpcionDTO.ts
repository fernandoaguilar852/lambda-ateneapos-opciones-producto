// DTO de request para POST (crear opción)
export interface OpcionRequestDTO {
  grupoOpcionId: number;
  nombre: string;
  precioAdicional?: number;
  porDefecto?: boolean;
  orden?: number;
}

// DTO de respuesta de la BD
export interface OpcionDTO {
  opcion_id: number;
  grupo_opcion_id: number;
  cliente_id: number;
  nombre: string;
  precio_adicional: number;
  por_defecto: boolean;
  orden: number;
  activo: boolean;
  created_at: Date;
}

// DTO para actualización (PUT)
export interface UpdateOpcionRequestDTO {
  nombre: string;
  precioAdicional?: number;
  porDefecto?: boolean;
  orden?: number;
}
