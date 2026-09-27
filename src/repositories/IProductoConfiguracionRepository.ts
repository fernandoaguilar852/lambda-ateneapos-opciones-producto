import { ProductoConfiguracionCompletaDTO } from './dtos/ProductoConfiguracionDTO';

/**
 * Interfaz para el repositorio de configuración completa de productos
 */
export interface IProductoConfiguracionRepository {
  /**
   * Obtener configuración completa de un producto
   * Incluye: datos del producto, grupos de opciones, opciones, recetas y modificadores
   */
  getConfiguracionCompleta(productoId: number, clienteId: number): Promise<ProductoConfiguracionCompletaDTO | null>;
}
