import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ALLOWED_HEADERS_VALUES } from './core/utils/Constans';
import { IvaController } from './controller/IvaController';
import { IvaBL } from './domain/IvaBL';
import { IvaRepository } from './repositories/IvaRepository';
import { IvaRequestDTO, PatchIvaRequestDTO } from './repositories/dtos/IvaDTO';
import { SwaggerResponseBuilder } from './core/common/SwaggerResponseBuilder';
import { authenticateRequest } from './auth/AuthMiddleware';

/**
 * Lambda Handler para API de IVA
 * Maneja todos los endpoints CRUD de IVA siguiendo el contrato Swagger
 * CON AUTENTICACIÓN JWT
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const path = event.path;
        const method = event.httpMethod;

        // Extraer headers requeridos por Swagger
        const messageUuid = event.headers?.['message-uuid'] || event.headers?.['Message-Uuid'] || '';
        const requestAppId = event.headers?.['request-app-id'] || event.headers?.['Request-App-Id'] || '';

        // Validar headers requeridos
        if (!messageUuid || !requestAppId) {
            const errors = [
                SwaggerResponseBuilder.buildErrorItem(
                    'E000',
                    'Headers requeridos: message-uuid y request-app-id'
                )
            ];

            const errorResponse = SwaggerResponseBuilder.buildErrorResponse(
                400,
                errors,
                messageUuid || 'unknown',
                requestAppId || 'unknown'
            );

            return {
                statusCode: 400,
                headers: {
                    'Content-Type': ALLOWED_HEADERS_VALUES.CONTENT_TYPE,
                    'Access-Control-Allow-Headers': ALLOWED_HEADERS_VALUES.ALLOWED_HEADERS,
                    'Access-Control-Allow-Origin': ALLOWED_HEADERS_VALUES.ALLOW_ORIGIN,
                    'Access-Control-Allow-Methods': ALLOWED_HEADERS_VALUES.ALLOWED_METHODS,
                },
                body: JSON.stringify(errorResponse)
            };
        }

        // ═══════════════════════════════════════════════════════════
        // AUTENTICACIÓN JWT
        // ═══════════════════════════════════════════════════════════

        console.log('[Lambda] Validando autenticación JWT...');

        // Validar autenticación JWT
        // 1. Extrae token del header Authorization
        // 2. Valida firma con JWT_SECRET (cache de 10 min)
        // 3. Valida expiración
        // NO valida clienteId porque IVA es global
        const authResult = await authenticateRequest(event);

        if (!authResult.authorized) {
            const errors = [
                SwaggerResponseBuilder.buildErrorItem(
                    authResult.errorCode || 'E004',
                    authResult.message || 'No autorizado'
                )
            ];

            const errorResponse = SwaggerResponseBuilder.buildErrorResponse(
                authResult.statusCode || 401,
                errors,
                messageUuid,
                requestAppId
            );

            return {
                statusCode: authResult.statusCode || 401,
                headers: {
                    'Content-Type': ALLOWED_HEADERS_VALUES.CONTENT_TYPE,
                    'Access-Control-Allow-Headers': ALLOWED_HEADERS_VALUES.ALLOWED_HEADERS,
                    'Access-Control-Allow-Origin': ALLOWED_HEADERS_VALUES.ALLOW_ORIGIN,
                    'Access-Control-Allow-Methods': ALLOWED_HEADERS_VALUES.ALLOWED_METHODS,
                },
                body: JSON.stringify(errorResponse)
            };
        }

        // Usuario autenticado exitosamente
        const userPayload = authResult.payload!;
        console.log('[Lambda] Usuario autenticado:', {
            userId: userPayload.userId,
            clienteId: userPayload.clienteId,
            email: userPayload.email,
            roles: userPayload.roles
        });

        // ========== ENDPOINTS DE IVA ==========

        // Instanciar controller de IVA con DI
        const ivaController = new IvaController(
            new IvaBL(
                new IvaRepository()
            )
        );

        // POST /v1/pos/ivas - Crear IVA
        if (method === 'POST' && path === '/v1/pos/ivas') {
            const body: IvaRequestDTO = JSON.parse(event.body || '{}');
            return await ivaController.createIva(body, messageUuid, requestAppId);
        }

        // GET /v1/pos/ivas - Listar todos los IVAs con paginación
        if (method === 'GET' && path === '/v1/pos/ivas') {
            // Validar que los parámetros de paginación sean requeridos
            if (!event.queryStringParameters?.pageSize || !event.queryStringParameters?.pageNumber) {
                const errors = [
                    SwaggerResponseBuilder.buildErrorItem(
                        'E001',
                        'Los parámetros pageSize y pageNumber son requeridos'
                    )
                ];

                const errorResponse = SwaggerResponseBuilder.buildErrorResponse(
                    400,
                    errors,
                    messageUuid,
                    requestAppId
                );

                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': ALLOWED_HEADERS_VALUES.CONTENT_TYPE,
                        'Access-Control-Allow-Headers': ALLOWED_HEADERS_VALUES.ALLOWED_HEADERS,
                        'Access-Control-Allow-Origin': ALLOWED_HEADERS_VALUES.ALLOW_ORIGIN,
                        'Access-Control-Allow-Methods': ALLOWED_HEADERS_VALUES.ALLOWED_METHODS,
                    },
                    body: JSON.stringify(errorResponse)
                };
            }

            // Extraer parámetros de paginación de query string
            const pageSize = parseInt(event.queryStringParameters.pageSize);
            const pageNumber = parseInt(event.queryStringParameters.pageNumber);

            return await ivaController.listAllIvas(messageUuid, requestAppId, pageSize, pageNumber);
        }

        // GET /v1/pos/ivas/{ivaId} - Consultar IVA por ID
        if (method === 'GET' && path.match(/^\/v1\/pos\/ivas\/\d+$/)) {
            const ivaId = parseInt(event.pathParameters?.ivaId || '0');
            return await ivaController.getIvaById(ivaId, messageUuid, requestAppId);
        }

        // PUT /v1/pos/ivas/{ivaId} - Actualizar IVA (completo)
        if (method === 'PUT' && path.match(/^\/v1\/pos\/ivas\/\d+$/)) {
            const ivaId = parseInt(event.pathParameters?.ivaId || '0');
            const body: IvaRequestDTO = JSON.parse(event.body || '{}');
            return await ivaController.updateIva(ivaId, body, messageUuid, requestAppId);
        }

        // PATCH /v1/pos/ivas/{ivaId} - Actualizar IVA (parcial)
        if (method === 'PATCH' && path.match(/^\/v1\/pos\/ivas\/\d+$/)) {
            const ivaId = parseInt(event.pathParameters?.ivaId || '0');
            const body: PatchIvaRequestDTO = JSON.parse(event.body || '{}');
            return await ivaController.patchIva(ivaId, body, messageUuid, requestAppId);
        }

        // DELETE /v1/pos/ivas/{ivaId} - Eliminar IVA
        if (method === 'DELETE' && path.match(/^\/v1\/pos\/ivas\/\d+$/)) {
            const ivaId = parseInt(event.pathParameters?.ivaId || '0');
            return await ivaController.deleteIva(ivaId, messageUuid, requestAppId);
        }

        // Si no coincide con ninguna ruta
        return {
            statusCode: 404,
            headers: {
                'Content-Type': ALLOWED_HEADERS_VALUES.CONTENT_TYPE,
                'Access-Control-Allow-Headers': ALLOWED_HEADERS_VALUES.ALLOWED_HEADERS,
                'Access-Control-Allow-Origin': ALLOWED_HEADERS_VALUES.ALLOW_ORIGIN,
                'Access-Control-Allow-Methods': ALLOWED_HEADERS_VALUES.ALLOWED_METHODS,
            },
            body: JSON.stringify({
                error: 'Endpoint not found',
                path: path,
                method: method
            })
        };

    } catch (e) {
        console.error('Error en lambdaHandler:', e);

        // Respuesta de error genérica
        return {
            statusCode: 500,
            headers: {
                'Content-Type': ALLOWED_HEADERS_VALUES.CONTENT_TYPE,
                'Access-Control-Allow-Headers': ALLOWED_HEADERS_VALUES.ALLOWED_HEADERS,
                'Access-Control-Allow-Origin': ALLOWED_HEADERS_VALUES.ALLOW_ORIGIN,
                'Access-Control-Allow-Methods': ALLOWED_HEADERS_VALUES.ALLOWED_METHODS,
            },
            body: JSON.stringify({
                error: 'Internal Server Error'
            })
        };
    }
};
