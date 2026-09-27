import { SwaggerSuccessResponse } from '../../core/common/swaggerTypes';

// Modelo de dominio de Opción (lo que se expone al cliente)
export interface Opcion {
  opcionId: number;
  grupoOpcionId: number;
  clienteId: number;
  nombre: string;
  precioAdicional: number;
  porDefecto: boolean;
  orden: number;
  activo: boolean;
  createdAt: Date;
}

// Respuesta para operación individual (GET, PUT, DELETE)
export type OpcionResponse = SwaggerSuccessResponse<Opcion>;

// Respuesta para creación (POST) - 201
export type OpcionCreatedResponse = SwaggerSuccessResponse<Opcion>;

// Respuesta para listado (GET /grupos-opciones/{grupoId}/opciones)
export interface OpcionListData {
  opciones: Opcion[];
  total: number;
}

export type OpcionListResponse = SwaggerSuccessResponse<OpcionListData>;
