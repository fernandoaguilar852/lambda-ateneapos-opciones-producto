import jwt from 'jsonwebtoken';
import { getJWTSecret } from '../core/config/ParameterStore';

export interface JWTPayload {
    userId: number;
    clienteId: number;
    roles: string[];
    email: string;
    iat: number;
    exp: number;
}

/**
 * Valida un JWT token usando el JWT_SECRET de Parameter Store
 *
 * Validaciones que realiza:
 * 1. Firma válida (token no fue modificado)
 * 2. Token no expirado (compara exp con fecha actual)
 *
 * NO valida en base de datos (para máximo performance)
 *
 * @param token Token JWT a validar
 * @returns Payload decodificado si el token es válido
 * @throws Error si el token es inválido o está expirado
 */
export async function validateJWT(token: string): Promise<JWTPayload> {
    try {
        console.log('[JWTValidator] Iniciando validación de token');

        // Obtener JWT_SECRET desde Parameter Store (con cache de 10 min)
        const jwtSecret = await getJWTSecret();

        // Verificar el token
        // jwt.verify() automáticamente:
        // 1. Verifica que la firma sea válida (no fue modificado)
        // 2. Verifica que no esté expirado (compara exp con fecha actual)
        const decoded = jwt.verify(token, jwtSecret, {
            algorithms: ['HS256']
        }) as JWTPayload;

        console.log('[JWTValidator] Token válido', {
            userId: decoded.userId,
            clienteId: decoded.clienteId,
            exp: new Date(decoded.exp * 1000).toISOString()
        });

        return decoded;

    } catch (error: any) {
        console.error('[JWTValidator] Error validando token:', error.name, error.message);

        if (error.name === 'TokenExpiredError') {
            throw new Error('TOKEN_EXPIRED');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('INVALID_TOKEN');
        } else if (error.name === 'NotBeforeError') {
            throw new Error('TOKEN_NOT_ACTIVE');
        } else {
            throw new Error('TOKEN_VALIDATION_ERROR');
        }
    }
}

/**
 * Verifica si un token ha expirado sin validar la firma
 * Útil para verificación rápida sin llamar a Parameter Store
 *
 * @param token Token JWT
 * @returns true si está expirado
 */
export function isTokenExpired(token: string): boolean {
    try {
        const decoded: any = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            return true;
        }

        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;

    } catch (error) {
        return true;
    }
}
