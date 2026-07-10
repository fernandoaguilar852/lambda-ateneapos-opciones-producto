// DTO de request para POST (lo que recibe el endpoint al crear)
export interface IvaRequestDTO {
  descripcion: string;
  valor: number;
  activo?: boolean;
}

// DTO de respuesta de la BD
export interface IvaDTO {
  iva_id: number;
  descripcion: string;
  valor: number;
  activo: boolean;
}

// DTO para actualización parcial (PATCH)
export interface PatchIvaRequestDTO {
  descripcion?: string;
  valor?: number;
  activo?: boolean;
}
