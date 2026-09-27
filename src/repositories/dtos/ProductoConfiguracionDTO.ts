/**
 * DTOs para la configuración completa de un producto
 * Incluye datos del producto + grupos de opciones + opciones + recetas + modificadores
 */

/**
 * Producto básico (desde tabla producto)
 */
export interface ProductoDTO {
  producto_id: number;
  cliente_id: number;
  tipo_producto_id: number | null;
  nombre: string;
  cod_externo: string | null;
  cod_barras: string | null;
  imagen: string | null;
  precio: number;
  unidad_medida: string;
  sigla: string | null;
  stock_total: number;
  stock_reservado: number;
  stock_minimo: number;
  maneja_stock: boolean;
  usa_receta: boolean;
  activo: boolean;
  iva_id: number | null;
}

/**
 * Insumo de una receta (con JOIN a tabla insumo)
 */
export interface RecetaInsumoDTO {
  opcion_id: number;
  insumo_id: number;
  insumo_nombre: string;
  cantidad: number;
  unidad_medida: string;
  activo: boolean;
}

/**
 * Opción con su receta completa
 */
export interface OpcionConRecetaDTO {
  opcion_id: number;
  grupo_opcion_id: number;
  nombre: string;
  descripcion: string | null;
  precio_adicional: number;
  disponible: boolean;
  orden: number;
  activo: boolean;
  created_at: Date;
  receta: RecetaInsumoDTO[];
}

/**
 * Grupo de opciones con sus opciones
 */
export interface GrupoOpcionCompletoDTO {
  grupo_opcion_id: number;
  producto_id: number;
  nombre: string;
  descripcion: string | null;
  obligatorio: boolean;
  multiple_seleccion: boolean;
  min_selecciones: number;
  max_selecciones: number;
  orden: number;
  activo: boolean;
  created_at: Date;
  opciones: OpcionConRecetaDTO[];
}

/**
 * Modificador predefinido (específico o global)
 */
export interface ModificadorProductoDTO {
  modificador_id: number;
  producto_id: number | null;
  tipo: 'SIN' | 'EXTRA' | 'MODIFICACION';
  nombre: string;
  descripcion: string | null;
  precio_adicional: number;
  orden: number;
  es_global: boolean;  // Calculado: producto_id IS NULL
}

/**
 * Configuración completa de un producto
 * Incluye todos los datos del producto + opciones + modificadores
 */
export interface ProductoConfiguracionCompletaDTO {
  // Datos del producto
  producto_id: number;
  cliente_id: number;
  tipo_producto_id: number | null;
  nombre: string;
  cod_externo: string | null;
  cod_barras: string | null;
  imagen: string | null;
  precio: number;
  unidad_medida: string;
  sigla: string | null;
  stock_total: number;
  stock_reservado: number;
  stock_minimo: number;
  maneja_stock: boolean;
  usa_receta: boolean;
  activo: boolean;
  iva_id: number | null;

  // Configuración de opciones y modificadores
  grupos_opciones: GrupoOpcionCompletoDTO[];
  modificadores: ModificadorProductoDTO[];
}
