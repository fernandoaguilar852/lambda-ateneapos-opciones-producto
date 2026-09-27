/**
 * Constantes y configuraciones para la Lambda de Monedas
 */

// ===========================
// HTTP STATUS CODES
// ===========================
export enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
}

// ===========================
// DEFAULT VALUES
// ===========================
export const enum DefaultValues {
    EMPTY_STRING = '',
    ZERO_PORT = 0,
    NODE_ENV_LOCAL = 'LOCAL',
    NODE_ENV_DEV = 'DEV',
    NODE_ENV_PROD = 'PROD',
    NODE_ENV_QA = 'QA',
}

// ===========================
// ERROR MESSAGES
// ===========================
export const enum Message {
    REPOSITORY_ERROR = 'Internal server Error',
    BAD_REQUEST = 'Bad Request Error',
}

export const ERROR_QUERY_EXCEPTION_MESSAGE = 'The database query has fail';

// ===========================
// QUERIES IVA (PostgreSQL)
// ===========================
export enum QUERIES {
    CREATE_IVA = `
        INSERT INTO iva (descripcion, valor, activo)
        VALUES ($1, $2, $3)
        RETURNING iva_id, descripcion, valor, activo
    `,

    GET_IVA_BY_ID = `
        SELECT iva_id, descripcion, valor, activo
        FROM iva
        WHERE iva_id = $1
    `,

    LIST_ALL_IVAS = `
        SELECT iva_id, descripcion, valor, activo
        FROM iva
        WHERE activo = true
        ORDER BY iva_id
    `,

    COUNT_ALL_IVAS = `
        SELECT COUNT(*) as count
        FROM iva
        WHERE activo = true
    `,

    LIST_IVAS_PAGINATED = `
        SELECT iva_id, descripcion, valor, activo
        FROM iva
        WHERE activo = true
        ORDER BY iva_id
        LIMIT $1 OFFSET $2
    `,

    UPDATE_IVA = `
        UPDATE iva
        SET descripcion = $1,
            valor = $2,
            activo = $3
        WHERE iva_id = $4
        RETURNING iva_id, descripcion, valor, activo
    `,

    PATCH_IVA = `
        UPDATE iva
        SET descripcion = COALESCE($1, descripcion),
            valor = COALESCE($2, valor),
            activo = COALESCE($3, activo)
        WHERE iva_id = $4
        RETURNING iva_id, descripcion, valor, activo
    `,

    DELETE_IVA = `
        UPDATE iva
        SET activo = false
        WHERE iva_id = $1
        RETURNING iva_id, descripcion, valor, activo
    `,

    CHECK_IVA_EXISTS_BY_DESCRIPCION = `
        SELECT COUNT(*) as count
        FROM iva
        WHERE descripcion = $1 AND iva_id != $2
    `,

    // ===========================
    // GRUPOS DE OPCIONES
    // ===========================

    CREATE_GRUPO_OPCION = `
        INSERT INTO producto_grupo_opcion (
            cliente_id, producto_id, nombre, obligatorio,
            minimo_selecciones, maximo_selecciones, incluidos_en_precio,
            cobrar_adicionales, orden, activo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        RETURNING grupo_opcion_id, cliente_id, producto_id, nombre,
                  obligatorio, minimo_selecciones, maximo_selecciones,
                  incluidos_en_precio, cobrar_adicionales, orden,
                  activo, created_at
    `,

    GET_GRUPO_OPCION_BY_ID = `
        SELECT grupo_opcion_id, cliente_id, producto_id, nombre,
               obligatorio, minimo_selecciones, maximo_selecciones,
               incluidos_en_precio, cobrar_adicionales, orden,
               activo, created_at
        FROM producto_grupo_opcion
        WHERE grupo_opcion_id = $1 AND cliente_id = $2 AND activo = true
    `,

    LIST_GRUPOS_BY_PRODUCTO = `
        SELECT grupo_opcion_id, cliente_id, producto_id, nombre,
               obligatorio, minimo_selecciones, maximo_selecciones,
               incluidos_en_precio, cobrar_adicionales, orden,
               activo, created_at
        FROM producto_grupo_opcion
        WHERE cliente_id = $1 AND producto_id = $2 AND activo = true
        ORDER BY orden ASC, grupo_opcion_id ASC
    `,

    UPDATE_GRUPO_OPCION = `
        UPDATE producto_grupo_opcion
        SET nombre = $1,
            obligatorio = $2,
            minimo_selecciones = $3,
            maximo_selecciones = $4,
            incluidos_en_precio = $5,
            cobrar_adicionales = $6,
            orden = $7
        WHERE grupo_opcion_id = $8 AND cliente_id = $9 AND activo = true
        RETURNING grupo_opcion_id, cliente_id, producto_id, nombre,
                  obligatorio, minimo_selecciones, maximo_selecciones,
                  incluidos_en_precio, cobrar_adicionales, orden,
                  activo, created_at
    `,

