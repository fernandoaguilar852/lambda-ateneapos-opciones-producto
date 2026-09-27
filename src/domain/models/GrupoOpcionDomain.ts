import { SwaggerSuccessResponse } from '../../core/common/swaggerTypes';

// Modelo de dominio de Grupo de Opciones (lo que se expone al cliente)
export interface GrupoOpcion {
  grupoOpcionId: number;
  clienteId: number;
  productoId: number;
  nombre: string;
  obligatorio: boolean;
  minimoSelecciones: number;
  maximoSelecciones: number;
  incluidosEnPrecio: number;
  cobrarAdicionales: boolean;
  orden: number;
  activo: boolean;
  createdAt: Date;
}

// Respuesta para operación individual (GET, PUT, DELETE)
export type GrupoOpcionResponse = SwaggerSuccessResponse<GrupoOpcion>;

// Respuesta para creación (POST) - 201
export type GrupoOpcionCreatedResponse = SwaggerSuccessResponse<GrupoOpcion>;

// Respuesta para listado (GET /productos/{productoId}/grupos-opciones)
export interface GrupoOpcionListData {
  gruposOpciones: GrupoOpcion[];
  total: number;
}

export type GrupoOpcionListResponse = SwaggerSuccessResponse<GrupoOpcionListData>;
