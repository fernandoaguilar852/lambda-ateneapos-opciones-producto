import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ALLOWED_HEADERS_VALUES } from './core/utils/Constans';
import { GrupoOpcionController } from './controller/GrupoOpcionController';
import { GrupoOpcionBL } from './domain/GrupoOpcionBL';
import { GrupoOpcionRepository } from './repositories/GrupoOpcionRepository';
import { GrupoOpcionRequestDTO, UpdateGrupoOpcionRequestDTO } from './repositories/dtos/GrupoOpcionDTO';
import { OpcionController } from './controller/OpcionController';
import { OpcionBL } from './domain/OpcionBL';
import { OpcionRepository } from './repositories/OpcionRepository';
import { OpcionRequestDTO, UpdateOpcionRequestDTO } from './repositories/dtos/OpcionDTO';
import { OpcionRecetaController } from './controller/OpcionRecetaController';
import { OpcionRecetaBL } from './domain/OpcionRecetaBL';
import { OpcionRecetaRepository } from './repositories/OpcionRecetaRepository';
import { OpcionRecetaRequestDTO, UpdateOpcionRecetaRequestDTO } from './repositories/dtos/OpcionRecetaDTO';
import { ModificadorController } from './controller/ModificadorController';
import { ModificadorBL } from './domain/ModificadorBL';
import { ModificadorRepository } from './repositories/ModificadorRepository';
import { ModificadorRequestDTO, UpdateModificadorRequestDTO } from './repositories/dtos/ModificadorDTO';
import { ProductoConfiguracionController } from './controller/ProductoConfiguracionController';
import { ProductoConfiguracionBL } from './domain/ProductoConfiguracionBL';
import { ProductoConfiguracionRepository } from './repositories/ProductoConfiguracionRepository';
import { SwaggerResponseBuilder } from './core/common/SwaggerResponseBuilder';
import { authenticateRequest } from './auth/AuthMiddleware';

/**
 * Lambda Handler para API de Opciones de Producto
 * Maneja todos los endpoints CRUD de Grupos de Opciones, Opciones, Recetas y Modificadores
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
        // 4. Extrae clienteId del payload para multi-tenancy
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

        // Extraer clienteId del token
        const clienteId = userPayload.clienteId;

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

        // ========== ENDPOINTS DE RECETAS DE OPCIONES ==========

        // Instanciar controller de Recetas con DI
        const opcionRecetaController = new OpcionRecetaController(
            new OpcionRecetaBL(
                new OpcionRecetaRepository()
            )
        );

        // ========== ENDPOINTS DE MODIFICADORES ==========

        // Instanciar controller de Modificadores con DI
        const modificadorController = new ModificadorController(
            new ModificadorBL(
                new ModificadorRepository()
            )
        );

        // ========== ENDPOINTS DE CONFIGURACIÓN COMPLETA ==========

        // Instanciar controller de Configuración Completa con DI
        const productoConfiguracionController = new ProductoConfiguracionController(
            new ProductoConfiguracionBL(
                new ProductoConfiguracionRepository()
            )
        );

        // ========== ENDPOINTS DE GRUPOS DE OPCIONES ==========

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

        // ========== ENDPOINTS DE RECETAS DE OPCIONES ==========

        // POST /v1/pos/opciones/{opcionId}/receta - Agregar insumo a receta
        if (method === 'POST' && path.match(/^\/v1\/pos\/opciones\/\d+\/receta$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            const body: OpcionRecetaRequestDTO = JSON.parse(event.body || '{}');
            body.opcionId = opcionId; // Asegurar que el opcionId del path se usa
            return await opcionRecetaController.createOpcionReceta(clienteId, body, messageUuid, requestAppId);
        }

        // GET /v1/pos/opciones/{opcionId}/receta - Obtener receta completa
        if (method === 'GET' && path.match(/^\/v1\/pos\/opciones\/\d+\/receta$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            return await opcionRecetaController.getRecetaByOpcion(clienteId, opcionId, messageUuid, requestAppId);
        }

        // PUT /v1/pos/opciones/{opcionId}/receta/{insumoId} - Actualizar insumo
        if (method === 'PUT' && path.match(/^\/v1\/pos\/opciones\/\d+\/receta\/\d+$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            const insumoId = parseInt(event.pathParameters?.insumoId || '0');
            const body: UpdateOpcionRecetaRequestDTO = JSON.parse(event.body || '{}');
            return await opcionRecetaController.updateOpcionReceta(opcionId, insumoId, clienteId, body, messageUuid, requestAppId);
        }

        // DELETE /v1/pos/opciones/{opcionId}/receta/{insumoId} - Eliminar insumo
        if (method === 'DELETE' && path.match(/^\/v1\/pos\/opciones\/\d+\/receta\/\d+$/)) {
            const opcionId = parseInt(event.pathParameters?.opcionId || '0');
            const insumoId = parseInt(event.pathParameters?.insumoId || '0');
            return await opcionRecetaController.deleteOpcionReceta(opcionId, insumoId, clienteId, messageUuid, requestAppId);
        }

        // ========== ENDPOINTS DE MODIFICADORES ==========

        // POST /v1/pos/modificadores - Crear modificador
        if (method === 'POST' && path === '/v1/pos/modificadores') {
            const body: ModificadorRequestDTO = JSON.parse(event.body || '{}');
            return await modificadorController.createModificador(clienteId, body, messageUuid, requestAppId);
        }

        // GET /v1/pos/productos/{productoId}/modificadores - Listar modificadores por producto
        if (method === 'GET' && path.match(/^\/v1\/pos\/productos\/\d+\/modificadores$/)) {
            const productoId = parseInt(event.pathParameters?.productoId || '0');
            return await modificadorController.listModificadoresByProducto(clienteId, productoId, messageUuid, requestAppId);
        }

        // GET /v1/pos/modificadores/globales - Listar modificadores globales
        if (method === 'GET' && path === '/v1/pos/modificadores/globales') {
            return await modificadorController.listModificadoresGlobales(clienteId, messageUuid, requestAppId);
        }

        // PUT /v1/pos/modificadores/{modificadorId} - Actualizar modificador
        if (method === 'PUT' && path.match(/^\/v1\/pos\/modificadores\/\d+$/)) {
            const modificadorId = parseInt(event.pathParameters?.modificadorId || '0');
            const body: UpdateModificadorRequestDTO = JSON.parse(event.body || '{}');
            return await modificadorController.updateModificador(modificadorId, clienteId, body, messageUuid, requestAppId);
        }

        // DELETE /v1/pos/modificadores/{modificadorId} - Eliminar modificador
        if (method === 'DELETE' && path.match(/^\/v1\/pos\/modificadores\/\d+$/)) {
            const modificadorId = parseInt(event.pathParameters?.modificadorId || '0');
            return await modificadorController.deleteModificador(modificadorId, clienteId, messageUuid, requestAppId);
        }

        // ========== ENDPOINTS DE CONFIGURACIÓN COMPLETA ==========

        // GET /v1/pos/productos/{productoId}/configuracion-completa - Obtener configuración completa
        if (method === 'GET' && path.match(/^\/v1\/pos\/productos\/\d+\/configuracion-completa$/)) {
            const productoId = parseInt(event.pathParameters?.productoId || '0');
            return await productoConfiguracionController.getConfiguracionCompleta(productoId, clienteId, messageUuid, requestAppId);
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
