import { APIGatewayProxyResult } from 'aws-lambda';
import { IOpcionRecetaController } from './IOpcionRecetaController';
import { IOpcionRecetaBL } from '../domain/IOpcionRecetaBL';
import { OpcionRecetaRequestDTO, UpdateOpcionRecetaRequestDTO } from '../repositories/dtos/OpcionRecetaDTO';
import { SwaggerResponseBuilder } from '../core/common/SwaggerResponseBuilder';
import { ValidationError, NotFoundError, ConflictError } from '../domain/exceptions/CustomExceptions';
import { DatabaseError, DatabaseConnectionError } from '../domain/exceptions/CustomExceptions';
import { ALLOWED_HEADERS_VALUES } from '../core/utils/Constans';

export class OpcionRecetaController implements IOpcionRecetaController {

  constructor(private opcionRecetaBL: IOpcionRecetaBL) {}

  /**
   * POST /v1/pos/opciones/{opcionId}/receta - Agregar insumo a receta
   */
  async createOpcionReceta(
    clienteId: number,
    data: OpcionRecetaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const receta = await this.opcionRecetaBL.createOpcionReceta(clienteId, data);

      // Construir respuesta exitosa (201 CREATED)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        201,
        receta,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Insumo agregado a la receta exitosamente'
      );

      return {
        statusCode: 201,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };

    } catch (error: any) {
      return this.handleError(error, messageUuid, requestAppId);
    }
  }

  /**
   * GET /v1/pos/opciones/{opcionId}/receta - Obtener receta completa
   */
  async getRecetaByOpcion(
    clienteId: number,
    opcionId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const result = await this.opcionRecetaBL.getRecetaByOpcion(clienteId, opcionId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        result,
        messageUuid,
        requestAppId
      );

      return {
        statusCode: 200,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };

    } catch (error: any) {
      return this.handleError(error, messageUuid, requestAppId);
    }
  }

  /**
   * PUT /v1/pos/opciones/{opcionId}/receta/{insumoId} - Actualizar insumo
   */
  async updateOpcionReceta(
    opcionId: number,
    insumoId: number,
    clienteId: number,
    data: UpdateOpcionRecetaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const receta = await this.opcionRecetaBL.updateOpcionReceta(opcionId, insumoId, clienteId, data);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        receta,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Insumo actualizado en la receta exitosamente'
      );

      return {
        statusCode: 200,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };

    } catch (error: any) {
      return this.handleError(error, messageUuid, requestAppId);
    }
  }

  /**
   * DELETE /v1/pos/opciones/{opcionId}/receta/{insumoId} - Eliminar insumo
   */
  async deleteOpcionReceta(
    opcionId: number,
    insumoId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const receta = await this.opcionRecetaBL.deleteOpcionReceta(opcionId, insumoId, clienteId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        receta,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Insumo eliminado de la receta exitosamente'
      );

      return {
        statusCode: 200,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };

    } catch (error: any) {
      return this.handleError(error, messageUuid, requestAppId);
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(
    error: any,
    messageUuid: string,
    requestAppId: string
  ): APIGatewayProxyResult {
    console.error('Error in OpcionRecetaController:', error);

    // Determinar el tipo de error y construir respuesta apropiada
    if (error instanceof ValidationError) {
      // 400 BAD REQUEST
      const errors = [
        SwaggerResponseBuilder.buildErrorItem('E001', error.message)
      ];

      const response = SwaggerResponseBuilder.buildErrorResponse(
        400,
        errors,
        messageUuid,
        requestAppId
      );

      return {
        statusCode: 400,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };
    }

    if (error instanceof NotFoundError) {
      // 404 NOT FOUND
      const errors = [
        SwaggerResponseBuilder.buildErrorItem('E002', error.message)
      ];

      const response = SwaggerResponseBuilder.buildErrorResponse(
        404,
        errors,
        messageUuid,
        requestAppId
      );

      return {
        statusCode: 404,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };
    }

    if (error instanceof ConflictError) {
      // 409 CONFLICT
      const errors = [
        SwaggerResponseBuilder.buildErrorItem('E003', error.message)
      ];

      const response = SwaggerResponseBuilder.buildErrorResponse(
        409,
        errors,
        messageUuid,
        requestAppId
      );

      return {
        statusCode: 409,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };
    }

    if (error instanceof DatabaseConnectionError) {
      // 503 SERVICE UNAVAILABLE
      const errorDetail = error.code
        ? `${error.message} (Código PG: ${error.code})`
        : error.message;

      const errors = [
        SwaggerResponseBuilder.buildErrorItem('E004', errorDetail)
      ];

      const response = SwaggerResponseBuilder.buildErrorResponse(
        503,
        errors,
        messageUuid,
        requestAppId
      );

      return {
        statusCode: 503,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };
    }

    if (error instanceof DatabaseError) {
      // 500 INTERNAL SERVER ERROR (error de base de datos)
      const errorDetail = error.code
        ? `${error.message} (Código PG: ${error.code})`
        : error.message;

      const errors = [
        SwaggerResponseBuilder.buildErrorItem('E005', errorDetail)
      ];

      const response = SwaggerResponseBuilder.buildErrorResponse(
        500,
        errors,
        messageUuid,
        requestAppId
      );

      return {
        statusCode: 500,
        headers: this.getCorsHeaders(),
        body: JSON.stringify(response)
      };
    }

    // 500 INTERNAL SERVER ERROR (error no manejado)
    const errors = [
      SwaggerResponseBuilder.buildErrorItem(
        'E999',
        'Internal server error'
      )
    ];

    const response = SwaggerResponseBuilder.buildErrorResponse(
      500,
      errors,
      messageUuid,
      requestAppId
    );

    return {
      statusCode: 500,
      headers: this.getCorsHeaders(),
      body: JSON.stringify(response)
    };
  }

  /**
   * Obtener headers CORS
   */
  private getCorsHeaders(): Record<string, string> {
    return {
      'Content-Type': ALLOWED_HEADERS_VALUES.CONTENT_TYPE,
      'Access-Control-Allow-Headers': ALLOWED_HEADERS_VALUES.ALLOWED_HEADERS,
      'Access-Control-Allow-Origin': ALLOWED_HEADERS_VALUES.ALLOW_ORIGIN,
      'Access-Control-Allow-Methods': ALLOWED_HEADERS_VALUES.ALLOWED_METHODS
    };
  }
}
