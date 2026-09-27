import { IOpcionRecetaBL } from './IOpcionRecetaBL';
import { IOpcionRecetaRepository } from '../repositories/IOpcionRecetaRepository';
import { OpcionRecetaRequestDTO, UpdateOpcionRecetaRequestDTO } from '../repositories/dtos/OpcionRecetaDTO';
import { OpcionReceta, OpcionRecetaListData } from './models/OpcionRecetaDomain';
import { OpcionRecetaMapper } from './mappers/OpcionRecetaMapper';
import { ValidationError, NotFoundError } from './exceptions/CustomExceptions';

export class OpcionRecetaBL implements IOpcionRecetaBL {

  constructor(private opcionRecetaRepository: IOpcionRecetaRepository) {}

  /**
   * Crear una nueva receta de opción (agregar insumo)
   */
  async createOpcionReceta(clienteId: number, data: OpcionRecetaRequestDTO): Promise<OpcionReceta> {
    // Validar clienteId
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateOpcionRecetaData(data);

    // Crear la receta
    const recetaDTO = await this.opcionRecetaRepository.createOpcionReceta(clienteId, data);

    // Transformar a modelo de dominio
    return OpcionRecetaMapper.toDomain(recetaDTO);
  }

  /**
   * Obtener receta completa de una opción
   */
  async getRecetaByOpcion(clienteId: number, opcionId: number): Promise<OpcionRecetaListData> {
    // Validar IDs
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    if (!opcionId || opcionId <= 0) {
      throw new ValidationError('El opcionId debe ser un número positivo válido');
    }

    // Obtener receta
    const recetaDTOs = await this.opcionRecetaRepository.getRecetaByOpcion(clienteId, opcionId);

    // Transformar a modelos de dominio
    const receta = OpcionRecetaMapper.toDomainListConInsumo(recetaDTOs);

    return {
      receta,
      total: receta.length
    };
  }

  /**
   * Actualizar insumo en receta
   */
  async updateOpcionReceta(
    opcionId: number,
    insumoId: number,
    clienteId: number,
    data: UpdateOpcionRecetaRequestDTO
  ): Promise<OpcionReceta> {
    // Validar IDs
    if (!opcionId || opcionId <= 0) {
      throw new ValidationError('El opcionId debe ser un número positivo válido');
    }

    if (!insumoId || insumoId <= 0) {
      throw new ValidationError('El insumoId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateUpdateOpcionRecetaData(data);

    // Actualizar la receta
    const recetaDTO = await this.opcionRecetaRepository.updateOpcionReceta(opcionId, insumoId, clienteId, data);

    if (!recetaDTO) {
      throw new NotFoundError(`Insumo ${insumoId} no encontrado en la receta de la opción ${opcionId}`);
    }

    // Transformar a modelo de dominio
    return OpcionRecetaMapper.toDomain(recetaDTO);
  }

  /**
   * Eliminar insumo de receta (soft delete)
   */
  async deleteOpcionReceta(opcionId: number, insumoId: number, clienteId: number): Promise<OpcionReceta> {
    // Validar IDs
    if (!opcionId || opcionId <= 0) {
      throw new ValidationError('El opcionId debe ser un número positivo válido');
    }

    if (!insumoId || insumoId <= 0) {
      throw new ValidationError('El insumoId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Eliminar el insumo de la receta
    const recetaDTO = await this.opcionRecetaRepository.deleteOpcionReceta(opcionId, insumoId, clienteId);

    if (!recetaDTO) {
      throw new NotFoundError(`Insumo ${insumoId} no encontrado en la receta de la opción ${opcionId}`);
    }

    // Transformar a modelo de dominio
    return OpcionRecetaMapper.toDomain(recetaDTO);
  }

  /**
   * Validar datos de creación de receta
   */
  private validateOpcionRecetaData(data: OpcionRecetaRequestDTO): void {
    if (!data.opcionId || data.opcionId <= 0) {
      throw new ValidationError('El opcionId es requerido y debe ser un número positivo');
    }

    if (!data.insumoId || data.insumoId <= 0) {
      throw new ValidationError('El insumoId es requerido y debe ser un número positivo');
    }

    if (!data.cantidadBase || data.cantidadBase <= 0) {
      throw new ValidationError('La cantidadBase es requerida y debe ser mayor a 0');
    }

    if (data.mermaPct !== undefined && (data.mermaPct < 0 || data.mermaPct > 100)) {
      throw new ValidationError('El mermaPct debe estar entre 0 y 100');
    }
  }

  /**
   * Validar datos de actualización de receta
   */
  private validateUpdateOpcionRecetaData(data: UpdateOpcionRecetaRequestDTO): void {
    if (!data.cantidadBase || data.cantidadBase <= 0) {
      throw new ValidationError('La cantidadBase es requerida y debe ser mayor a 0');
    }

    if (data.mermaPct !== undefined && (data.mermaPct < 0 || data.mermaPct > 100)) {
      throw new ValidationError('El mermaPct debe estar entre 0 y 100');
    }
  }
}
