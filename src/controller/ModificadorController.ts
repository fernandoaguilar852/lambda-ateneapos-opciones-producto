import { APIGatewayProxyResult } from 'aws-lambda';
import { IModificadorController } from './IModificadorController';
import { IModificadorBL } from '../domain/IModificadorBL';
import { ModificadorRequestDTO, UpdateModificadorRequestDTO } from '../repositories/dtos/ModificadorDTO';
import { SwaggerResponseBuilder } from '../core/common/SwaggerResponseBuilder';
import { ValidationError, NotFoundError, ConflictError } from '../domain/exceptions/CustomExceptions';
import { DatabaseError, DatabaseConnectionError } from '../domain/exceptions/CustomExceptions';
import { ALLOWED_HEADERS_VALUES } from '../core/utils/Constans';

export class ModificadorController implements IModificadorController {

  constructor(private modificadorBL: IModificadorBL) {}

  /**
   * POST /v1/pos/modificadores - Crear modificador
   */
  async createModificador(
    clienteId: number,
    data: ModificadorRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const modificador = await this.modificadorBL.createModificador(clienteId, data);

      // Construir respuesta exitosa (201 CREATED)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        201,
        modificador,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Modificador creado exitosamente'
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
   * GET /v1/pos/modificadores/{modificadorId} - Obtener por ID
   */
  async getModificadorById(
    modificadorId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const modificador = await this.modificadorBL.getModificadorById(modificadorId, clienteId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        modificador,
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
   * GET /v1/pos/productos/{productoId}/modificadores - Listar por producto
   */
  async listModificadoresByProducto(
    clienteId: number,
    productoId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const result = await this.modificadorBL.listModificadoresByProducto(clienteId, productoId);

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
   * GET /v1/pos/modificadores/globales - Listar globales
   */
  async listModificadoresGlobales(
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const result = await this.modificadorBL.listModificadoresGlobales(clienteId);

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
   * PUT /v1/pos/modificadores/{modificadorId} - Actualizar modificador
   */
  async updateModificador(
    modificadorId: number,
    clienteId: number,
    data: UpdateModificadorRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const modificador = await this.modificadorBL.updateModificador(modificadorId, clienteId, data);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        modificador,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Modificador actualizado exitosamente'
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
   * DELETE /v1/pos/modificadores/{modificadorId} - Eliminar modificador
   */
  async deleteModificador(
    modificadorId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const modificador = await this.modificadorBL.deleteModificador(modificadorId, clienteId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        modificador,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Modificador eliminado exitosamente'
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
    console.error('Error in ModificadorController:', error);

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
