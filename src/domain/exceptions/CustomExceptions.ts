/**
 * Excepciones personalizadas del dominio
 */

/**
 * Error de validación de datos
 * HTTP 400 BAD REQUEST
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Recurso no encontrado
 * HTTP 404 NOT FOUND
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflicto de recursos (duplicados, violación de unicidad)
 * HTTP 409 CONFLICT
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Error de base de datos / infraestructura
 * HTTP 500 INTERNAL SERVER ERROR
 */
export class DatabaseError extends Error {
  public readonly code?: string;
  public readonly detail?: string;

  constructor(message: string, code?: string, detail?: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.detail = detail;
  }
}

/**
 * Error de conexión a base de datos
 * HTTP 503 SERVICE UNAVAILABLE
 */
export class DatabaseConnectionError extends Error {
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
    this.code = code;
  }
}
