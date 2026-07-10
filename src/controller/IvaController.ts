import { APIGatewayProxyResult } from 'aws-lambda';
import { IIvaController } from './IIvaController';
import { IIvaBL } from '../domain/IIvaBL';
import { IvaRequestDTO, PatchIvaRequestDTO } from '../repositories/dtos/IvaDTO';
import { SwaggerResponseBuilder } from '../core/common/SwaggerResponseBuilder';
import { ValidationError, NotFoundError, ConflictError } from '../domain/IvaBL';
import { DatabaseError, DatabaseConnectionError } from '../domain/exceptions/CustomExceptions';
import { ALLOWED_HEADERS_VALUES } from '../core/utils/Constans';

export class IvaController implements IIvaController {

  constructor(private ivaBL: IIvaBL) {}

  /**
   * POST /v1/pos/ivas - Crear IVA
   */
  async createIva(
    data: IvaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const iva = await this.ivaBL.createIva(data);

      // Construir respuesta exitosa (201 CREATED)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        201,
        iva,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Resource created successfully'
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
   * GET /v1/pos/ivas/{ivaId} - Consultar IVA por ID
   */
  async getIvaById(
    ivaId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const iva = await this.ivaBL.getIvaById(ivaId);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        iva,
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
   * GET /v1/pos/ivas - Listar IVAs con paginación
   */
  async listAllIvas(
    messageUuid: string,
    requestAppId: string,
    pageSize?: number,
    pageNumber?: number
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio con parámetros de paginación
      const result = await this.ivaBL.listAllIvas(pageSize, pageNumber);

      // Extraer paginación del resultado
      const { pagination, ...data } = result;

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        data,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Operation completed successfully',
        pagination
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
   * PUT /v1/pos/ivas/{ivaId} - Actualizar IVA (completo)
   */
  async updateIva(
    ivaId: number,
    data: IvaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const iva = await this.ivaBL.updateIva(ivaId, data);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        iva,
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
   * PATCH /v1/pos/ivas/{ivaId} - Actualizar IVA (parcial)
   */
  async patchIva(
    ivaId: number,
    data: PatchIvaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio
      const iva = await this.ivaBL.patchIva(ivaId, data);

      // Construir respuesta exitosa (200 OK)
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        iva,
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
   * DELETE /v1/pos/ivas/{ivaId} - Eliminar IVA
   */
  async deleteIva(
    ivaId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult> {
    try {
      // Llamar a la lógica de negocio (retorna la data eliminada)
      const iva = await this.ivaBL.deleteIva(ivaId);

      // Construir respuesta exitosa (200 OK) con la data eliminada
      const response = SwaggerResponseBuilder.buildSuccessResponse(
        200,
        iva,
        messageUuid,
        requestAppId,
        '0000',
        'Success',
        'Resource deleted successfully'
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
    console.error('Error in IvaController:', error);

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