    DELETE_GRUPO_OPCION = `
        UPDATE producto_grupo_opcion
        SET activo = false
        WHERE grupo_opcion_id = $1 AND cliente_id = $2 AND activo = true
        RETURNING grupo_opcion_id, cliente_id, producto_id, nombre,
                  obligatorio, minimo_selecciones, maximo_selecciones,
                  incluidos_en_precio, cobrar_adicionales, orden,
                  activo, created_at
    `,

    // ===========================
    // OPCIONES
    // ===========================

    CREATE_OPCION = `
        INSERT INTO producto_opcion (
            grupo_opcion_id, cliente_id, nombre,
            precio_adicional, por_defecto, orden, activo
        )
        VALUES ($1, $2, $3, $4, $5, $6, true)
        RETURNING opcion_id, grupo_opcion_id, cliente_id, nombre,
                  precio_adicional, por_defecto, orden, activo, created_at
    `,

    GET_OPCION_BY_ID = `
        SELECT opcion_id, grupo_opcion_id, cliente_id, nombre,
               precio_adicional, por_defecto, orden, activo, created_at
        FROM producto_opcion
        WHERE opcion_id = $1 AND cliente_id = $2 AND activo = true
    `,

    LIST_OPCIONES_BY_GRUPO = `
        SELECT opcion_id, grupo_opcion_id, cliente_id, nombre,
               precio_adicional, por_defecto, orden, activo, created_at
        FROM producto_opcion
        WHERE cliente_id = $1 AND grupo_opcion_id = $2 AND activo = true
        ORDER BY orden ASC, opcion_id ASC
    `,

    UPDATE_OPCION = `
        UPDATE producto_opcion
        SET nombre = $1,
            precio_adicional = $2,
            por_defecto = $3,
            orden = $4
        WHERE opcion_id = $5 AND cliente_id = $6 AND activo = true
        RETURNING opcion_id, grupo_opcion_id, cliente_id, nombre,
                  precio_adicional, por_defecto, orden, activo, created_at
    `,

    DELETE_OPCION = `
        UPDATE producto_opcion
        SET activo = false
        WHERE opcion_id = $1 AND cliente_id = $2 AND activo = true
        RETURNING opcion_id, grupo_opcion_id, cliente_id, nombre,
                  precio_adicional, por_defecto, orden, activo, created_at
    `,

    // ===========================
    // RECETAS DE OPCIONES
    // ===========================

    CREATE_OPCION_RECETA = `
        INSERT INTO producto_opcion_receta (
            cliente_id, opcion_id, insumo_id,
            cantidad_base, merma_pct, activo
        )
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING opcion_receta_id, cliente_id, opcion_id, insumo_id,
                  cantidad_base, merma_pct, activo, created_at
    `,

    GET_RECETA_BY_OPCION = `
        SELECT
            por.opcion_receta_id,
            por.cliente_id,
            por.opcion_id,
            por.insumo_id,
            por.cantidad_base,
            por.merma_pct,
            por.activo,
            por.created_at,
            i.nombre as insumo_nombre
        FROM producto_opcion_receta por
        LEFT JOIN insumo i ON por.insumo_id = i.insumo_id
        WHERE por.cliente_id = $1 AND por.opcion_id = $2 AND por.activo = true
        ORDER BY por.opcion_receta_id ASC
    `,

    UPDATE_OPCION_RECETA = `
        UPDATE producto_opcion_receta
        SET cantidad_base = $1,
            merma_pct = $2
        WHERE opcion_id = $3 AND insumo_id = $4 AND cliente_id = $5 AND activo = true
        RETURNING opcion_receta_id, cliente_id, opcion_id, insumo_id,
                  cantidad_base, merma_pct, activo, created_at
    `,

    DELETE_OPCION_RECETA = `
        UPDATE producto_opcion_receta
        SET activo = false
        WHERE opcion_id = $1 AND insumo_id = $2 AND cliente_id = $3 AND activo = true
        RETURNING opcion_receta_id, cliente_id, opcion_id, insumo_id,
                  cantidad_base, merma_pct, activo, created_at
    `,
}

// ===========================
// CORS HEADERS
// ===========================
export enum ALLOWED_HEADERS_VALUES {
    CONTENT_TYPE = 'application/json',
    ALLOWED_HEADERS = '*',
    ALLOW_ORIGIN = '*',
    ALLOWED_METHODS = 'POST,GET,PUT,DELETE,OPTIONS',
}

// ===========================
// RESPONSE TEMPLATES
// ===========================
export const OPERATION_SUCCESS_RESPONSE = {
    statusCode: 200,
    status: 'Success',
    message: 'Operation Successfully',
};
