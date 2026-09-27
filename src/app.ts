import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ALLOWED_HEADERS_VALUES } from './core/utils/Constans';
import { IvaController } from './controller/IvaController';
import { IvaBL } from './domain/IvaBL';
import { IvaRepository } from './repositories/IvaRepository';
import { IvaRequestDTO, PatchIvaRequestDTO } from './repositories/dtos/IvaDTO';
import { GrupoOpcionController } from './controller/GrupoOpcionController';
import { GrupoOpcionBL } from './domain/GrupoOpcionBL';
import { GrupoOpcionRepository } from './repositories/GrupoOpcionRepository';
import { GrupoOpcionRequestDTO, UpdateGrupoOpcionRequestDTO } from './repositories/dtos/GrupoOpcionDTO';
import { OpcionController } from './controller/OpcionController';
import { OpcionBL } from './domain/OpcionBL';
import { OpcionRepository } from './repositories/OpcionRepository';
import { OpcionRequestDTO, UpdateOpcionRequestDTO } from './repositories/dtos/OpcionDTO';
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

        // ========== ENDPOINTS DE GRUPOS DE OPCIONES ==========

        // Instanciar controller de Grupos de Opciones con DI
        const grupoOpcionController = new GrupoOpcionController(
            new GrupoOpcionBL(
                new GrupoOpcionRepository()
            )
        );

        // ========== ENDPOINTS DE OPCIONES ==========

        // Instanciar controller de Opciones con DI
        const opcionController = new OpcionController(
            new OpcionBL(
                new OpcionRepository()
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

        // ========== ENDPOINTS DE GRUPOS DE OPCIONES ==========

        const clienteId = userPayload.clienteId;

        // POST /v1/pos/productos/{productoId}/grupos-opciones - Crear grupo
        if (method === 'POST' && path.match(/^\/v1\/pos\/productos\/\d+\/grupos-opciones$/)) {
            const productoId = parseInt(event.pathParameters?.productoId || '0');
            const body: GrupoOpcionRequestDTO = JSON.parse(event.body || '{}');
            body.productoId = productoId; // Asegurar que el productoId del path se usa
            return await grupoOpcionController.createGrupoOpcion(clienteId, body, messageUuid, requestAppId);
        }

        // GET /v1/pos/productos/{productoId}/grupos-opciones - Listar grupos por producto
        if (method === 'GET' && path.match(/^\/v1\/pos\/productos\/\d+\/grupos-opciones$/)) {
            const productoId = parseInt(event.pathParameters?.productoId || '0');
            return await grupoOpcionController.listGruposByProducto(clienteId, productoId, messageUuid, requestAppId);
        }

        // GET /v1/pos/grupos-opciones/{grupoId} - Obtener grupo por ID
        if (method === 'GET' && path.match(/^\/v1\/pos\/grupos-opciones\/\d+$/)) {
            const grupoId = parseInt(event.pathParameters?.grupoId || '0');
            return await grupoOpcionController.getGrupoOpcionById(grupoId, clienteId, messageUuid, requestAppId);
        }

        // PUT /v1/pos/grupos-opciones/{grupoId} - Actualizar grupo
        if (method === 'PUT' && path.match(/^\/v1\/pos\/grupos-opciones\/\d+$/)) {
            const grupoId = parseInt(event.pathParameters?.grupoId || '0');
            const body: UpdateGrupoOpcionRequestDTO = JSON.parse(event.body || '{}');
            return await grupoOpcionController.updateGrupoOpcion(grupoId, clienteId, body, messageUuid, requestAppId);
        }

        // DELETE /v1/pos/grupos-opciones/{grupoId} - Eliminar grupo
        if (method === 'DELETE' && path.match(/^\/v1\/pos\/grupos-opciones\/\d+$/)) {
            const grupoId = parseInt(event.pathParameters?.grupoId || '0');
            return await grupoOpcionController.deleteGrupoOpcion(grupoId, clienteId, messageUuid, requestAppId);
        }

        // ========== ENDPOINTS DE OPCIONES ==========

        // POST /v1/pos/grupos-opciones/{grupoId}/opciones - Crear opción
        if (method === 'POST' && path.match(/^\/v1\/pos\/grupos-opciones\/\d+\/opciones$/)) {
            const grupoId = parseInt(event.pathParameters?.grupoId || '0');
            const body: OpcionRequestDTO = JSON.parse(event.body || '{}');
            body.grupoOpcionId = grupoId; // Asegurar que el grupoId del path se usa
            return await opcionController.createOpcion(clienteId, body, messageUuid, requestAppId);
        }

        // GET /v1/pos/grupos-opciones/{grupoId}/opciones - Listar opciones por grupo
        if (method === 'GET' && path.match(/^\/v1\/pos\/grupos-opciones\/\d+\/opciones$/)) {
            const grupoId = parseInt(event.pathParameters?.grupoId || '0');
            return await opcionController.listOpcionesByGrupo(clienteId, grupoId, messageUuid, requestAppId);
        }

        // GET /v1/pos/opciones/{opcionId} - Obtener opción por ID
        if (method === 'GET' && path.match(/^\/v1\/pos\/opciones\/\d+$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            return await opcionController.getOpcionById(opcionId, clienteId, messageUuid, requestAppId);
        }

        // PUT /v1/pos/opciones/{opcionId} - Actualizar opción
        if (method === 'PUT' && path.match(/^\/v1\/pos\/opciones\/\d+$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            const body: UpdateOpcionRequestDTO = JSON.parse(event.body || '{}');
            return await opcionController.updateOpcion(opcionId, clienteId, body, messageUuid, requestAppId);
        }

        // DELETE /v1/pos/opciones/{opcionId} - Eliminar opción
        if (method === 'DELETE' && path.match(/^\/v1\/pos\/opciones\/\d+$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            return await opcionController.deleteOpcion(opcionId, clienteId, messageUuid, requestAppId);
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
