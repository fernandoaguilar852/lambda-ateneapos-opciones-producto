import { DatabaseError as PgError } from 'pg';
import {
  ValidationError,
  ConflictError,
  DatabaseError,
  DatabaseConnectionError
} from '../../domain/exceptions/CustomExceptions';

/**
 * Códigos de error de PostgreSQL
 * Referencia: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export enum PostgresErrorCode {
  // Violaciones de constraints
  UNIQUE_VIOLATION = '23505',
  NOT_NULL_VIOLATION = '23502',
  FOREIGN_KEY_VIOLATION = '23503',
  CHECK_VIOLATION = '23514',

  // Errores de tipo de datos
  INVALID_TEXT_REPRESENTATION = '22P02',
  NUMERIC_VALUE_OUT_OF_RANGE = '22003',
  STRING_DATA_RIGHT_TRUNCATION = '22001',

  // Errores de sintaxis y objetos
  SYNTAX_ERROR = '42601',
  UNDEFINED_TABLE = '42P01',
  UNDEFINED_COLUMN = '42703',

  // Errores de conexión
  CONNECTION_EXCEPTION = '08000',
  CONNECTION_FAILURE = '08006',
  CONNECTION_DOES_NOT_EXIST = '08003',

  // Errores de recursos
  TOO_MANY_CONNECTIONS = '53300',
  DISK_FULL = '53100',
  OUT_OF_MEMORY = '53200',
}

/**
 * Interfaz para errores de PostgreSQL
 */
interface PostgresError extends Error {
  code?: string;
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
  schema?: string;
}

/**
 * Handler para mapear errores de PostgreSQL a excepciones del dominio
 */
export class PostgresErrorHandler {

  /**
   * Mapea un error de PostgreSQL a una excepción personalizada del dominio
   */
  static handleError(error: any, context?: string): never {
    const pgError = error as PostgresError;
    const errorCode = pgError.code;
    const errorMessage = pgError.message || 'Database error';
    const errorDetail = pgError.detail || '';

    console.error('PostgreSQL Error:', {
      code: errorCode,
      message: errorMessage,
      detail: errorDetail,
      context,
      constraint: pgError.constraint,
      table: pgError.table,
      column: pgError.column
    });

    // Mapear según el código de error
    switch (errorCode) {
      // VIOLACIONES DE CONSTRAINTS (409 CONFLICT)
      case PostgresErrorCode.UNIQUE_VIOLATION:
        throw new ConflictError(
          this.extractUniqueViolationMessage(pgError)
        );

      // VIOLACIONES DE NOT NULL (400 BAD REQUEST)
      case PostgresErrorCode.NOT_NULL_VIOLATION:
        throw new ValidationError(
          this.extractNotNullMessage(pgError)
        );

      // VIOLACIONES DE FOREIGN KEY (400 BAD REQUEST)
      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        throw new ValidationError(
          this.extractForeignKeyMessage(pgError)
        );

      // VIOLACIONES DE CHECK CONSTRAINT (400 BAD REQUEST)
      case PostgresErrorCode.CHECK_VIOLATION:
        throw new ValidationError(
          `Violación de restricción de validación: ${errorDetail || errorMessage}`
        );

      // ERRORES DE TIPO DE DATOS (400 BAD REQUEST)
      case PostgresErrorCode.INVALID_TEXT_REPRESENTATION:
        throw new ValidationError(
          `Tipo de dato inválido: ${errorDetail || 'El valor proporcionado no es válido para el campo especificado'}`
        );

      case PostgresErrorCode.NUMERIC_VALUE_OUT_OF_RANGE:
        throw new ValidationError(
          `Valor numérico fuera de rango: ${errorDetail || errorMessage}`
        );

      case PostgresErrorCode.STRING_DATA_RIGHT_TRUNCATION:
        throw new ValidationError(
          `El valor excede la longitud máxima permitida: ${errorDetail || errorMessage}`
        );

      // ERRORES DE CONEXIÓN (503 SERVICE UNAVAILABLE)
      case PostgresErrorCode.CONNECTION_EXCEPTION:
      case PostgresErrorCode.CONNECTION_FAILURE:
      case PostgresErrorCode.CONNECTION_DOES_NOT_EXIST:
        throw new DatabaseConnectionError(
          'Error de conexión con la base de datos. Por favor, intente nuevamente.',
          errorCode
        );

      // ERRORES DE RECURSOS (503 SERVICE UNAVAILABLE)
      case PostgresErrorCode.TOO_MANY_CONNECTIONS:
        throw new DatabaseConnectionError(
          'La base de datos ha alcanzado el límite de conexiones. Por favor, intente nuevamente en unos momentos.',
          errorCode
        );

      case PostgresErrorCode.DISK_FULL:
      case PostgresErrorCode.OUT_OF_MEMORY:
        throw new DatabaseError(
          'Error de recursos del servidor. Por favor, contacte al administrador.',
          errorCode,
          errorDetail
        );

      // ERRORES DE OBJETOS NO ENCONTRADOS (500 INTERNAL SERVER ERROR)
      case PostgresErrorCode.UNDEFINED_TABLE:
        throw new DatabaseError(
          'Error de configuración de base de datos: tabla no encontrada.',
          errorCode,
          pgError.table
        );

      case PostgresErrorCode.UNDEFINED_COLUMN:
        throw new DatabaseError(
          'Error de configuración de base de datos: columna no encontrada.',
          errorCode,
          pgError.column
        );

      case PostgresErrorCode.SYNTAX_ERROR:
        throw new DatabaseError(
          'Error de sintaxis en la consulta SQL.',
          errorCode,
          errorDetail
        );

      // ERROR GENÉRICO
      default:
        throw new DatabaseError(
          context
            ? `Error en operación de base de datos (${context}): ${errorMessage}`
            : `Error en operación de base de datos: ${errorMessage}`,
          errorCode,
          errorDetail
        );
    }
  }

