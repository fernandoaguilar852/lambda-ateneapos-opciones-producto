/**
 * DTOs para Modificadores Predefinidos
 * Representación de datos de base de datos (snake_case)
 */

/**
 * DTO completo de Modificador (retornado por queries)
 */
export interface ModificadorDTO {
  modificador_id: number;
  cliente_id: number;
  producto_id: number | null;  // NULL = modificador global
  tipo: 'SIN' | 'EXTRA' | 'MODIFICACION';
  nombre: string;
  descripcion: string | null;
  precio_adicional: number;
  activo: boolean;
  orden: number;
  created_at: Date;
}

/**
 * DTO para crear un modificador
 */
export interface ModificadorRequestDTO {
  productoId?: number | null;  // NULL o ausente = global
  tipo: 'SIN' | 'EXTRA' | 'MODIFICACION';
  nombre: string;
  descripcion?: string;
  precioAdicional?: number;
  orden?: number;
}

/**
 * DTO para actualizar un modificador
 */
export interface UpdateModificadorRequestDTO {
  tipo?: 'SIN' | 'EXTRA' | 'MODIFICACION';
  nombre?: string;
  descripcion?: string;
  precioAdicional?: number;
  orden?: number;
}
