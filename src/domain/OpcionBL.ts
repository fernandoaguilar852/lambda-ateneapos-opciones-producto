import { IOpcionBL } from './IOpcionBL';
import { IOpcionRepository } from '../repositories/IOpcionRepository';
import { OpcionRequestDTO, UpdateOpcionRequestDTO } from '../repositories/dtos/OpcionDTO';
import { Opcion, OpcionListData } from './models/OpcionDomain';
import { OpcionMapper } from './mappers/OpcionMapper';
import { ValidationError, NotFoundError } from './exceptions/CustomExceptions';

export class OpcionBL implements IOpcionBL {

  constructor(private opcionRepository: IOpcionRepository) {}

  /**
   * Crear una nueva opción
   */
  async createOpcion(clienteId: number, data: OpcionRequestDTO): Promise<Opcion> {
    // Validar clienteId
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateOpcionData(data);

    // Crear la opción
    const opcionDTO = await this.opcionRepository.createOpcion(clienteId, data);

    // Transformar a modelo de dominio
    return OpcionMapper.toDomain(opcionDTO);
  }

  /**
   * Obtener opción por ID
   */
  async getOpcionById(opcionId: number, clienteId: number): Promise<Opcion> {
    // Validar IDs
    if (!opcionId || opcionId <= 0) {
      throw new ValidationError('El opcionId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Buscar opción
    const opcionDTO = await this.opcionRepository.getOpcionById(opcionId, clienteId);

    if (!opcionDTO) {
      throw new NotFoundError(`Opción con ID ${opcionId} no encontrada`);
    }

    // Transformar a modelo de dominio
    return OpcionMapper.toDomain(opcionDTO);
  }

  /**
   * Listar opciones por grupo
   */
  async listOpcionesByGrupo(clienteId: number, grupoOpcionId: number): Promise<OpcionListData> {
    // Validar IDs
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    if (!grupoOpcionId || grupoOpcionId <= 0) {
      throw new ValidationError('El grupoOpcionId debe ser un número positivo válido');
    }

    // Obtener opciones
    const opcionesDTO = await this.opcionRepository.listOpcionesByGrupo(clienteId, grupoOpcionId);

    // Transformar a modelos de dominio
    const opciones = OpcionMapper.toDomainList(opcionesDTO);

    return {
      opciones,
      total: opciones.length
    };
  }

  /**
   * Actualizar opción
   */
  async updateOpcion(
    opcionId: number,
    clienteId: number,
    data: UpdateOpcionRequestDTO
  ): Promise<Opcion> {
    // Validar IDs
    if (!opcionId || opcionId <= 0) {
      throw new ValidationError('El opcionId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateUpdateOpcionData(data);

    // Verificar que la opción existe
    const existingOpcion = await this.opcionRepository.getOpcionById(opcionId, clienteId);
    if (!existingOpcion) {
      throw new NotFoundError(`Opción con ID ${opcionId} no encontrada`);
    }

    // Actualizar la opción
    const opcionDTO = await this.opcionRepository.updateOpcion(opcionId, clienteId, data);

    if (!opcionDTO) {
      throw new NotFoundError(`Opción con ID ${opcionId} no encontrada`);
    }

    // Transformar a modelo de dominio
    return OpcionMapper.toDomain(opcionDTO);
  }

  /**
   * Eliminar opción (soft delete)
   */
  async deleteOpcion(opcionId: number, clienteId: number): Promise<Opcion> {
    // Validar IDs
    if (!opcionId || opcionId <= 0) {
      throw new ValidationError('El opcionId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Eliminar la opción
    const opcionDTO = await this.opcionRepository.deleteOpcion(opcionId, clienteId);

    if (!opcionDTO) {
      throw new NotFoundError(`Opción con ID ${opcionId} no encontrada`);
    }

    // Transformar a modelo de dominio
    return OpcionMapper.toDomain(opcionDTO);
  }

  /**
   * Validar datos de creación de opción
   */
  private validateOpcionData(data: OpcionRequestDTO): void {
    if (!data.grupoOpcionId || data.grupoOpcionId <= 0) {
      throw new ValidationError('El grupoOpcionId es requerido y debe ser un número positivo');
    }

    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new ValidationError('El nombre es requerido');
    }

    if (data.nombre.length > 100) {
      throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }

    if (data.precioAdicional !== undefined && data.precioAdicional < 0) {
      throw new ValidationError('El precioAdicional no puede ser negativo');
    }
  }

  /**
   * Validar datos de actualización de opción
   */
  private validateUpdateOpcionData(data: UpdateOpcionRequestDTO): void {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new ValidationError('El nombre es requerido');
    }

    if (data.nombre.length > 100) {
      throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }

    if (data.precioAdicional !== undefined && data.precioAdicional < 0) {
      throw new ValidationError('El precioAdicional no puede ser negativo');
    }
  }
}
