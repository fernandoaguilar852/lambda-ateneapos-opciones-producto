import { APIGatewayProxyResult } from 'aws-lambda';
import { IGrupoOpcionController } from './IGrupoOpcionController';
import { IGrupoOpcionBL } from '../domain/IGrupoOpcionBL';
import { GrupoOpcionRequestDTO, UpdateGrupoOpcionRequestDTO } from '../repositories/dtos/GrupoOpcionDTO';
import { SwaggerResponseBuilder } from '../core/common/SwaggerResponseBuilder';
import { ValidationError, NotFoundError } from '../domain/exceptions/CustomExceptions';
import { DatabaseError, DatabaseConnectionError } from '../domain/exceptions/CustomExceptions';
import { ALLOWED_HEADERS_VALUES } from '../core/utils/Constans';

export class GrupoOpcionController implements IGrupoOpcionController {

  constructor(private grupoOpcionBL: IGrupoOpcionBL) {}

  /**
   * POST /v1/pos/admin/productos/{productoId}/grupos-opciones - Crear Grupo
   */
  async createGrupoOpcion(
    clienteId: number,
    data: GrupoOpcionRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const grupo = await this.grupoOpcionBL.createGrupoOpcion(clienteId, data);

      // Construir respuesta exitosa (201 CREATED)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        201,
        grupo,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Grupo de opciones creado exitosamente'
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
   * GET /v1/pos/admin/grupos-opciones/{grupoId} - Obtener Grupo
   */
  async getGrupoOpcionById(
    grupoOpcionId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const grupo = await this.grupoOpcionBL.getGrupoOpcionById(grupoOpcionId, clienteId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        grupo,
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
   * GET /v1/pos/admin/productos/{productoId}/grupos-opciones - Listar Grupos
   */
  async listGruposByProducto(
    clienteId: number,
    productoId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const result = await this.grupoOpcionBL.listGruposByProducto(clienteId, productoId);

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
   * PUT /v1/pos/admin/grupos-opciones/{grupoId} - Actualizar Grupo
   */
  async updateGrupoOpcion(
    grupoOpcionId: number,
    clienteId: number,
    data: UpdateGrupoOpcionRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const grupo = await this.grupoOpcionBL.updateGrupoOpcion(grupoOpcionId, clienteId, data);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        grupo,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Grupo de opciones actualizado exitosamente'
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
   * DELETE /v1/pos/admin/grupos-opciones/{grupoId} - Eliminar Grupo
   */
  async deleteGrupoOpcion(
    grupoOpcionId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const grupo = await this.grupoOpcionBL.deleteGrupoOpcion(grupoOpcionId, clienteId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        grupo,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Grupo de opciones eliminado exitosamente'
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
    console.error('Error in GrupoOpcionController:', error);

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
