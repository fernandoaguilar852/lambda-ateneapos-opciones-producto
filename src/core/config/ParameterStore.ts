import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

/**
 * Cliente de AWS Systems Manager
 * region se obtiene automáticamente del entorno de Lambda
 */
const ssmClient = new SSMClient({});

/**
 * Cache en memoria RAM de la Lambda (GRATIS - sin costo adicional)
 * Persiste entre requests mientras la Lambda esté warm
 */
let jwtSecretCache: string | null = null;
let jwtSecretCacheTime: number = 0;

// TTL del cache: 10 minutos
const CACHE_TTL = 10 * 60 * 1000; // 600,000 ms = 10 minutos

/**
 * Obtiene el JWT_SECRET desde AWS Parameter Store
 * Usa cache en memoria RAM por 10 minutos para optimizar performance
 *
 * @returns El JWT_SECRET desencriptado
 */
export async function getJWTSecret(): Promise<string> {
    const now = Date.now();
    const cacheAge = now - jwtSecretCacheTime;

    // Verificar si está en cache y no ha expirado
    if (jwtSecretCache && cacheAge < CACHE_TTL) {
        console.log(`[ParameterStore] JWT_SECRET desde cache RAM (${Math.round(cacheAge / 1000)}s de antigüedad) ⚡`);
        return jwtSecretCache; // ⚡ 0.001ms - instantáneo
    }

    // Cache miss o expirado: obtener de Parameter Store
    console.log('[ParameterStore] Obteniendo JWT_SECRET de AWS SSM...');

    try {
        const command = new GetParameterCommand({
            Name: process.env.JWT_SECRET_PARAMETER_NAME || '/ateneaall/jwt-secret',
            WithDecryption: true
        });

        const response = await ssmClient.send(command);

        if (!response.Parameter || !response.Parameter.Value) {
            throw new Error('JWT_SECRET no encontrado en Parameter Store');
        }

        // Guardar en cache en memoria RAM
        jwtSecretCache = response.Parameter.Value;
        jwtSecretCacheTime = now;

        console.log('[ParameterStore] JWT_SECRET obtenido y guardado en cache RAM por 10 minutos');
        return jwtSecretCache;

    } catch (error: any) {
        console.error('[ParameterStore] Error obteniendo JWT_SECRET:', error);

        if (error.name === 'ParameterNotFound') {
            throw new Error('JWT_SECRET no existe en Parameter Store. Ejecuta el comando de creación.');
        }

        if (error.name === 'AccessDeniedException') {
            throw new Error('Lambda no tiene permisos para leer Parameter Store');
        }

        throw new Error(`Error obteniendo JWT_SECRET: ${error.message}`);
    }
}

/**
 * Limpia el cache (útil para tests o forzar recarga)
 */
export function clearJWTSecretCache(): void {
    jwtSecretCache = null;
    jwtSecretCacheTime = 0;
    console.log('[ParameterStore] Cache de JWT_SECRET limpiado');
}
