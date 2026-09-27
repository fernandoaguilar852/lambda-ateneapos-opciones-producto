/**
 * Modelos de Dominio para Modificadores (camelCase)
 */

/**
 * Modelo de dominio para Modificador
 */
export interface Modificador {
  modificadorId: number;
  clienteId: number;
  productoId: number | null;  // NULL = modificador global
  tipo: 'SIN' | 'EXTRA' | 'MODIFICACION';
  nombre: string;
  descripcion: string | null;
  precioAdicional: number;
  activo: boolean;
  orden: number;
  createdAt: Date;
}

/**
 * Respuesta para listado de modificadores
 */
export interface ModificadorListData {
  modificadores: Modificador[];
  total: number;
}
