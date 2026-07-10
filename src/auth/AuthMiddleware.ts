import { APIGatewayProxyEvent } from 'aws-lambda';
import { validateJWT, JWTPayload } from './JWTValidator';
import { HttpStatus } from '../core/utils/Constans';

export interface AuthResult {
    authorized: boolean;
    payload?: JWTPayload;
    statusCode?: number;
    errorCode?: string;
    message?: string;
}

/**
 * Middleware de autenticación JWT para IVA (Global - SIN validación de clienteId)
 *
 * Validaciones que realiza:
 * 1. Extrae el token del header Authorization
 * 2. Valida firma JWT con JWT_SECRET de Parameter Store
 * 3. Valida que no esté expirado
 *
 * NO valida clienteId porque IVA es global para todo el sistema
 * NO consulta base de datos (máximo performance)
 *
 * @param event Evento de API Gateway
 * @returns Resultado de autenticación
 */
export async function authenticateRequest(
    event: APIGatewayProxyEvent
): Promise<AuthResult> {
    try {
        // 1. Extraer token del header Authorization
        const authHeader = event.headers.Authorization || event.headers.authorization;

        if (!authHeader) {
            return {
                authorized: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                errorCode: 'E004',
                message: 'Header Authorization requerido'
            };
        }

        if (!authHeader.startsWith('Bearer ')) {
            return {
                authorized: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                errorCode: 'E004',
                message: 'Formato de Authorization inválido. Use: Bearer <token>'
            };
        }

        const token = authHeader.substring(7); // Remover "Bearer "

        if (!token || token.trim() === '') {
            return {
                authorized: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                errorCode: 'E004',
                message: 'Token JWT requerido'
            };
        }

        // 2. Validar token JWT (firma y expiración)
        let payload: JWTPayload;
        try {
            payload = await validateJWT(token);
        } catch (error: any) {
            if (error.message === 'TOKEN_EXPIRED') {
                return {
                    authorized: false,
                    statusCode: HttpStatus.UNAUTHORIZED,
                    errorCode: 'E004',
                    message: 'Token expirado. Por favor, inicie sesión nuevamente.'
                };
            } else if (error.message === 'INVALID_TOKEN') {
                return {
                    authorized: false,
                    statusCode: HttpStatus.UNAUTHORIZED,
                    errorCode: 'E004',
                    message: 'Token inválido'
                };
            } else {
                return {
                    authorized: false,
                    statusCode: HttpStatus.UNAUTHORIZED,
                    errorCode: 'E004',
                    message: 'Error validando token'
                };
            }
        }

        // ✅ Autenticación exitosa (NO se valida clienteId porque IVA es global)
        console.log('[AuthMiddleware] Request autenticado exitosamente', {
            userId: payload.userId,
            clienteId: payload.clienteId,
            email: payload.email
        });

        return {
            authorized: true,
            payload: payload
        };

    } catch (error: any) {
        console.error('[AuthMiddleware] Error en autenticación:', error);

        return {
            authorized: false,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorCode: 'E999',
            message: 'Error interno en autenticación'
        };
    }
}
