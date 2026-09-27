import { IProductoConfiguracionBL } from './IProductoConfiguracionBL';
import { IProductoConfiguracionRepository } from '../repositories/IProductoConfiguracionRepository';
import { ProductoConfiguracionCompleta } from './models/ProductoConfiguracionDomain';
import { ProductoConfiguracionMapper } from './mappers/ProductoConfiguracionMapper';
import { ValidationError, NotFoundError } from './exceptions/CustomExceptions';

export class ProductoConfiguracionBL implements IProductoConfiguracionBL {

  constructor(private repository: IProductoConfiguracionRepository) {}

  /**
   * Obtener configuración completa de un producto
   * Incluye validaciones de negocio
   */
  async getConfiguracionCompleta(productoId: number, clienteId: number): Promise<ProductoConfiguracionCompleta> {

    // Validar parámetros
    if (!productoId || productoId <= 0) {
      throw new ValidationError('El productoId debe ser un número positivo');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo');
    }

    // Obtener configuración del repositorio
    const configuracionDTO = await this.repository.getConfiguracionCompleta(productoId, clienteId);

    // Validar que el producto existe
    if (!configuracionDTO) {
      throw new NotFoundError(`Producto con ID ${productoId} no encontrado o no pertenece al cliente`);
    }

    // Mapear a domain model
    const configuracion = ProductoConfiguracionMapper.toDomain(configuracionDTO);

    return configuracion;
  }
}
