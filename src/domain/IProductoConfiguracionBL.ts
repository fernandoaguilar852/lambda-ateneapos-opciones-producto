import { ProductoConfiguracionCompleta } from './models/ProductoConfiguracionDomain';

/**
 * Interfaz para la lógica de negocio de configuración completa de productos
 */
export interface IProductoConfiguracionBL {
  /**
   * Obtener configuración completa de un producto
   * Incluye: datos del producto, grupos de opciones, opciones, recetas y modificadores
   */
  getConfiguracionCompleta(productoId: number, clienteId: number): Promise<ProductoConfiguracionCompleta>;
}
