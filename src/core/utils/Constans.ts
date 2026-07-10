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
