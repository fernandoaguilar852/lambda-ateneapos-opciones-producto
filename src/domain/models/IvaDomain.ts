import { SwaggerSuccessResponse, SwaggerErrorResponse, SwaggerPagination } from '../../core/common/swaggerTypes';

// Modelo de dominio de IVA (lo que se expone al cliente)
export interface Iva {
  ivaId: number;
  descripcion: string;
  valor: number;
  activo: boolean;
}

// Respuesta para operación individual (GET, PUT, PATCH, DELETE)
export type IvaResponse = SwaggerSuccessResponse<Iva>;

// Respuesta para creación (POST) - 201
export type IvaCreatedResponse = SwaggerSuccessResponse<Iva>;

// Respuesta para listado (GET /ivas)
export interface IvaListData {
  ivas: Iva[];
  pagination?: SwaggerPagination;
}

export type IvaListResponse = SwaggerSuccessResponse<IvaListData>;

// Respuesta de error
export type IvaErrorResponse = SwaggerErrorResponse;