  /**
   * Extrae un mensaje amigable de error de violación de unicidad
   */
  private static extractUniqueViolationMessage(error: PostgresError): string {
    const constraint = error.constraint || '';
    const detail = error.detail || '';

    // Intentar extraer el valor duplicado del detalle
    const keyMatch = detail.match(/Key \((.+?)\)=\((.+?)\)/);

    if (keyMatch) {
      const [, field, value] = keyMatch;
      return `Ya existe un registro con ${field} = "${value}"`;
    }

    if (constraint.includes('codigo_iso')) {
      return 'Ya existe una moneda con este código ISO';
    }

    return `El valor ya existe en el sistema. Violación de unicidad: ${constraint || detail}`;
  }

  /**
   * Extrae un mensaje amigable de error de campo requerido
   */
  private static extractNotNullMessage(error: PostgresError): string {
    const column = error.column || 'campo';
    const columnName = this.formatColumnName(column);

    return `El campo "${columnName}" es requerido y no puede ser nulo`;
  }

  /**
   * Extrae un mensaje amigable de error de llave foránea
   */
  private static extractForeignKeyMessage(error: PostgresError): string {
    const detail = error.detail || '';
    const constraint = error.constraint || '';

    // Intentar extraer información del detalle
    if (detail.includes('not present')) {
      return `El registro referenciado no existe. ${detail}`;
    }

    if (detail.includes('still referenced')) {
      return `No se puede eliminar el registro porque está siendo referenciado por otros registros. ${detail}`;
    }

    return `Violación de integridad referencial: ${constraint || detail}`;
  }

  /**
   * Formatea el nombre de columna de snake_case a un formato más legible
   */
  private static formatColumnName(columnName: string): string {
    return columnName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Verifica si el error es un error de PostgreSQL
   */
  static isPostgresError(error: any): boolean {
    return error && typeof error.code === 'string' && error.code.length === 5;
  }
}
