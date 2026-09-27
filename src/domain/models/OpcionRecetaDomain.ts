import { SwaggerSuccessResponse } from '../../core/common/swaggerTypes';

// Modelo de dominio de Receta de Opción
export interface OpcionReceta {
  opcionRecetaId: number;
  clienteId: number;
  opcionId: number;
  insumoId: number;
  cantidadBase: number;
  mermaPct: number;
  activo: boolean;
  createdAt: Date;
}

// Modelo extendido con nombre del insumo
export interface OpcionRecetaConInsumo extends OpcionReceta {
  insumoNombre?: string;
}

// Respuesta para operación individual (POST, PUT, DELETE)
export type OpcionRecetaResponse = SwaggerSuccessResponse<OpcionReceta>;

// Respuesta para GET (listado de receta)
export interface OpcionRecetaListData {
  receta: OpcionRecetaConInsumo[];
  total: number;
}

export type OpcionRecetaListResponse = SwaggerSuccessResponse<OpcionRecetaListData>;
