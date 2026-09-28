/**
 * Domain models para la configuración completa de un producto
 * Estructura anidada en camelCase para lógica de negocio
 * Incluye datos del producto + grupos de opciones + opciones + recetas + modificadores
 */

/**
 * Insumo de una receta
 */
export interface RecetaInsumo {
  opcionId: number;
  insumoId: number;
  insumoNombre: string;
  cantidadBase: number;
  mermaPct: number;
  activo: boolean;
}

/**
 * Opción con su receta completa
 */
export interface OpcionConReceta {
  opcionId: number;
  grupoOpcionId: number;
  nombre: string;
  descripcion: string | null;
  precioAdicional: number;
  disponible: boolean;
  orden: number;
  activo: boolean;
  createdAt: Date;
  receta: RecetaInsumo[];
}

/**
 * Grupo de opciones con sus opciones
 */
export interface GrupoOpcionCompleto {
  grupoOpcionId: number;
  productoId: number;
  nombre: string;
  descripcion: string | null;
  obligatorio: boolean;
  multipleSeleccion: boolean;
  minSelecciones: number;
  maxSelecciones: number;
  orden: number;
  activo: boolean;
  createdAt: Date;
  opciones: OpcionConReceta[];
}

/**
 * Modificador del producto
 */
export interface ModificadorProducto {
  modificadorId: number;
  productoId: number | null;
  tipo: 'SIN' | 'EXTRA' | 'MODIFICACION';
  nombre: string;
  descripcion: string | null;
  precioAdicional: number;
  orden: number;
  esGlobal: boolean;
}

/**
 * Configuración completa de un producto
 * Incluye todos los datos del producto + opciones + modificadores
 */
export interface ProductoConfiguracionCompleta {
  // Datos del producto
  productoId: number;
  clienteId: number;
  tipoProductoId: number | null;
  nombre: string;
  codExterno: string | null;
  codBarras: string | null;
  imagen: string | null;
  precio: number;
  unidadMedida: string;
  sigla: string | null;
  stockTotal: number;
  stockReservado: number;
  stockMinimo: number;
  manejaStock: boolean;
  usaReceta: boolean;
  activo: boolean;
  ivaId: number | null;

  // Configuración de opciones y modificadores
  gruposOpciones: GrupoOpcionCompleto[];
  modificadores: ModificadorProducto[];
}
